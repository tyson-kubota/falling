#pragma strict

var fallingIntroUI : GameObject;
static var fallingIntroUIComponent : fallingIntroUI;

var fallingUI : GameObject;
static var fallingUIComponent : fallingUITest;

var helpIcon: UISprite;
var thisIcon : String = "level1";
var thisTimer : float = 8;
var helpBackgroundSprite : UISprite;
var activeIntro : boolean = false;
var textHeight : int;

function Start () {
	fallingIntroUIComponent = fallingIntroUI.GetComponent("fallingIntroUI");
	fallingUIComponent = fallingUI.GetComponent("fallingUITest");
    helpIcon = UI.firstToolkit.addSprite( thisIcon + ".png", 0, 0, 3 );

	textHeight = (UI.isHD == true) ? 18 : 18;

	helpIcon.pixelsFromBottom(textHeight);
	helpIcon.hidden = true;
		
}

function OnTriggerEnter (other : Collider) {
  if (other.gameObject.CompareTag ("Player") && activeIntro == false) {
	activeIntro = true;
	if (fallingUITest.tutorialSprite.hidden == true) {fallingUIComponent.tutorialSpritePosition(thisTimer);}
	else {fallingUITest.tutorialSpriteExtraTimer = (thisTimer - 2);}
	fallingIntroUIComponent.ShowIcon(helpIcon, thisTimer);
	if (audio) {audio.Play();}
	}
}

function OnTriggerExit (other : Collider) {
  if (other.gameObject.CompareTag ("Player") && activeIntro == true) {
	activeIntro = false;
	}
}
