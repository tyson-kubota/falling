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

function ShowIcon(icon : UIButton) {
	icon.hidden = false;
	icon.alphaFromTo( 1.0f, 0.0f, 0.9f, Easing.Sinusoidal.easeIn);
	yield WaitForSeconds (4);
	icon.alphaTo( 1.0f, 0.0f, Easing.Sinusoidal.easeOut);
	yield WaitForSeconds (1);
	icon.hidden = true;
}
