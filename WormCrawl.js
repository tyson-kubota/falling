#pragma strict

var pathName : String = "WormLoop";
var crawlTime : int = 15;

function Start () {
	iTween.MoveTo(gameObject, iTween.Hash("path",iTweenPath.GetPath(pathName), "looptype", "loop", "orienttopath", true, "time", crawlTime, "easetype", iTween.EaseType.easeInOutSine));
}

function Update () {

}