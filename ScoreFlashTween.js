#pragma strict

//public var flashTexture : Texture2D;
public var fadeSpeed = 0.5;

function Start(){
	iTween.CameraFadeTo(0.0,0.0f);
}

function flashUp(){
//	iTween.CameraFadeAdd(flashTexture);
	iTween.CameraFadeTo(0.85,.25);
	yield WaitForSeconds(.25);
	iTween.CameraFadeTo(0.0,fadeSpeed);
}