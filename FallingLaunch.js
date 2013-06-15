#pragma strict
static var flipMultiplier : float = -1;
static var landscapeFlipped:boolean = false;
static var levelEndSlowdown:int = 0;
var targetFPS : int = 30;
static var isTablet : boolean = false;
static var iOSGen;

var titleCard : GameObject;

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
//	Debug.Log("Your screen dpi is " + Screen.dpi + "!");

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

	if (camera.main.aspect < 1.5) {
		titleCard.transform.Translate(-200,0,0);
	}
	
	DontDestroyOnLoad (this);
//	Application.LoadLevel("Falling-scene-menu");
}

function Update () {

}