#pragma strict

var Player : GameObject;
var IntroScriptComponent : IntroSequence1stPerson;
//IntroScriptComponent = Player.GetComponent("IntroSequence1stPerson");
var activeIntro : boolean = false;

var audioSource : AudioSource;

function Start () {
	IntroScriptComponent = Player.GetComponent("IntroSequence1stPerson");
	audioSource = GetComponent.<AudioSource>();
}

function OnTriggerEnter (other : Collider) {
  if (other.gameObject.CompareTag ("Player") && activeIntro == false){
	activeIntro = true;
	FallingPlayer.ScoreFlashTextureScript.FadeFlash (3, FadeDir.Out);
	IntroScriptComponent.EndIntro(true);
	if (audioSource) {audioSource.Play();}
	}
}