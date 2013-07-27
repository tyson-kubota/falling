#pragma strict

var mainAnimation : String;
var triggerAnimation1 : String;
var triggerAnimation2 : String;

var triggerInTime : float = 0.5;
var triggerOutTime : float = 1.0;

function OnTriggerEnter (other : Collider) {
  if (other.gameObject.CompareTag ("Player")) {
	var seconds : int = Time.time;
    //var oddeven = (seconds % 2) == 0;	// Find out whether current second is odd or even
    var oddeven : int = Random.Range(0, 2);
    var animationToRun : String;
//    Debug.Log("oddeven was " + oddeven);
	animationToRun = (oddeven == 0) ? triggerAnimation1 : triggerAnimation2 ;
	animation.CrossFade(animationToRun, triggerInTime);
	if (audio) {audio.Play();}
  }
}

function OnTriggerExit (other : Collider) {
  if (other.gameObject.CompareTag ("Player")) {
	//animation.PlayQueued("twist2", QueueMode.PlayNow);
  	animation.CrossFade(mainAnimation, triggerOutTime);
  }	
}