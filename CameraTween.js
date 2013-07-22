#pragma strict

var pathName : String = "WormLoop";
var crawlTime : int = 15;
var Loop : boolean = false;
var cameraMove : boolean = false;
var cameraLookTarget : GameObject;

function Start () {
	if (cameraMove == true) {
		iTween.MoveTo(gameObject, 
		iTween.Hash("path",iTweenPath.GetPath(pathName), 
			"orienttopath", false, 
			"looktarget", cameraLookTarget.transform,
			"axis","x",
			"looktime", 3.0, 
			"lookahead", 0.05f,
			"time", crawlTime, 
			"easetype", "easeInOutSine"));
	}
}

function Update () {

}

//"easetype", iTween.EaseType.easeInOutSine causes strange flip at end of loop.