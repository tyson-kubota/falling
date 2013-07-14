#pragma strict

var player : Transform = null;
var maxDistance : float = 0f;
var myTr : Transform = null;
var aSource : AudioSource = null;
var distance : float;
var checkDistance : boolean = false;

function Start () {
	myTr = transform;
	aSource = GetComponent(AudioSource);
	aSource.volume = 0f;
//	findPlayer();
	player = GameObject.Find("Player/Camera").transform;
}

function OnTriggerEnter (other : Collider) {
	if (other.gameObject.CompareTag ("Player")) {
		if (checkDistance == false) {checkDistance = true;}
	}
}

function OnTriggerExit (other : Collider) {
	if (other.gameObject.CompareTag ("Player")) {
		checkDistance = false;
		aSource.volume = 0;
	}
}

function Update () {
	if (checkDistance == true) {
		distance = Vector3.Distance(myTr.position, player.position);
		if (distance <= maxDistance) {
			aSource.volume = Mathf.Abs((distance / maxDistance) - 1f);
		}
	}
}

function findPlayer() {
//	var playerResults = GameObject.FindGameObjectsWithTag ("Player");
//	for (var player : GameObject in playerResults) {
//		player = GameObject.Find("Player");
//	}
}