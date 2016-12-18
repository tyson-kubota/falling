#pragma strict

var audioSource : AudioSource;

function Start () {
	audioSource = GetComponent.<AudioSource>();
}

function OnBecameVisible () {
	if (audioSource) {audioSource.Play();}
}