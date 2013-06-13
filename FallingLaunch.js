#pragma strict
static var flipMultiplier : float = -1;
static var landscapeFlipped:boolean = false;
static var levelEndSlowdown:int = 0;
var targetFPS : int = 30;
static var isTablet : boolean = false;
static var iOSGen;

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
	
//	Debug.Log("this is an " + iOSGen  + " device!");
	
//	if ((iOSGen && 
//	(iPads.iPad1Gen | iPads.iPad2Gen | iPads.iPad3Gen | iPads.iPad4Gen | iPads.iPadMini1Gen | iPads.iPadUnknown)) != 0) {

	if (iOSGen.ToString().Contains("iPad")) {
		isTablet = true;
		flipMultiplier = 2 * flipMultiplier;
		//Debug.Log("this is an " + iOSGen  + " iPad!");
	}
	else {
		isTablet = false;
		flipMultiplier = 1.5 * flipMultiplier;
		//Debug.Log("this is not a tablet, but rather an " + iOSGen);
	}
	
	DontDestroyOnLoad (this);
//	Application.LoadLevel("Falling-scene-menu");
}

function Update () {

}