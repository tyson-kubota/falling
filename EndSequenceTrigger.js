#pragma strict

var Player : GameObject;
var EndScriptComponent : EndSequence1stPerson;

var shards : Array;
var shardColor : Material;
var endDiamond : GameObject;
var diamondCore : GameObject;
var diamond3DCore1 : GameObject;
var diamond3DCore2 : GameObject;

var audioSource : AudioSource;

function Awake () {
	EndScriptComponent = Player.GetComponent("EndSequence1stPerson");
}

function Start () {
	audioSource = GetComponent.<AudioSource>();
}

function OnTriggerEnter (other : Collider) {
	if (other.gameObject.CompareTag ("Player") && lifeCountdown.inOutro == false) {
		lifeCountdown.inOutro = true;
		
		MoveController.SpeedLinesMeshScript.LinesLerpOut(3);
		
		if (EndScriptComponent) {
		EndScriptComponent.PlayOutro();
		}
		
		for(var shard : GameObject in GameObject.FindGameObjectsWithTag("Shard"))	
			shard.GetComponent.<Animation>().Play();
	
		if (audioSource) {audioSource.Play();}

		FallingPlayer.ScoreFlashTextureScript.FadeFlash (12.0, FadeDir.In);
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
	FallingPlayer.ScoreFlashTextureScript.FadeFlash (3.0, FadeDir.Out);
	FallingPlayer.UIscriptComponent.OutroDiamondFlash(2);
	//yield WaitForSeconds (.2);
	endDiamond.active = true;
	
	var start = shardColor.color;
    var end = Color.black;
    var i = 0.0;
    var step = 1.0/timer;
 
    while (i <= 1.0) { 
        i += step * Time.deltaTime;
        
        for(var shard : GameObject in GameObject.FindGameObjectsWithTag("Shard"))
        shard.transform.Find("sky-rock-angled-segment").GetComponent.<Renderer>().material.color = Color.Lerp(start, end, i);
        
        yield;
    	}
    	
    yield WaitForSeconds (1);
    	
	for(var shard : GameObject in GameObject.FindGameObjectsWithTag("Shard"))	
    	Destroy (shard);
}

function AddDiamondCore(timer : float){
	diamondCore.active = true;

    var start = 0;
    var end = .9;
    var i = 0.0;
    var step = 1.0/timer;
 
    while (i <= 1.0) { 
        i += step * Time.deltaTime;
        diamondCore.GetComponent.<Renderer>().material.color.a = Mathf.Lerp(start, end, i);
        yield;
    	}
    	
    yield WaitForSeconds (timer);

}

function FadeDiamond(timer : float){

    var start = endDiamond.GetComponent.<Renderer>().material.color;
    var end = Color.black;
    var i = 0.0;
    var step = 1.0/timer;
 
    while (i <= 1.0) { 
        i += step * Time.deltaTime;
        endDiamond.GetComponent.<Renderer>().material.color = Color.Lerp(start, end, i);
        yield;
    	}
    	
    yield WaitForSeconds (timer);

}


function AddDiamond3DCore(timer : float){
	diamond3DCore1.active = true;
	diamond3DCore2.active = true;

    var start = Color.black;
    var end = diamond3DCore1.GetComponent.<Renderer>().material.color;
    var i = 0.0;
    var step = 1.0/timer;
 
    while (i <= 1.0) { 
        i += step * Time.deltaTime;
        diamond3DCore1.GetComponent.<Renderer>().material.color = Color.Lerp(start, end, i);
        diamond3DCore2.GetComponent.<Renderer>().material.color = Color.Lerp(start, end, i);
        yield;
    	}
    	
    yield WaitForSeconds (timer);

}