#pragma strict

var PlayerObject : GameObject;
var introCamera : GameObject;
var mainCamera : GameObject;

var UIscriptName : GameObject;
var UIscriptComponent : fallingUITest;

function Start () {
	UIscriptComponent = UIscriptName.GetComponent(fallingUITest);
	UIscriptComponent.HideGUI();
	
}

function EndIntro () {
	FallingLaunch.levelEndSlowdown = 8000;
	PlayerObject.active = true;
	introCamera.active = false;
	mainCamera.active = true;
}