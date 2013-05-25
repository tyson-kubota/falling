#pragma strict

var PlayerController : MoveController;
var ScoreController : ScoreController;
var LifeController : lifeCountdown;

var UIscriptName : GameObject;
var UIscriptComponent : fallingUITest;

function Start () {
	PlayerController = GetComponent("MoveController");
	ScoreController = GetComponent("ScoreController");
	LifeController = GetComponent("lifeCountdown");
	UIscriptComponent = UIscriptName.GetComponent("fallingUITest");

	PlayerController.enabled = false;
	ScoreController.enabled = false;
	UIscriptComponent.HideGUI();
}

function EndIntro () {
	PlayerController.enabled = true;
	ScoreController.enabled = true;
	LifeController.enabled = true;
	UIscriptComponent.UnhideGUI();
}