#pragma strict

var mainAnimation : String;
var triggerAnimation : String;

var triggerInTime : float = 0.5;
var triggerOutTime : float = 1.0;

function OnTriggerEnter (other : Collider) {
  if (other.gameObject.CompareTag ("Player")) {
	animation.CrossFade(triggerAnimation, triggerInTime);
	if (audio) {audio.Play();}
  }	
}

function OnTriggerExit (other : Collider) {
  if (other.gameObject.CompareTag ("Player")) {
	//animation.PlayQueued("twist2", QueueMode.PlayNow);
  	animation.CrossFade(mainAnimation, triggerOutTime);
  }	
}