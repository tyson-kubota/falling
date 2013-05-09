#pragma strict

var Player : GameObject;
var EndScriptComponent : EndSequence1stPerson;

var activeOutro : boolean = false;

function Start () {
	EndScriptComponent = Player.GetComponent("EndSequence1stPerson");

}

function OnTriggerEnter (other : Collider) {
  if (other.gameObject.CompareTag ("Player") && activeOutro == false) {
	activeOutro = true;
	if (EndScriptComponent) {
	EndScriptComponent.BeginOutro();
	}
	if (audio) {audio.Play();}
	}
}