#pragma strict
static var flipMultiplier : float = 1.0;
static var levelEndSlowdown : float = 0.0;
static var alreadyLaunched : boolean = false;
static var hasSetOrientation : boolean = false;
static var NewGamePlus : boolean = false;

var targetFPS : int = 30;
static var isTablet : boolean = false;

static var tiltable : boolean = false;
static var hasSetAccel : boolean = false;
static var restPosition : Vector3;
static var neutralPosFlat : Vector3 = Vector3(0,0,-1.0);
static var neutralPosTiltedRegular : Vector3 = Vector3(.6,0,-.9);
static var neutralPosTiltedFlipped : Vector3 = Vector3(-.6,0,-.9);
static var neutralPosVerticalRegular = Vector3(1.0,0,0.0);
static var neutralPosVerticalFlipped = Vector3(-1.0,0,0.0);
static var neutralPosVertical : Vector3;
static var neutralPosTilted : Vector3;
static var accelerator : Vector3;
static var calibrationRotation : Quaternion;
static var acceleratorSnapshot : Vector3;
static var invertHorizAxisVal : int;
static var invertVertAxisVal : int;

static var LoadedLatestLevel : boolean = false;

static var levelAchieved : int;
static var debugMode : boolean = false; // true;

var testFlightToken : String;

static var isVRMode : boolean = false;

//GameAnalytics variables
static var secondsAlive : float = 0;
static var secondsInLevel : float = 0;
static var thisLevel : String = "unknownLevel";
static var thisLevelArea : String = "start";
//var myTimer : GAUserTimer;

enum iPads {
	iPadUnknown,
	iPad1Gen,
	iPad2Gen,
	iPad3Gen,
	iPad4Gen,
	iPadMini1Gen
};

function Awake () {
	isVRMode = false; // TODO: Let user pick this via UI
}

function Start () {


	if (!alreadyLaunched) {
		
//		TestFlightUnity.TestFlight.TakeOff( testFlightToken );
		Debug.Log("Your device orientation is " + Input.deviceOrientation + "!");
		
		// if (!hasSetOrientation) {
		// 	if (iPhoneInput.orientation == iPhoneOrientation.LandscapeRight) {
		// 		flipMultiplier = flipMultiplier * -1;
		// 		//Debug.Log("I'm in LandscapeRight!");
		// 		Screen.orientation = ScreenOrientation.LandscapeRight;
		// 		neutralPosTilted = neutralPosTiltedFlipped;
		// 	}
		// 	else {	Screen.orientation = ScreenOrientation.LandscapeLeft;
		// 		flipMultiplier = flipMultiplier * 1;
		// 		//Debug.Log("I'm in LandscapeLeft, or Portrait, or FaceDown/Up!");
		// 		neutralPosTilted = neutralPosTiltedRegular;
		// 	}	

		// 	hasSetOrientation = true;
		// }

		// this is necessary to override Unity 4's auto-orientation code
		Input.compensateSensors = false;

		// NB: still doesn't work, sensor 'correctness' depends on starting device orientation as read by Cardboard.
		// HACK: Force landscape left orientation for Cardboard compatibility. 
		// TODO: make conditional on isVRMode?
		// Screen.orientation = ScreenOrientation.LandscapeLeft;
	
		var iOSGen = iOS.Device.generation;
		
	//	Debug.Log("this is an " + iOSGen  + " device!");
	//	Debug.Log("Your screen dpi is " + Screen.dpi + "!");
		if (iOSGen == UnityEngine.iOS.DeviceGeneration.iPad1Gen || iOSGen == UnityEngine.iOS.DeviceGeneration.iPad2Gen || 
		iOSGen == UnityEngine.iOS.DeviceGeneration.iPhone4 || iOSGen == UnityEngine.iOS.DeviceGeneration.iPodTouch4Gen ||
		iOSGen.ToString().Contains("iPhone3G")) {
			QualitySettings.DecreaseLevel(false);
			targetFPS = 30;
		}
		else {
			targetFPS = 60;
		}	
		
		if (iOSGen.ToString().Contains("iPad")) {
			isTablet = true;
		}
		
		if (Screen.dpi > 0) {
			if ((Screen.width / Screen.dpi) > 5 || (Screen.height / Screen.dpi) > 5) {
				isTablet = true;
				//Debug.Log("Looks like a tablet!");
			}
			else {
				isTablet = false;
				//Debug.Log("Based on reported screen size, not a tablet...");
			}
		}
		
		if (!Input.gyro.enabled) {
			Debug.Log("Your device doesn't have a gyroscope...");
		}

	//	if ((iOSGen && 
	//	(iPads.iPad1Gen | iPads.iPad2Gen | iPads.iPad3Gen | iPads.iPad4Gen | iPads.iPadMini1Gen | iPads.iPadUnknown)) != 0) {
		
		flipMultiplier = (isTablet == true) ? (2 * flipMultiplier) : (1.5 * flipMultiplier);

		DontDestroyOnLoad (this);
		alreadyLaunched = true;
		Application.targetFrameRate = targetFPS;
		
		Application.LoadLevel("Falling-scene-menu");
	}
	else {
		Destroy(this.gameObject);
	}
		
//		myTimer = new GAUserTimer("Timer", "Session Length");
//		myTimer.Start();
	//Calibrate();
	//Calibrating in Start here was unwise, in case the user is swinging 
	//the device around and the accelerometer readings haven't settled yet.
}

