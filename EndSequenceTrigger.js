#pragma strict

var Player : GameObject;
var EndScriptComponent : EndSequence1stPerson;

var shards : Array;
var endDiamond : GameObject;

var UIscriptName : GameObject;
var UIscriptComponent : fallingUITest;

function Start () {
	EndScriptComponent = Player.GetComponent("EndSequence1stPerson");
	UIscriptComponent = UIscriptName.GetComponent("fallingUITest");
}

function OnTriggerEnter (other : Collider) {
	if (other.gameObject.CompareTag ("Player") && lifeCountdown.inOutro == false) {
		lifeCountdown.inOutro = true;
		if (EndScriptComponent) {
		EndScriptComponent.BeginOutro();
		}
		
		for(var shard : GameObject in GameObject.FindGameObjectsWithTag("Shard"))	
			shard.animation.Play();
	
		if (audio) {audio.Play();}

		FallingPlayer.ScoreFlashTextureScript.FadeFlash (8.0, FadeDir.In);
		//yield WaitForSeconds (1.0);
		//FallingPlayer.ScoreFlashTextureScript.FadeFlash (0.5, FadeDir.Out);
	}
}


function GetChildren(obj : GameObject) : Array{
    var children : Array = new Array();
    for (var child : Transform in obj.transform) {
        children.Add(child.gameObject);
    }
    return children;
}

function SwapDiamonds(){
	FallingPlayer.ScoreFlashTextureScript.FadeFlash (4.0, FadeDir.Out);
	UIscriptComponent.OutroDiamondFlash();
	//yield WaitForSeconds (.2);
	endDiamond.active = true;
	//yield WaitForSeconds (.25);
	for(var shard : GameObject in GameObject.FindGameObjectsWithTag("Shard"))	
		Destroy (shard);
}