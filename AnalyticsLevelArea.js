#pragma strict

var thisLevelAreaName : String;

function Start () {

}

function OnTriggerEnter (other : Collider) {
 	if (other.gameObject.CompareTag ("Player")){
		FallingLaunch.thisLevelArea = thisLevelAreaName;
	}
}