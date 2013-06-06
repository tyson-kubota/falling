#pragma strict

var triggerAnimation : String;

function OnTriggerEnter (other : Collider) {
  if (other.gameObject.CompareTag ("Player")) {
	animation.Play(triggerAnimation);
  }	
}

function OnTriggerExit (other : Collider) {
  if (other.gameObject.CompareTag ("Player")) {
	animation.Stop(triggerAnimation);
  }	
}