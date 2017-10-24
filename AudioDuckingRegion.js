#pragma strict

var duckingObject : GameObject;
var moveControllerComponent : MoveController;
var duckingVal : float = .5f;
var StopAudioOnComplete : boolean = false;
var audioSource : AudioSource;

function Start () {
	audioSource = duckingObject.GetComponent.<AudioSource>();
    // go one or two levels up:
    moveControllerComponent = 
        duckingObject.transform.parent.GetComponent.<MoveController>() ||
        duckingObject.transform.parent.parent.GetComponent.<MoveController>();
}

function OnTriggerEnter (other : Collider) {
	if (other.gameObject.layer == 16) {
		if (duckingObject.GetComponent.<AudioSource>()) {lerpDuck(2, duckingVal);}
	}
}

function OnTriggerExit (other : Collider) {
	if (other.gameObject.layer == 16) {
		if (duckingObject.GetComponent.<AudioSource>()) {lerpDuck(2, 1);}
	}
}

function lerpDuck (timer : float, endVal : float) {
    var start = audioSource.volume;
    var end = endVal;
    var i = 0.0;
    var step = 1.0/timer;

    while (i <= 1.0) { 
        i += step * Time.deltaTime;
        moveControllerComponent.setMaxDuckedVolume( Mathf.Lerp(start, end, i) );
        yield;
	}
    yield WaitForSeconds (timer);

    if (StopAudioOnComplete) {audioSource.Stop();}
}
