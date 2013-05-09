#pragma strict

var buttonScaleFactor : float;
var scriptName : GameObject;

function Start () {

	if (UI.isHD == true) {
	buttonScaleFactor = (((Screen.height / 2.0) - 100.0) / Screen.height);
	}
	else {
	buttonScaleFactor = (((Screen.height / 2.0) - 50.0) / Screen.height);
	}

//	loadingLabel.positionFromCenter(0f, 0f);
	}

function ShowIcon(icon : UISprite) {
	icon.hidden = false;
	icon.alphaFromTo( 1.0f, 0.0f, 0.9f, Easing.Sinusoidal.easeIn);
	yield WaitForSeconds (6);
	icon.alphaTo( 2.0f, 0.0f, Easing.Sinusoidal.easeOut);
	yield WaitForSeconds (2);
	icon.hidden = true;
}
