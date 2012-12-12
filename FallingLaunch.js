#pragma strict
static var flipMultiplier : int = -1;
static var landscapeFlipped:boolean = false;

function Awake () {
	if (iPhoneInput.orientation == iPhoneOrientation.LandscapeRight) {
		flipMultiplier = -1;
		Screen.orientation = ScreenOrientation.LandscapeRight;
		landscapeFlipped = true;
	}
	else {	Screen.orientation = ScreenOrientation.LandscapeLeft;
		flipMultiplier = 1;
	}
	
	DontDestroyOnLoad (this);
	Application.LoadLevel("Falling-scene2");
}

function Update () {

}