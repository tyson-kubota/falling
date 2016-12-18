#pragma strict

var mainAnimation : String;
var triggerAnimation : String;

var triggerInTime : float = 0.5;
var triggerOutTime : float = 1.0;

private var audioSource: AudioSource;
private var thisAnimation: Animation;

function Start () {
	audioSource = GetComponent.<AudioSource>();
	thisAnimation = GetComponent.<Animation>();
}

function OnTriggerEnter (other : Collider) {
  if (other.gameObject.CompareTag ("Player")) {
	thisAnimation.CrossFade(triggerAnimation, triggerInTime);
	if (audioSource) {audioSource.Play();}
  }	
}

function OnTriggerExit (other : Collider) {
  if (other.gameObject.CompareTag ("Player")) {
	//thisAnimation.PlayQueued("twist2", QueueMode.PlayNow);
  	thisAnimation.CrossFade(mainAnimation, triggerOutTime);
  }	
}