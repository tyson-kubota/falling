#pragma strict

var player : Transform = null;
var maxDistance : float = 0f;
var myTr : Transform = null;
var aSource : AudioSource = null;
private var distance : Vector3;
var checkDistance : boolean = false;
private var sqrDist : float;
private var sqrRtDist : float;

function Start () {
	myTr = transform;
	aSource = GetComponent(AudioSource);
	aSource.volume = 0f;
//	findPlayer();
	player = Camera.main.transform;
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

		//distance = Vector3.Distance(myTr.position, player.position);
		distance = myTr.position - player.position;
		sqrDist = distance.sqrMagnitude;
		sqrRtDist = Mathf.Sqrt(sqrDist);
		if (sqrDist <= maxDistance*maxDistance) {
			aSource.volume = Mathf.Abs((sqrRtDist / maxDistance) - 1f);
		}
	}
}

function findPlayer() {
//	var playerResults = GameObject.FindGameObjectsWithTag ("Player");
//	for (var player : GameObject in playerResults) {
//		player = GameObject.Find("Player");
//	}
}

function falsifyCheckDistance() {
	checkDistance = false;
}