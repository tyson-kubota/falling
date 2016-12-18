#pragma strict

var duckingObject : GameObject;
var duckingVal : float = .5f;
var StopAudioOnComplete : boolean = false;
var audioSource : AudioSource;

function Start () {
	audioSource = duckingObject.GetComponent.<AudioSource>();
}

function OnTriggerEnter (other : Collider) {
	if (other.gameObject.layer == 16) {
		if (duckingObject.audio) {lerpDuck(2, duckingVal);}
	}
}

function OnTriggerExit (other : Collider) {
	if (other.gameObject.layer == 16) {
		if (duckingObject.audio) {lerpDuck(2, 1);}
	}
}

function lerpDuck (timer : float, endVal : float) {

    var start = audioSource.volume;
    var end = endVal;
    var i = 0.0;
    var step = 1.0/timer;

    while (i <= 1.0) { 
        i += step * Time.deltaTime;
        audioSource.volume = Mathf.Lerp(start, end, i);
        yield;        
    	}
    yield WaitForSeconds (timer);

    if (StopAudioOnComplete) {audioSource.Stop();}
}
