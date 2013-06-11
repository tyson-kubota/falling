#pragma strict
static var flipMultiplier : int = -1;
static var landscapeFlipped:boolean = false;
static var levelEndSlowdown:int = 0;
var targetFPS : int = 30;
static var isTablet : boolean = false;
static var iOSGen = iPhone.generation;

enum iPads {
	iPadUnknown,
	iPad1Gen,
	iPad2Gen,
	iPad3Gen,
	iPad4Gen,
	iPadMini1Gen
};

function Awake () {
	Application.targetFrameRate = targetFPS;
	
	if (iPhoneInput.orientation == iPhoneOrientation.LandscapeRight) {
		flipMultiplier = -1;
		Screen.orientation = ScreenOrientation.LandscapeRight;
		landscapeFlipped = true;
	}
	else {	Screen.orientation = ScreenOrientation.LandscapeLeft;
		flipMultiplier = 1;
	}
	
	iOSGen = iPhone.generation;
	
	if ((iOSGen && 
	(iPads.iPad1Gen | iPads.iPad2Gen | iPads.iPad3Gen | iPads.iPad4Gen | iPads.iPadMini1Gen | iPads.iPadUnknown)) != 0) {
		isTablet = true;
		flipMultiplier = 2 * flipMultiplier;
		//Debug.Log("this is an " + iOSGen  + " iPad!");
	};
	
	DontDestroyOnLoad (this);
//	Application.LoadLevel("Falling-scene-menu");
}

function Update () {

}