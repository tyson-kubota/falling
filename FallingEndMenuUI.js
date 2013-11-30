#pragma strict

var endGameSprite : UISprite;
var EndMenuLogoCamera : GameObject;

var aboutButton : UIButton;
var homeButton : UIButton;
var continueButton : UIButton;

var textHeight : int;

var homeLevel : String = "Falling-scene-menu";
var level1 : String = "Falling-scene-tutorial";

var boldText : UIText;
var thinText : UIText;
var text1 : UITextInstance;
var text2 : UITextInstance;
var text3 : UITextInstance;
var openSiteButtonText : UIButton;
var BackToEndMenuButton : UIButton;

function Start () {

	textHeight = (UI.isHD == true) ? 18 : 18;
	
	endGameSprite = UI.firstToolkit.addSprite( "tutorialBackground.png", 0, 0, 2 );
	endGameSprite.hidden = true;
	endGameSprite.scaleTo( 0.1f, new Vector3( (Screen.width), 3, 1 ), Easing.Sinusoidal.easeOut);
	
	aboutButton = UIButton.create("about.png","about.png", 40, 40);
	aboutButton.pixelsFromBottomLeft(textHeight, textHeight);
	aboutButton.normalTouchOffsets = new UIEdgeOffsets( 30 );
	aboutButton.highlightedTouchOffsets = new UIEdgeOffsets( 30 );
	aboutButton.onTouchUpInside += OpenAbout;
	aboutButton.onTouchUp += fadeOutAbout;	
	aboutButton.onTouchDown += fadeInAbout;
	aboutButton.hidden = true;
//	aboutButton.alphaTo( 0.01f, 0.5f, Easing.Sinusoidal.easeOut);
	
	continueButton = UIButton.create("newgame.png","newgame.png", 40, 40);
	continueButton.pixelsFromBottomRight(textHeight, textHeight);	
	continueButton.normalTouchOffsets = new UIEdgeOffsets( 30 );
	continueButton.highlightedTouchOffsets = new UIEdgeOffsets( 30 );
	continueButton.onTouchUpInside += continueLevel;
	continueButton.onTouchUp += fadeOutContinue;
	continueButton.onTouchDown += fadeInContinue;
	continueButton.hidden = true;
//	continueButton.alphaTo( 0.01f, 0.5f, Easing.Sinusoidal.easeOut);

	homeButton = UIButton.create("home.png","home.png", 40, 40);
	homeButton.centerize();
//	homeButton.pixelsFromBottom (- fallingUITest.spriteEdgeSize * 3);
	homeButton.normalTouchOffsets = new UIEdgeOffsets( 30 );
	homeButton.highlightedTouchOffsets = new UIEdgeOffsets( 30 );
	homeButton.pixelsFromBottom(textHeight);
	homeButton.onTouchUpInside += LoadHome;
	homeButton.onTouchUp += fadeOutHome;	
	homeButton.onTouchDown += fadeInHome;	
	homeButton.hidden = true;
//	homeButton.alphaTo( 0.01f, 0.5f, Easing.Sinusoidal.easeOut);

	BackToEndMenuButton = UIButton.create("back.png","back.png", 40, 40);
	BackToEndMenuButton.positionFromBottomLeft(.05f, .05f);
	BackToEndMenuButton.normalTouchOffsets = new UIEdgeOffsets( 30 );
	BackToEndMenuButton.highlightedTouchOffsets = new UIEdgeOffsets( 30 );
	BackToEndMenuButton.onTouchUpInside += BackToEndMenu;	
	BackToEndMenuButton.hidden = true;

	boldText = new UIText( "font-bold", "font-bold.png" );
	thinText = new UIText( "font-thin", "font-thin.png" );
		
	boldText.alignMode = UITextAlignMode.Center;
	boldText.verticalAlignMode = UITextVerticalAlignMode.Middle;
    boldText.wrapMode = UITextLineWrapMode.MinimumLength;

	thinText.alignMode = UITextAlignMode.Center;
	thinText.verticalAlignMode = UITextVerticalAlignMode.Middle;
    thinText.wrapMode = UITextLineWrapMode.None;

	text1 = thinText.addTextInstance( "CREATED BY TYSON KUBOTA", 0, 0 );
    //text1.positionFromTop(.3f);
    //text1.positionFromCenter(-.1f,0f);
    text1.pixelsFromCenter( -25, 0 );

	text2 = boldText.addTextInstance( "tysonkubota.net/skydrift", 0, 0);
    text2.positionCenter();

	//text3 = thinText.addTextInstance( "Music by Evan Kubota\nTextures: nobiax\nSound effects: freesound.org", 0, 0 );
    text3 = thinText.addTextInstance( "MUSIC BY EVAN KUBOTA\n\nSOUND EFFECTS: freesound.org", 
	0, 0, 0.8f, 1, Color.white, UITextAlignMode.Center, UITextVerticalAlignMode.Bottom );
    text3.positionFromBottom(.3f);

	text1.hidden = true;
	text2.hidden = true;
	text3.hidden = true;

	openSiteButtonText = UIButton.create("tutorialBackground.png","tutorialBackground.png", 40, 40);
	openSiteButtonText.positionFromCenter(0,0);
	openSiteButtonText.onTouchUpInside += OpenFallingSite;	
	openSiteButtonText.scaleTo( 0.1f, new Vector3( (Screen.width), 3, 1 ), Easing.Sinusoidal.easeOut);
	openSiteButtonText.alphaFromTo(0.1f, 0.0f, 0.0f, Easing.Sinusoidal.easeOut);
	openSiteButtonText.hidden = true;

}

