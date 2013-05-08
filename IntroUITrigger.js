#pragma strict

var fallingIntroUI : GameObject;
static var fallingIntroUIComponent : fallingIntroUI;
var helpIcon: UISprite;
var thisIcon : String = "level1";

var activeIntro : boolean = false;

function Start () {
	fallingIntroUIComponent = fallingIntroUI.GetComponent("fallingIntroUI");
    helpIcon = UI.firstToolkit.addSprite( thisIcon + ".png", 0, 0, 3 );

//	helpIcon = UIButton.create(thisIcon + ".png", thisIcon + ".png", 0, 0, 0);
	//helpIcon.positionCenter();
	helpIcon.positionFromBottom(0.1f);
	helpIcon.hidden = true;
}

function OnTriggerEnter (other : Collider) {
  if (other.gameObject.CompareTag ("Player") && activeIntro == false) {
	activeIntro = true;
	fallingIntroUIComponent.ShowIcon(helpIcon);
	if (audio) {audio.Play();}
	}
}

function OnTriggerExit (other : Collider) {
  if (other.gameObject.CompareTag ("Player") && activeIntro == true) {
	activeIntro = false;
	}
}