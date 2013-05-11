#pragma strict

var fallingIntroUI : GameObject;
static var fallingIntroUIComponent : fallingIntroUI;
var helpIcon: UISprite;
var thisIcon : String = "level1";
var helpBackgroundSprite : UISprite;
var activeIntro : boolean = false;
var buttonScaleFactor : float;

function Start () {
	fallingIntroUIComponent = fallingIntroUI.GetComponent("fallingIntroUI");
    helpIcon = UI.firstToolkit.addSprite( thisIcon + ".png", 0, 0, 3 );

//	helpIcon = UIButton.create(thisIcon + ".png", thisIcon + ".png", 0, 0, 0);
	//helpIcon.positionCenter();
	helpIcon.positionFromBottom(0.1f);
	helpIcon.hidden = true;

	if (UI.isHD == true) {
	buttonScaleFactor = (((Screen.height / 2.0) - 100.0) / Screen.height);
	}
	else {
	buttonScaleFactor = (((Screen.height / 2.0) - 50.0) / Screen.height);
	}
		
	helpBackgroundSprite = UI.firstToolkit.addSprite( "menuBackgroundBlack.png", 0, 0, 4 );
	//helpBackgroundSprite.positionFromBottomLeft(buttonScaleFactor, .05f);
	helpBackgroundSprite.alphaTo( 1.01f, 0.6f, Easing.Sinusoidal.easeOut);
	//helpBackgroundSprite.positionFromTop ( -2.5f * buttonScaleFactor );
	helpBackgroundSprite.positionFromCenter(0f, 0f);
	//helpBackgroundSprite.hidden = true;
	helpBackgroundSprite.scaleTo( 0.01f, new Vector3( (Screen.width), (Screen.height), 1 ), Easing.Linear.easeIn);

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