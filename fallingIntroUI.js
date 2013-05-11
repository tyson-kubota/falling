#pragma strict

var scriptName : GameObject;

function Start () {
	}

function ShowIcon(icon : UISprite) {
	icon.hidden = false;
	icon.alphaFromTo( 1.0f, 0.0f, 0.9f, Easing.Sinusoidal.easeIn);
	yield WaitForSeconds (6);
	icon.alphaTo( 2.0f, 0.0f, Easing.Sinusoidal.easeOut);
	yield WaitForSeconds (2);
	icon.hidden = true;
}
