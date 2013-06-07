#pragma strict

var fallingIntroUI : GameObject;
static var fallingIntroUIComponent : fallingIntroUI;

var fallingUI : GameObject;
static var fallingUIComponent : fallingUITest;

enum Triggers {
trigger1,
trigger2,
trigger3
};

var helpIcon: UISprite;
var thisIcon : String = "level1";
var thisTimer : float = 8;
var thisTrigger : Triggers;
var tutorialSprite : UISprite;
var iconDepth : int = 0;

static var activeIntro : boolean = false;
var textHeight : int;

function Start () {

	if (thisTrigger == Triggers.trigger1) {
	var tutorialSprite1 : UISprite;
	tutorialSprite1 = UI.firstToolkit.addSprite( "tutorialBackground.png", 0, 0, 8 );
	tutorialSprite = tutorialSprite1;
	tutorialSprite.hidden = true;
	tutorialSprite.scaleTo( 0.1f, new Vector3( (Screen.width), 3, 1 ), Easing.Sinusoidal.easeOut);
	iconDepth = 7;
	}

	if (thisTrigger == Triggers.trigger2) {
	var tutorialSprite2 : UISprite;
	tutorialSprite1 = UI.firstToolkit.addSprite( "tutorialBackground.png", 0, 0, 6 );
	tutorialSprite = tutorialSprite1;
	tutorialSprite.hidden = true;
	tutorialSprite.scaleTo( 0.1f, new Vector3( (Screen.width), 3, 1 ), Easing.Sinusoidal.easeOut);
	iconDepth = 5;
	}
	
	if (thisTrigger == Triggers.trigger3) {
	var tutorialSprite3 : UISprite;
	tutorialSprite1 = UI.firstToolkit.addSprite( "tutorialBackground.png", 0, 0, 4 );
	tutorialSprite = tutorialSprite1;
	tutorialSprite.hidden = true;
	tutorialSprite.scaleTo( 0.1f, new Vector3( (Screen.width), 3, 1 ), Easing.Sinusoidal.easeOut);
	iconDepth = 3;
	}	
	
	fallingIntroUIComponent = fallingIntroUI.GetComponent("fallingIntroUI");
	fallingUIComponent = fallingUI.GetComponent("fallingUITest");
    helpIcon = UI.firstToolkit.addSprite( thisIcon + ".png", 0, 0, iconDepth );

	textHeight = (UI.isHD == true) ? 18 : 18;

	helpIcon.pixelsFromBottom(textHeight);
	helpIcon.hidden = true;
		
}

function OnTriggerEnter (other : Collider) {
  if (other.gameObject.CompareTag ("Player") && activeIntro == false) {
	activeIntro = true;
	fallingIntroUIComponent.ShowIcon(helpIcon, thisTimer, tutorialSprite);
	tutorialSpritePosition(thisTimer);
	if (audio) {audio.Play();}
	}
}

function OnTriggerExit (other : Collider) {
  if (other.gameObject.CompareTag ("Player") && activeIntro == true) {
	activeIntro = false;
	}
}

function tutorialSpritePosition(timer : float) {
	tutorialSprite.centerize();
	tutorialSprite.pixelsFromBottom (- fallingUITest.spriteEdgeSize * 3);
	tutorialSprite.hidden = false;
	tutorialSprite.alphaFromTo( 1.0f, 0f, 0.85f, Easing.Sinusoidal.easeOut);
	yield WaitForSeconds (timer);
	tutorialSprite.alphaTo( 2.0f, 0.0f, Easing.Sinusoidal.easeOut);
	yield WaitForSeconds (2);
	tutorialSprite.hidden = true;
}
