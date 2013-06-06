#pragma strict

var mainAnimation : String;
var triggerAnimation : String;

function OnTriggerEnter (other : Collider) {
  if (other.gameObject.CompareTag ("Player")) {
	animation.CrossFade(triggerAnimation, 0.5);
	if (audio) {audio.Play();}
  }	
}

function OnTriggerExit (other : Collider) {
  if (other.gameObject.CompareTag ("Player")) {
	//animation.PlayQueued("twist2", QueueMode.PlayNow);
  	animation.CrossFade(mainAnimation, 1.0);
  }	
}