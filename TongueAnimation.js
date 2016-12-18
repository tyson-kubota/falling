#pragma strict

var triggerAnimation : String;

private var thisAnimation: Animation;

function Start() {
	thisAnimation = GetComponent.<Animation>();
}

function OnTriggerEnter (other : Collider) {
  if (other.gameObject.CompareTag ("Player")) {
	thisAnimation.Play(triggerAnimation);
  }	
}

function OnTriggerExit (other : Collider) {
  if (other.gameObject.CompareTag ("Player")) {
	thisAnimation.Stop(triggerAnimation);
  }	
}