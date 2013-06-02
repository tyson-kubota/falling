#pragma strict

var player : Transform = null;
var maxDistance : float = 0f;
var myTr : Transform = null;
var aSource : AudioSource = null;

function Start () {
	myTr = transform;
	aSource = GetComponent(AudioSource);
	aSource.volume = 0f;
//	findPlayer();
	player = GameObject.Find("Player/Camera").transform;
}

function Update () {
	var distance = Vector3.Distance(myTr.position, player.position);
	if (distance <= maxDistance) {
		aSource.volume = Mathf.Abs((distance / maxDistance) - 1f);
	}
}

function findPlayer() {
//	var playerResults = GameObject.FindGameObjectsWithTag ("Player");
//	for (var player : GameObject in playerResults) {
//		player = GameObject.Find("Player");
//	}
}