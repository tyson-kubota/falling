#pragma strict
static var flipMultiplier : float = 1.0;
static var levelEndSlowdown : float = 0.0;
static var alreadyLaunched : boolean = false;
static var NewGamePlus : boolean = false;

var targetFPS : int = 30;
static var isTablet : boolean = false;

static var tiltable : boolean = false;

static var initialInputDeviceOrientation : DeviceOrientation;
static var cachedScreenOrientation : ScreenOrientation;

static var hasSetAccel : boolean = false;
static var restPosition : Vector3;
static var neutralPosFlat : Vector3 = Vector3(0,0,-1.0);
static var neutralPosTiltedRegular : Vector3 = Vector3(.6,0,-.9);
static var neutralPosTiltedFlipped : Vector3 = Vector3(-.6,0,-.9);
static var neutralPosVerticalRegular = Vector3(1.0,0,0.0);
static var neutralPosVerticalFlipped = Vector3(-1.0,0,0.0);
static var neutralPosVertical : Vector3 = neutralPosVerticalRegular;
static var neutralPosTilted : Vector3 = neutralPosTiltedRegular;
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
static var vrModeAnalyticsString : String = "nonVRMode:";
static var shouldShowVRIntroUI : boolean = false;
static var showingVREndGameUI : boolean = false;

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
	isVRMode = false; // User can override this via start menu UI
}

