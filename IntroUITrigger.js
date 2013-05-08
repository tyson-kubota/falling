#pragma strict

var fallingIntroUI : GameObject;
static var fallingIntroUIComponent : fallingIntroUI;
var helpIcon: UIButton;
var thisIcon : String = "level1";

var activeIntro : boolean = false;

function Start () {
	fallingIntroUIComponent = fallingIntroUI.GetComponent("fallingIntroUI");

	helpIcon = UIButton.create(thisIcon + ".png", thisIcon + ".png", 0, 0);
	helpIcon.positionCenter();
	helpIcon.hidden = true;
}

function OnTriggerEnter (other : Collider) {
  if (other.gameObject.CompareTag ("Player") && activeIntro == false) {
	activeIntro = true;
	fallingIntroUIComponent.ShowIcon(helpIcon);
	if (audio) {audio.Play();}
	}
}