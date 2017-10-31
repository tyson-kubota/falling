#pragma strict

var PlayerObject : GameObject;
var introCamera : GameObject;
var mainCamera : GameObject;

function Start () {
    if (!FallingLaunch.isVRMode) {
	   FallingPlayer.UIscriptComponent.HideGUI();
    }
}

function EndIntro () {
	FallingLaunch.levelEndSlowdown = 8000;
	PlayerObject.active = true;
	introCamera.active = false;
	mainCamera.active = true;
}