function ShowEndGameUI() {
	endGameSprite.centerize();
	endGameSprite.pixelsFromBottom (- fallingUITest.spriteEdgeSize * 3);
	
	yield WaitForSeconds(3);
	aboutButton.hidden = false;
	continueButton.hidden = false;
	homeButton.hidden = false;
	endGameSprite.hidden = false;

	aboutButton.alphaFromTo( 2.5f, 0.0f, 0.5f, Easing.Sinusoidal.easeIn);
	continueButton.alphaFromTo( 2.5f, 0.0f, 0.5f, Easing.Sinusoidal.easeIn);
	homeButton.alphaFromTo( 2.5f, 0.0f, 0.5f, Easing.Sinusoidal.easeIn);
	endGameSprite.alphaFromTo( 2.0f, 0f, 0.25f, Easing.Sinusoidal.easeInOut);
	
	// add anything else that requires main uitoolkit instance
}


function ReturnEndGameUI() {
	aboutButton.hidden = false;
	continueButton.hidden = false;
	homeButton.hidden = false;
	endGameSprite.hidden = false;

	aboutButton.alphaFromTo( 1.5f, 0.0f, 0.5f, Easing.Sinusoidal.easeIn);
	continueButton.alphaFromTo( 1.5f, 0.0f, 0.5f, Easing.Sinusoidal.easeIn);
	homeButton.alphaFromTo( 1.5f, 0.0f, 0.5f, Easing.Sinusoidal.easeIn);
	endGameSprite.alphaFromTo( 1.0f, 0f, 0.25f, Easing.Sinusoidal.easeInOut);
	
	EndMenuLogoCamera.GetComponent(Camera).enabled = true;
}

function LoadHome() {

//	var delay : float = 2;

//	aboutButton.alphaTo( 2, 0, Easing.Sinusoidal.easeOut);
//	continueButton.alphaTo( 2, 0, Easing.Sinusoidal.easeOut);
//	homeButton.alphaTo( 2, 0, Easing.Sinusoidal.easeOut);
//	endGameSprite.alphaTo( 2, 0, Easing.Sinusoidal.easeOut);

//	yield WaitForSeconds(2);

	aboutButton.hidden = true;
	continueButton.hidden = true;
	homeButton.hidden = true;
	endGameSprite.hidden = true;

	EndMenuLogoCamera.GetComponent(Camera).enabled = false;

	fallingUITest.loadingLabel.hidden = false;
	FallingPlayer.isTiltable = true;
	Application.LoadLevel(homeLevel);
//	Time.timeScale = savedTimeScale;
}


function continueLevel() {
	aboutButton.hidden = true;
	continueButton.hidden = true;
	homeButton.hidden = true;
	endGameSprite.hidden = true;
	
	EndMenuLogoCamera.GetComponent(Camera).enabled = false;
	
	//fallingUITest.loadingLabel.hidden = false;
	ShowLevel1Logo();
}

function OpenAbout() {

	aboutButton.hidden = true;
	continueButton.hidden = true;
	homeButton.hidden = true;
	endGameSprite.hidden = true;

	BackToEndMenuButton.hidden = false;
	BackToEndMenuButton.alphaFromTo(1.0f, 0.0f, 1.0f, Easing.Sinusoidal.easeIn);
	
	EndMenuLogoCamera.GetComponent(Camera).enabled = false;

	openSiteButtonText.hidden = false;
	text1.hidden = false;
	text2.hidden = false;
	text3.hidden = false;
	text1.alphaFromTo(1.0f, 0.0f, 0.8f, Easing.Sinusoidal.easeOut);
	text2.alphaFromTo(1.0f, 0.0f, 1.0f, Easing.Sinusoidal.easeOut);
	text3.alphaFromTo(1.5f, 0.0f, 0.6f, Easing.Sinusoidal.easeInOut);

}

function BackToEndMenu() {

	BackToEndMenuButton.hidden = true;

	text1.hidden = true;
	text2.hidden = true;
	text3.hidden = true;

	ReturnEndGameUI();
}

function fadeInAbout() {
	aboutButton.alphaTo( .05f, 1.0f, Easing.Sinusoidal.easeOut);
}

function fadeOutAbout() {
	aboutButton.alphaTo( .25f, 0.5f, Easing.Sinusoidal.easeOut);
}

function fadeInHome() {
	homeButton.alphaTo( .05f, 1.0f, Easing.Sinusoidal.easeOut);
}

function fadeOutHome() {
	homeButton.alphaTo( .25f, 0.5f, Easing.Sinusoidal.easeOut);
	
}function fadeInContinue() {
	continueButton.alphaTo( .05f, 1.0f, Easing.Sinusoidal.easeOut);
}

function fadeOutContinue() {
	continueButton.alphaTo( .25f, 0.5f, Easing.Sinusoidal.easeOut);
}

function OpenFallingSite() {
	Application.OpenURL ("http://tysonkubota.net/skydrift?utm_source=skydrift-game&utm_medium=ios&utm_campaign=skydrift-gui");
}


function ShowLevel1Logo() {
	fallingUITest.nextLevelLabel.hidden = false;
	fallingUITest.nextLevelLabel.alphaFromTo( 2.0f, 0.0f, 0.75f, Easing.Sinusoidal.easeIn);
	yield WaitForSeconds(2.0);
	FallingPlayer.isTiltable = true;
	Application.LoadLevel(level1);
}