#pragma strict

var scriptName : GameObject;

function Start () {
	}

function ShowIcon(icon : UISprite, timer : float) {
	icon.hidden = false;
	icon.alphaFromTo( 1.0f, 0.0f, 1.0f, Easing.Sinusoidal.easeIn);
	yield WaitForSeconds (timer);
	icon.alphaTo( 2.0f, 0.0f, Easing.Sinusoidal.easeOut);
	yield WaitForSeconds (2);
	icon.hidden = true;
}
