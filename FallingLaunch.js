#pragma strict
static var flipMultiplier : int = -1;
static var landscapeFlipped:boolean = false;
static var levelEndSlowdown:int = 0;
var targetFPS : int = 30;

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
	
	DontDestroyOnLoad (this);
//	Application.LoadLevel("Falling-scene-menu");
}

function Update () {

}