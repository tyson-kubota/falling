#pragma strict

var PlayerController : controllerITween2;
var ScoreController : ScoreController;
var LifeController : lifeCountdown;

var UIscriptName : GameObject;
var UIscriptComponent : fallingUITest;

var outroShards : GameObject;
//var outroStaticShards : GameObject;
var outroCompletedOrb : GameObject;

function Start () {
	PlayerController = GetComponent("controllerITween2");
	ScoreController = GetComponent("ScoreController");
	LifeController = GetComponent("lifeCountdown");
	UIscriptComponent = UIscriptName.GetComponent("fallingUITest");
}

function BeginOutro () {
	ScoreController.enabled = false;
	LifeController.enabled = false;	
	
//	outroStaticShards.active = false;	
//	outroShards.active = true;
		
	PlayerController.lerpSlowdown(1);
	yield WaitForSeconds (1);
	PlayerController.enabled = false;
	UIscriptComponent.BeginOutroUI();
	ScoreController.IncrementScore(35);
}

function CompletedOrb () {
	outroCompletedOrb.active = true;	
	outroShards.active = false;
	UIscriptComponent.GameCompleteUI();
}