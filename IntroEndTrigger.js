#pragma strict

var Player : GameObject;
var IntroScriptComponent : IntroSequence1stPerson;
//IntroScriptComponent = Player.GetComponent("IntroSequence1stPerson");
var activeIntro : boolean = false;

function Start () {
	IntroScriptComponent = Player.GetComponent("IntroSequence1stPerson");

}

function OnTriggerEnter (other : Collider) {
  if (other.gameObject.CompareTag ("Player") && activeIntro == false){
	activeIntro = true;
	FallingPlayer.ScoreFlashTextureScript.FadeFlash (0.8, FadeDir.Out);
	IntroScriptComponent.EndIntro();
	if (audio) {audio.Play();}
	}
}