function Start () {

	// PlayerPrefs.DeleteAll();
	if (!alreadyLaunched) {

//		TestFlightUnity.TestFlight.TakeOff( testFlightToken );
		if (Debug.isDebugBuild) {
			Debug.Log("Your device orientation is " + Input.deviceOrientation + "!");
		}

		initialInputDeviceOrientation = Input.deviceOrientation;
		cachedScreenOrientation = Screen.orientation;

		// this is necessary to override Unity 4's auto-orientation code
		Input.compensateSensors = false;

		// Debug.Log("Device orientation after Input.compensateSensors = false is " + Input.deviceOrientation);

		var iOSGen = iOS.Device.generation;

		// Debug.Log("this is an " + iOSGen  + " device!");

		// Reduce target framerate for very old iOS devices:
		if (iOSGen == UnityEngine.iOS.DeviceGeneration.iPad1Gen || iOSGen == UnityEngine.iOS.DeviceGeneration.iPad2Gen ||
		iOSGen == UnityEngine.iOS.DeviceGeneration.iPhone4 || iOSGen == UnityEngine.iOS.DeviceGeneration.iPodTouch4Gen ||
		iOSGen.ToString().Contains("iPhone3G")) {
			QualitySettings.DecreaseLevel(false);
			targetFPS = 30;
		}
		else {
			targetFPS = 60;
		}

		var screenDPI : float = Screen.dpi;
		var screenWidthInInches: float = (Screen.width / screenDPI);
		var screenHeightInInches: float = (Screen.height / screenDPI);

		var hasLargeScreen: boolean = screenDPI > 0 && (screenWidthInInches > 8 && screenHeightInInches > 5);
		// Debug.Log("Screen DPI: " + screenDPI);
		// Debug.Log("Screen width in inches: " + screenWidthInInches);
		// Debug.Log("Screen height in inches: " + screenHeightInInches);

		if (iOSGen.ToString().Contains("iPad") || hasLargeScreen) {
			// Debug.Log("Looks like a tablet!");
			isTablet = true;
		} else {
			// Debug.Log("Based on reported screen size, not a tablet...");
			isTablet = false;
		}

		if (!Input.gyro.enabled) {
			Debug.Log("Your device doesn't have a gyroscope...");
		}

	//	if ((iOSGen &&
	//	(iPads.iPad1Gen | iPads.iPad2Gen | iPads.iPad3Gen | iPads.iPad4Gen | iPads.iPadMini1Gen | iPads.iPadUnknown)) != 0) {

		flipMultiplier = isTablet ? 2 * flipMultiplier : 1.5 * flipMultiplier;

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

function EnableVRMode () {
	isVRMode = true;
	vrModeAnalyticsString = "isVRMode:";
}

function DisableVRMode () {
	isVRMode = false;
	vrModeAnalyticsString = "nonVRMode:";
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
	Calibrate();
}

// Only relevant in non-VR mode. 
// In VR mode, we simply set landscapeLeft in all cases to meet the Google Cardboard SDK's expectations.
function LockDeviceOrientation (waitTime: float) {
	cachedScreenOrientation = Screen.orientation;

	// Our outer function shouldn't actually get called if in VR mode, but for
	// safety, defensively force landscapeLeft and early return in that case...
	if (isVRMode) {
		LockLandscapeLeftOrientation(isVRMode);
		return;
	}

	// Let the device auto-rotate if necessary:
	Screen.autorotateToLandscapeLeft = true;
	Screen.autorotateToLandscapeRight = true;
	Screen.orientation = ScreenOrientation.AutoRotation;

	// iOS/Unity can give strange/wrong orientation values while screen is mid-rotation
	// or close to flat, so we manually add a wait yield (~1s).
	yield WaitForSeconds(waitTime);

	switch (Input.deviceOrientation) {
		case DeviceOrientation.LandscapeLeft:
			LockLandscapeLeftOrientation(isVRMode);

			GameAnalyticsSDK.GameAnalytics.NewDesignEvent ("DeviceOrientationSet:LandscapeLeft", 0.0);
			break;
		case DeviceOrientation.LandscapeRight:
			LockLandscapeRightOrientation();

			GameAnalyticsSDK.GameAnalytics.NewDesignEvent ("DeviceOrientationSet:LandscapeRight", 0.0);
			break;
		default:
			HandleDeviceOrientationMismatch();

			GameAnalyticsSDK.GameAnalytics.NewDesignEvent ("DeviceOrientationCheck:NonLandscape:" + Input.deviceOrientation, 0.0);
			break;
	}

	// These are handled within each individual LockLandscapeLeft/Right function:
	// Screen.autorotateToLandscapeLeft = false;
	// Screen.autorotateToLandscapeRight = false;
	
	Calibrate();

	if (Debug.isDebugBuild) {
		Debug.Log("Final screen orientation is: " + Screen.orientation);
	}

	return;
}


function HandleDeviceOrientationMismatch() {
	if (initialInputDeviceOrientation != Input.deviceOrientation) {

	    GameAnalyticsSDK.GameAnalytics.NewDesignEvent (
	    	"DeviceOrientationCheck:CachedAndCurrentMismatch:" + Input.deviceOrientation + ":" + initialInputDeviceOrientation,
	    	0.0
    	);

    	if (initialInputDeviceOrientation == DeviceOrientation.LandscapeLeft) {
    		if (Debug.isDebugBuild) {
				Debug.Log("There's been a cached/current deviceOrientation mismatch. Setting to landscape left...");
			}
			initialInputDeviceOrientation = Input.deviceOrientation;
    		LockLandscapeLeftOrientation(isVRMode);
    	} else if (initialInputDeviceOrientation == DeviceOrientation.LandscapeRight) {
    		if (Debug.isDebugBuild) {
    			Debug.Log("There's been a cached/current deviceOrientation mismatch. Setting to landscape right...");
    		}
    		initialInputDeviceOrientation = Input.deviceOrientation;
			LockLandscapeRightOrientation();
    	} else {
			DefaultToLandscapeLeftOrientation();		
    	}

	} else {
		if (Debug.isDebugBuild) {
			Debug.Log("InitialInputDeviceOrientation and Input.deviceOrientation do match, as " + Input.deviceOrientation);
		}
		GameAnalyticsSDK.GameAnalytics.NewDesignEvent ("DeviceOrientationSet:CachedAndCurrentMatch:" + Input.deviceOrientation, 0.0);

		// But we must choose left or right, ultimately...
		DefaultToLandscapeLeftOrientation();
	}

	return;
}

function DefaultToLandscapeLeftOrientation() {
	if (Screen.orientation == ScreenOrientation.LandscapeRight || cachedScreenOrientation == ScreenOrientation.LandscapeRight ||
		Input.deviceOrientation == DeviceOrientation.LandscapeRight) {
			if (Debug.isDebugBuild) {
				Debug.Log("Picking LandscapeRight, to match Screen.orientation or Input.deviceOrientation");
			}
			LockLandscapeRightOrientation();
	} else {
		if (Debug.isDebugBuild) {
			Debug.Log("Defaulting to LandscapeLeft, since Screen.orientation / Input.deviceOrientation were not LandscapeRight");
		}
		LockLandscapeLeftOrientation(isVRMode);
	}	
}

function LockLandscapeLeftOrientation (isVR : boolean) {
	if (Debug.isDebugBuild) {Debug.Log("Locking LandscapeLeft orientation with isVR " + isVR);}

	// if the device is held in landscapeRight already,
	// the autorotateToLandscapeRight = false below is not enough 
	// to force the left-hand orientation needed for VR mode.
	if (isVR) {
		// We disable all autorotation before forcing the new orientation, to prevent
		// UnityViewControllerBaseiOS.mm `UnityShouldAutorotate` assert crashes:
		Screen.autorotateToLandscapeLeft = false;
		Screen.autorotateToLandscapeRight = false;
		Screen.autorotateToPortrait = false;
		Screen.autorotateToPortraitUpsideDown = false;
		Screen.orientation = ScreenOrientation.LandscapeLeft;
	}

	cachedScreenOrientation = Screen.orientation;

	// Further interaction with Screen.autorotate... values will crash 
	// the app if we've already forced a given Screen.orientation 
	// (see UnityViewControllerBaseiOS.mm assert note above), so the below
	// is for non-VR mode only:
	if (!isVR) {
		Screen.autorotateToLandscapeRight = false;
	}

	neutralPosTilted = neutralPosTiltedRegular;
	neutralPosVertical = neutralPosVerticalRegular;
	flipMultiplier = 1.0;
}

function LockLandscapeRightOrientation () {
	if (Debug.isDebugBuild) {Debug.Log("Locking LandscapeRight orientation");}

	// Screen.orientation = ScreenOrientation.LandscapeRight;
	cachedScreenOrientation = Screen.orientation;

	Screen.autorotateToLandscapeLeft = false;

	neutralPosTilted = neutralPosTiltedFlipped;
	neutralPosVertical = neutralPosVerticalFlipped;
	flipMultiplier = -1.0;
}