#pragma strict

function OnTriggerEnter (other : Collider) {
	if (other.gameObject.CompareTag ("Player")) {
		if (audio) {audio.Play();}
	}
}

function OnTriggerExit (other : Collider) {
	if (other.gameObject.CompareTag ("Player")) {
		if (audio) {audio.Stop();}
	}
}