function OnApplicationPause(pauseStatus: boolean) {
    //paused = pauseStatus;
	if (pauseStatus) {
//    	myTimer.Stop();
//    	GoogleAnalytics.instance.Add(myTimer);
//		GoogleAnalytics.instance.Dispatch();
	}
}

function OnLevelWasLoaded (level : int) {
	//loadedLevel = Application.loadedLevelName;
//	var loadedLevel : GALevel = new GALevel();
//	GoogleAnalytics.instance.Add(loadedLevel);
//	GoogleAnalytics.instance.Dispatch();
	
	//Debug.Log("my loaded level is... " + Application.loadedLevelName);
}

function SetAxesInversion () {
	if (PlayerPrefs.GetInt("invertHorizAxis", 0) == 1) {invertHorizAxisVal = -1;}
	else {invertHorizAxisVal = 1;}
	if (PlayerPrefs.GetInt("invertVertAxis", 0) == 1) {invertVertAxisVal = -1;}
	else {invertVertAxisVal = 1;}
}

function Calibrate () {
	tiltable = false;

	if (PlayerPrefs.GetInt("TiltNeutral", 0) == 1) {restPosition = neutralPosTilted;}
	else if (PlayerPrefs.GetInt("TiltNeutral", 0) == 2) {restPosition = neutralPosVertical;}
	else {restPosition = neutralPosFlat;}
	
	SetAxesInversion();
	//acceleratorSnapshot = Input.acceleration;
	acceleratorSnapshot = Vector3(0.0,0.0,-1.0);
	calibrationRotation = Quaternion.FromToRotation(acceleratorSnapshot, restPosition);

	tiltable = true;
}

function CalibrateInLevel () {
	tiltable = false;
	
	if (PlayerPrefs.GetInt("TiltNeutral", 0) == 1) {restPosition = neutralPosTilted;}
	else if (PlayerPrefs.GetInt("TiltNeutral", 0) == 2) {restPosition = neutralPosVertical;}
	else {restPosition = neutralPosFlat;}

	SetAxesInversion();
	calibrationRotation = Quaternion.FromToRotation(acceleratorSnapshot, restPosition);

	tiltable = true;
}


function ChangeTilt (toFlat : int) {
	if (toFlat == 2) {
		PlayerPrefs.SetInt("TiltNeutral", 2);
		Debug.Log("tilt set to vertical.");
	}	
	else if (toFlat == 0) {
		PlayerPrefs.SetInt("TiltNeutral", 0);
		Debug.Log("tilt set to flat.");
	}
	else {
		PlayerPrefs.SetInt("TiltNeutral", 1);
		Debug.Log("tilt set to angled.");
	}	
	CalibrateInLevel();
}

// function Update () {
// 	ListCurrentAccelerometer();
// }
// 
// function ListCurrentAccelerometer() {
// 	Debug.Log ("Your rotation is " + Input.acceleration);
// }