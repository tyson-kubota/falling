#pragma strict

var pathName : String = "WormLoop";
var crawlTime : int = 15;

function Start () {
	iTween.MoveTo(gameObject, iTween.Hash("path",iTweenPath.GetPath(pathName), "looptype", "pingPong", "orienttopath", true, "looktime", 1.0, "lookahead", 0.05, "time", crawlTime, "easetype", "linear"));
}

function Update () {

}

//"easetype", iTween.EaseType.easeInOutSine causes strange flip at end of loop.