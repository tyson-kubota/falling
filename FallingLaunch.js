#pragma strict
static var flipMultiplier : float = -1;
static var landscapeFlipped:boolean = false;
static var levelEndSlowdown:int = 0;
static var alreadyLaunched:boolean = false;
static var didTutorial:boolean = false;

var targetFPS : int = 30;
static var isTablet : boolean = false;

//GameAnalytics variables
static var secondsAlive : float = 0;
static var secondsInLevel : float = 0;
static var thisLevel : String = "unknownLevel";
static var thisLevelArea : String = "start";

enum iPads {
	iPadUnknown,
	iPad1Gen,
	iPad2Gen,
	iPad3Gen,
	iPad4Gen,
	iPadMini1Gen
};

function Awake () {
	if (!alreadyLaunched) {
		
		if (iPhoneInput.orientation == iPhoneOrientation.LandscapeRight) {
			flipMultiplier = -1;
			Screen.orientation = ScreenOrientation.LandscapeRight;
			landscapeFlipped = true;
		}
		else {	Screen.orientation = ScreenOrientation.LandscapeLeft;
			flipMultiplier = 1;
		}
		
		var iOSGen = iPhone.generation;
		
	//	Debug.Log("this is an " + iOSGen  + " device!");
	//	Debug.Log("Your screen dpi is " + Screen.dpi + "!");
		if (iOSGen == iPhoneGeneration.iPad1Gen || iOSGen == iPhoneGeneration.iPad2Gen || 
		iOSGen == iPhoneGeneration.iPhone4 || iOSGen == iPhoneGeneration.iPodTouch4Gen ||
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
}

function Update () {

}