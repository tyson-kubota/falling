#pragma strict

var audioSource : AudioSource;

function Start () {
	audioSource = GetComponent.<AudioSource>();
}

function OnTriggerEnter (other : Collider) {
	if (other.gameObject.CompareTag ("Player")) {
		if (audioSource) {audioSource.Play();}
	}
}

function OnTriggerExit (other : Collider) {
	if (other.gameObject.CompareTag ("Player")) {
		if (audioSource) {audioSource.Stop();}
	}
}