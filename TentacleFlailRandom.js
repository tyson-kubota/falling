#pragma strict

var mainAnimation : String;
var triggerAnimation1 : String;
var triggerAnimation2 : String;

function OnTriggerEnter (other : Collider) {
  if (other.gameObject.CompareTag ("Player")) {
	var seconds : int = Time.time;
    var oddeven = (seconds % 2) == 0;	// Find out whether current second is odd or even
    var animationToRun : String;
//    Debug.Log("oddeven was " + oddeven);
	animationToRun = (oddeven == true) ? triggerAnimation1 : triggerAnimation2 ;
	animation.CrossFade(animationToRun, 0.5);
  }
}

function OnTriggerExit (other : Collider) {
  if (other.gameObject.CompareTag ("Player")) {
	//animation.PlayQueued("twist2", QueueMode.PlayNow);
  	animation.CrossFade(mainAnimation, 1.0);
  }	
}