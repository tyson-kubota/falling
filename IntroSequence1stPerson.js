#pragma strict

var PlayerController : MoveController;
var ScoreController : ScoreController;
var LifeController : lifeCountdown;
var DeathGUITrigger : IntroUITrigger;
var destructible : ProjectileDestroy;
var shardColor : Color;

function Start () {
	PlayerController = GetComponent("MoveController");
	ScoreController = GetComponent("ScoreController");
	LifeController = GetComponent("lifeCountdown");

    if (!FallingLaunch.NewGamePlus) {
		PlayerController.enabled = false;
		ScoreController.enabled = false;
        if (!FallingLaunch.isVRMode) {
		  FallingPlayer.UIscriptComponent.HideGUI();
        }

	   	for(var shard : GameObject in GameObject.FindGameObjectsWithTag("Shard")) {
	    	destructible = shard.GetComponent(ProjectileDestroy);
	    	var shardRenderer : Renderer = shard.GetComponent.<Renderer>();
	    	shardRenderer.enabled = false;
	    	shard.GetComponent.<Rigidbody>().isKinematic = true;
	    	destructible.enabled = false;
	    	shardColor = shardRenderer.material.color;
	    }
    }
    else if (FallingLaunch.NewGamePlus) {
		PlayerController.enabled = true;
		ScoreController.enabled = true;
		LifeController.enabled = true;
		//FallingPlayer.UIscriptComponent.HideGUI();
		FallingPlayer.UIscriptComponent.UnhideGUI();
    }


}

function EndIntro (playAudio : boolean) {
	PlayerController.enabled = true;
	ScoreController.enabled = true;
	LifeController.enabled = true;

	if (!FallingLaunch.NewGamePlus) {
		FallingPlayer.UIscriptComponent.UnhideGUI();
	}

    for(var shard : GameObject in GameObject.FindGameObjectsWithTag("Shard")) {
        destructible = shard.GetComponent(ProjectileDestroy);
    	shard.GetComponent.<Rigidbody>().isKinematic = false;
    	//yield WaitForSeconds(.25);
    	var shardAudio : AudioSource = shard.GetComponent.<AudioSource>();
    	if (shardAudio && playAudio) {shardAudio.Play();}

    	shard.GetComponent.<Renderer>().enabled = true;
    	destructible.enabled = true;
    }

	var start = shardColor;
    var end = Color.black;
    var i = 0.0;
    var step = 1.0/5;

    while (i <= 1.0) {
        i += step * Time.deltaTime;
        for(var shard : GameObject in GameObject.FindGameObjectsWithTag("Shard"))
        shard.GetComponent.<Renderer>().material.color = Color.Lerp(start, end, i);
        yield;
    	}
}

function DeathHelp() {
	DeathGUITrigger.ShowHelpAfterDeath();
}
