#pragma strict

var PlayerController : MoveController;
var ScoreController : ScoreController;
var LifeController : lifeCountdown;

function Start () {
	PlayerController = GetComponent("MoveController");
	ScoreController = GetComponent("ScoreController");
	LifeController = GetComponent("lifeCountdown");

	PlayerController.enabled = false;
	ScoreController.enabled = false;
	FallingPlayer.UIscriptComponent.HideGUI();
}

function EndIntro () {
	PlayerController.enabled = true;
	ScoreController.enabled = true;
	LifeController.enabled = true;
	FallingPlayer.UIscriptComponent.UnhideGUI();
}