#pragma strict

var PlayerController : MoveController;
var ScoreController : ScoreController;
var LifeController : lifeCountdown;
var destructible : ProjectileDestroy;

function Start () {
	PlayerController = GetComponent("MoveController");
	ScoreController = GetComponent("ScoreController");
	LifeController = GetComponent("lifeCountdown");

	PlayerController.enabled = false;
	ScoreController.enabled = false;
	FallingPlayer.UIscriptComponent.HideGUI();
   	
   	for(var shard : GameObject in GameObject.FindGameObjectsWithTag("Shard")) {
    	destructible = shard.GetComponent(ProjectileDestroy);
    	shard.renderer.enabled = false;
    	shard.rigidbody.isKinematic = true;
    	destructible.enabled = false;
    }
    
}

function EndIntro () {
	PlayerController.enabled = true;
	ScoreController.enabled = true;
	LifeController.enabled = true;
	FallingPlayer.UIscriptComponent.UnhideGUI();
	
    for(var shard : GameObject in GameObject.FindGameObjectsWithTag("Shard")) {
        destructible = shard.GetComponent(ProjectileDestroy);
    	shard.rigidbody.isKinematic = false;
    	//yield WaitForSeconds(.25);
    	shard.renderer.enabled = true;
    	destructible.enabled = true;
    }
    
}