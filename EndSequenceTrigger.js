#pragma strict

var Player : GameObject;
var EndScriptComponent : EndSequence1stPerson;

var shards : Array;
var shardColor : Material;
var endDiamond : GameObject;
var diamondCore : GameObject;

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

function SwapDiamonds(timer : float){
	FallingPlayer.ScoreFlashTextureScript.FadeFlash (4.0, FadeDir.Out);
	UIscriptComponent.OutroDiamondFlash();
	//yield WaitForSeconds (.2);
	endDiamond.active = true;
	
	var start = shardColor.color;
    var end = Color.black;
    var i = 0.0;
    var step = 1.0/timer;
 
    while (i <= 1.0) { 
        i += step * Time.deltaTime;
        
        for(var shard : GameObject in GameObject.FindGameObjectsWithTag("Shard"))
        shard.transform.Find("sky-rock-angled-segment").renderer.material.color = Color.Lerp(start, end, i);
        
        yield;
    	}
    	
    yield WaitForSeconds (2);
    	
	for(var shard : GameObject in GameObject.FindGameObjectsWithTag("Shard"))	
    	Destroy (shard);
}

function AddDiamondCore(timer : float){
	diamondCore.active = true;

    var start = 0;
    var end = .95;
    var i = 0.0;
    var step = 1.0/timer;
 
    while (i <= 1.0) { 
        i += step * Time.deltaTime;
        diamondCore.renderer.material.color.a = Mathf.Lerp(start, end, i);
        yield;
    	}
    	
    yield WaitForSeconds (timer);



}
