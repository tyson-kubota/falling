#pragma strict

public var speedLinesTexture : Texture2D;
public var fadeSpeed = 1;

function Start(){
}

function speedLinesUp(){
		iTween.CameraFadeAdd(speedLinesTexture);
		iTween.CameraFadeTo(0.85,.25);
		yield WaitForSeconds(.25);
		iTween.CameraFadeTo(0.0,fadeSpeed);
}
