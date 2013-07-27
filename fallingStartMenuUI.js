#pragma strict

var player : GameObject;
var value : float = 0.5f;
var bgSprite : UISprite;
var bgSpriteStart : UISprite;
var pauseButton : UIButton;
var rightArrow : UIButton;
var leftArrow : UIButton;
var loadNewLevelButton : UIButton;
var loadLevelOne : UIButton;
var loadLevelTwo : UIButton;
var loadLevelThree : UIButton;
var loadLevelFour : UIButton;
var openSiteButton : UIButton;
var loadingLabel : UIButton;
var BackToPauseMenuButton : UIButton;
var tiltWarning : UIButton;

var buttonScaleFactor : float;
var scriptName : GameObject;
var initialRespawn : Respawn;

var levelToLoad : String = "";

var level1 : String = "Falling-scene-tutorial";
var level2 : String = "Falling-scene2";
var level3 : String = "Falling-scene1-scale";
var level4 : String = "Falling-scene3";

var helpIcon1: UISprite;
var helpIcon2: UISprite;
var helpIcon3: UISprite;

var aboutButtonStart : UIButton;
var howToButton : UIButton;

var boldText : UIText;
var thinText : UIText;
var text1 : UITextInstance;
var text2 : UITextInstance;
var text3 : UITextInstance;
var openSiteButtonText : UIButton;

private var savedTimeScale:float;

var canShowStart : boolean;
var aboutToLoad : boolean = false;
var sceneAudio : AudioListener;
var fadeTime : float = 1.0;

var bgCamera : Camera;

var bgColor1 : Color;
var bgColor2 : Color = Color.red;

function Start () {
//  yield WaitForSeconds(0.5f);

//	  Testing to see if disabling this hard coded screen.orientation will allow auto detection of landscape 
//	  right or left mode on startup.
//    Screen.orientation = ScreenOrientation.LandscapeLeft;

//    if (iPhoneInput.orientation == iPhoneOrientation.LandscapeRight) {
//	Screen.orientation = ScreenOrientation.LandscapeRight;}
//	else {Screen.orientation = ScreenOrientation.LandscapeLeft;}
	Camera.main.SendMessage("fadeIn");

	bgColor1 = bgCamera.backgroundColor;

    bgSpriteStart = UI.firstToolkit.addSprite( "menuBackground.png", 0, 0, 2 );
	bgSpriteStart.positionCenter();
	bgSpriteStart.scaleTo( 0.0001f, new Vector3( (Screen.width * 6), (Screen.height * 6), 1 ), Easing.Sinusoidal.easeOut);
	bgSpriteStart.alphaTo( 0.0001f, 0.1f, Easing.Sinusoidal.easeOut);

	bgSprite = UI.firstToolkit.addSprite( "menuBackground.png", 0, 0, 2 );
	bgSprite.positionCenter();
	bgSprite.scaleTo( 0.01f, new Vector3( (Screen.width * 6), (Screen.height * 6), 1 ), Easing.Sinusoidal.easeOut);
	bgSprite.alphaTo( 0.01f, 0.94f, Easing.Sinusoidal.easeOut);
	bgSprite.hidden = true;
	
	pauseButton = UIButton.create("pauseWhite.png","pauseGray.png", 0, 0);
	pauseButton.pixelsFromTopRight( 5, 5 );
	pauseButton.highlightedTouchOffsets = new UIEdgeOffsets(30);
	pauseButton.onTouchUpInside += PauseGameCheck;

	pauseButton.hidden = true;

	if (UI.isHD == true) {
	buttonScaleFactor = (((Screen.height / 2.0) - 100.0) / Screen.height);
	}
	else {
	buttonScaleFactor = (((Screen.height / 2.0) - 50.0) / Screen.height);
	}

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

	text2 = boldText.addTextInstance( "tysonkubota.net/falling", 0, 0);
    text2.positionCenter();

	//text3 = thinText.addTextInstance( "Music by Evan Kubota\nTextures: nobiax\nSound effects: freesound.org", 0, 0 );
    text3 = thinText.addTextInstance( "MUSIC BY EVAN KUBOTA\n\nSOUND EFFECTS: freesound.org", 
	0, 0, 0.8f, 1, Color.white, UITextAlignMode.Center, UITextVerticalAlignMode.Bottom );
    text3.positionFromBottom(.3f);

	//var wrapText = new UIText( "font-thin", "font-thin.png" );
	//wrapText.wrapMode = UITextLineWrapMode.MinimumLength;
	//wrapText.lineWrapWidth = 100.0f;
	//var textWrap1 = wrapText.addTextInstance( "Testing line wrap width with small words in multiple resolutions.\n\nAnd manual L/B.", 
	//0, 0, 0.5f, 1, Color.white, UITextAlignMode.Left, UITextVerticalAlignMode.Bottom );
    //textWrap1.positionFromBottomLeft( 0.05f, 0.05f );
	
	openSiteButtonText = UIButton.create("tutorialBackground.png","tutorialBackground.png", 40, 40);
	openSiteButtonText.positionFromCenter(0,0);
	openSiteButtonText.hidden = true;
	openSiteButtonText.onTouchUpInside += OpenFallingSite;	
	openSiteButtonText.scaleTo( 0.1f, new Vector3( (Screen.width), 3, 1 ), Easing.Sinusoidal.easeOut);
	openSiteButtonText.alphaFromTo(0.1f, 0.0f, 0.0f, Easing.Sinusoidal.easeOut);
	
	text1.hidden = true;
	text2.hidden = true;
	text3.hidden = true;

	tiltWarning = UIButton.create("tiltwarning.png","tiltwarning.png", 0, 0);
	tiltWarning.positionFromTop(buttonScaleFactor);
	
	rightArrow = UIButton.create("startDown.png","startDown.png", 0, 0);
	rightArrow.positionFromTopRight(buttonScaleFactor,0.2f);
	rightArrow.onTouchUpInside += LoadLevel1ViaStart;
	rightArrow.onTouchDown += fadeInRightArrow;
	rightArrow.onTouchUp += fadeOutRightArrow;

	leftArrow = UIButton.create("chooselevelDown.png","chooselevelDown.png", 0, 0);
	leftArrow.positionFromTopLeft(buttonScaleFactor,0.2f);
	leftArrow.onTouchUpInside += LevelSelect;
	leftArrow.onTouchDown += fadeInLeftArrow;
	leftArrow.onTouchUp += fadeOutLeftArrow;
	
	tiltWarning.hidden = true;
	rightArrow.hidden = true;
	leftArrow.hidden = true;
	
	BackToPauseMenuButton = UIButton.create("back.png","back.png", 40, 40);
	BackToPauseMenuButton.positionFromBottomLeft(.05f, .05f);
	BackToPauseMenuButton.normalTouchOffsets = new UIEdgeOffsets( 30 );
	BackToPauseMenuButton.highlightedTouchOffsets = new UIEdgeOffsets( 30 );
		
	loadLevelOne = UIButton.create("level1.png","level1.png", 0, 0);
	loadLevelOne.positionFromTopLeft(buttonScaleFactor,0.05f);
	loadLevelOne.onTouchUpInside += LoadLevel1ViaStart;
	loadLevelOne.onTouchUp += upLevel1;
	loadLevelOne.onTouchDown += downLevel1;
				
	loadLevelTwo = UIButton.create("level2.png","level2.png", 0, 0);
	loadLevelTwo.positionFromTopLeft(buttonScaleFactor,0.3f);
	loadLevelTwo.onTouchUpInside += LoadLevel2ViaStart;
	loadLevelTwo.onTouchUp += upLevel2;
	loadLevelTwo.onTouchDown += downLevel2;
			
	loadLevelThree = UIButton.create("level3.png","level3.png", 0, 0);
	loadLevelThree.positionFromTopRight(buttonScaleFactor,0.3f);
	loadLevelThree.onTouchUpInside += LoadLevel3ViaStart;
	loadLevelThree.onTouchUp += upLevel3;
	loadLevelThree.onTouchDown += downLevel3;
				
	loadLevelFour = UIButton.create("level4.png","level4.png", 0, 0);
	loadLevelFour.positionFromTopRight(buttonScaleFactor,0.05f);
	loadLevelFour.onTouchUpInside += LoadLevel4ViaStart;		
	loadLevelFour.onTouchUp += upLevel4;
	loadLevelFour.onTouchDown += downLevel4;
		
	loadLevelOne.hidden = true;
	loadLevelTwo.hidden = true;
	loadLevelThree.hidden = true;
	loadLevelFour.hidden = true;
		
	BackToPauseMenuButton.onTouchUpInside += BackToPauseMenu;	
	BackToPauseMenuButton.hidden = true;
	
	loadingLabel = UIButton.create("loading.png","loading.png", 20, 20);
	loadingLabel.positionFromCenter(0f, 0f);
	loadingLabel.hidden = true;
	
	loadNewLevelButton = UIButton.create("newlevel.png","newlevel.png", 40, 40);
	loadNewLevelButton.positionFromBottomLeft(.05f, .05f);
	loadNewLevelButton.normalTouchOffsets = new UIEdgeOffsets( 30 );
	loadNewLevelButton.highlightedTouchOffsets = new UIEdgeOffsets( 30 );
	loadNewLevelButton.onTouchUpInside += LevelSelect;
	loadNewLevelButton.hidden = true;
	
	// openSiteButton = UIButton.create("website.png","website.png", 40, 40);
	// openSiteButton.positionFromBottomRight(.05f, .05f);	
	// openSiteButton.onTouchUpInside += OpenSite;
	// openSiteButton.hidden = true;

	aboutButtonStart = UIButton.create("aboutWhite.png","aboutWhite.png", 40, 40);
	aboutButtonStart.normalTouchOffsets = new UIEdgeOffsets( 30 );
	aboutButtonStart.highlightedTouchOffsets = new UIEdgeOffsets( 30 );
	aboutButtonStart.centerize();
	aboutButtonStart.positionFromBottomLeft(.05f, .05f);	
	aboutButtonStart.onTouchUpInside += OpenAbout;
// 	aboutButtonStart.onTouchUp += fadeOutAbout;	
// 	aboutButtonStart.onTouchDown += fadeInAbout;
	aboutButtonStart.hidden = true;

	howToButton = UIButton.create("howToPlayWhite.png","howToPlayWhite.png", 40, 40);
	howToButton.normalTouchOffsets = new UIEdgeOffsets( 30 );
	howToButton.highlightedTouchOffsets = new UIEdgeOffsets( 30 );
	howToButton.centerize();
	howToButton.positionFromBottomRight(.05f, .05f);	
	howToButton.onTouchUpInside += OpenHowTo;
	howToButton.hidden = true;

	helpIcon1 = UI.firstToolkit.addSprite( "tiltText.png", 0, 0, 0 );
	helpIcon2 = UI.firstToolkit.addSprite( "spheresText.png", 0, 0, 0 );
	helpIcon3 = UI.firstToolkit.addSprite( "boostText.png", 0, 0, 0 );
	helpIcon1.positionFromTop(.3f);
	helpIcon2.positionCenter();
	helpIcon3.positionFromBottom(.3f);
	helpIcon1.hidden = true;
	helpIcon2.hidden = true;
	helpIcon3.hidden = true;

 	yield WaitForSeconds (4);
	bgSpriteStart.alphaTo( 3.0f, 0.85f, Easing.Sinusoidal.easeOut);
	yield WaitForSeconds (1);
	canShowStart = true;
//	ShowStart();
	}

function ShowStart() {
	tiltWarning.hidden = true;
	
	rightArrow.hidden = false;
	leftArrow.hidden = false;
	aboutButtonStart.hidden = false;
	howToButton.hidden = false;
	rightArrow.alphaFromTo( 2.0f, 0.0f, 0.4f, Easing.Sinusoidal.easeIn);
	leftArrow.alphaFromTo( 2.0f, 0.0f, 0.4f, Easing.Sinusoidal.easeIn);
	aboutButtonStart.alphaFromTo( 2.0f, 0.0f, 1.0f, Easing.Sinusoidal.easeIn);
	howToButton.alphaFromTo( 2.0f, 0.0f, 1.0f, Easing.Sinusoidal.easeIn);
	canShowStart = false;
}

function CheckTiltAngle() {
	canShowStart = false;
	
	yield WaitForSeconds (.75);
	if ((Mathf.Abs(Input.acceleration.x) < .4) && (Mathf.Abs(Input.acceleration.y) < .4)) {
		ShowStart();}
	else {canShowStart = true;}
}

function ShowTiltWarning() {
	canShowStart = false;
	
	tiltWarning.hidden = false;
	tiltWarning.alphaFromTo( 0.25f, 0.0f, 1.0f, Easing.Sinusoidal.easeIn);
	yield WaitForSeconds (.75);
	tiltWarning.alphaFromTo( 0.25f, 1.0f, 0.0f, Easing.Sinusoidal.easeOut);	
	yield WaitForSeconds (.5);
	canShowStart = true;
}

function Update () {
	if ((canShowStart == true) && (Mathf.Abs(Input.acceleration.x) < .4) && (Mathf.Abs(Input.acceleration.y) < .4)) {
		CheckTiltAngle();
		bgCamera.backgroundColor = bgColor1;
	}
	else if (canShowStart == true) {
		ShowTiltWarning();

    	var duration = 1.0;
    	        
        bgCamera.backgroundColor = Color.Lerp (bgColor1, bgColor2, 1.0);

    	//var t : float = Mathf.Repeat (Time.time, duration) / duration;        
        
        //var t : float = Mathf.PingPong (Time.time, duration) / duration;
        //bgCamera.backgroundColor = Color.Lerp (bgColor1, bgColor2, t);

	}
//	Debug.Log ("your input accel y is " + Input.acceleration.y + " and input accel x is " + Input.acceleration.x);
}

function PauseGame() {
	if (FallingPlayer.isPausable == true) {
		FallingPlayer.isPausable = false;
		rightArrow.hidden = false;
		leftArrow.hidden = false;
		loadNewLevelButton.hidden = false;
		bgSprite.hidden = false;
		//openSiteButton.hidden = false;
			    
	    savedTimeScale = Time.timeScale;
//		scriptName.GetComponent(FallingPlayer).FadeAudio (.09, FadeDir.Out);
	    yield WaitForSeconds (.1);
	    Time.timeScale = 0;
	    AudioListener.pause = true;
	    FallingPlayer.isPausable = true;	    
    }
}

function UnPauseGame(resume : boolean) {
	FallingPlayer.isPausable = false;
    Time.timeScale = savedTimeScale;
    AudioListener.pause = false;
//	scriptName.GetComponent(FallingPlayer).FadeAudio (1.0, FadeDir.In);

	bgSprite.hidden = true;
	rightArrow.hidden = true;
	leftArrow.hidden = true;
	loadNewLevelButton.hidden = true;
	//openSiteButton.hidden = true;
	FallingPlayer.isPausable = resume;	
    }
    
function IsGamePaused() {
    return Time.timeScale==0;
}

function PauseGameCheck() {
	if (FallingPlayer.isPausable == true) {
		if (Time.timeScale == 0) {
	//	if (AudioListener.pause == true) {
			UnPauseGame(true);
		}
		else {
			PauseGame();
		}
	}
}

function LevelSelect() {
	leftArrow.hidden = true;
	rightArrow.hidden = true;
	pauseButton.hidden = true;
	aboutButtonStart.hidden = true;
	howToButton.hidden = true;

	//openSiteButton.hidden = false;

	loadLevelOne.hidden = false;
	loadLevelTwo.hidden = false;
	loadLevelThree.hidden = false;
	loadLevelFour.hidden = false;
	
	fadeInLoadNewLevels();
	
	loadNewLevelButton.hidden = true;	
	BackToPauseMenuButton.hidden = false;
}

function BackToPauseMenu() {
	leftArrow.hidden = false;
	rightArrow.hidden = false;
	aboutButtonStart.hidden = false;
	howToButton.hidden = false;

//	pauseButton.hidden = false;
	//openSiteButton.hidden = true;
	
	fadeInPauseMenu();
		
	loadLevelOne.hidden = true;
	loadLevelTwo.hidden = true;
	loadLevelThree.hidden = true;
	loadLevelFour.hidden = true;

	helpIcon1.hidden = true;
	helpIcon2.hidden = true;
	helpIcon3.hidden = true;

	text1.hidden = true;
	text2.hidden = true;
	text3.hidden = true;
	openSiteButtonText.hidden = true;

//	loadNewLevelButton.hidden = false;
	BackToPauseMenuButton.hidden = true;
}

function FadeAudio (timer : float) {

    var start = 1.0;
    var end = 0.0;
    var i = 0.0;
    var step = 1.0/timer;

    while (i <= 1.0) {
        i += step * Time.deltaTime;
        sceneAudio.volume = Mathf.Lerp(start, end, i);
        yield;
    }
}

function StartLevelLoad(levelName: String) {
	if (aboutToLoad == false) {
		aboutToLoad = true;
		FadeAudio (fadeTime);
	
		yield FadeOutLevelButtons (fadeTime/2);
		yield WaitForSeconds(fadeTime);
	
		Application.LoadLevel(levelName);
	}
}

function FadeOutLevelButtons(timer : float) {
	BackToPauseMenuButton.hidden = true;
	loadLevelOne.alphaTo(timer, 0.0f, Easing.Sinusoidal.easeOut);	
	loadLevelTwo.alphaTo(timer, 0.0f, Easing.Sinusoidal.easeOut);	
	loadLevelThree.alphaTo(timer, 0.0f, Easing.Sinusoidal.easeOut);	
	loadLevelFour.alphaTo(timer, 0.0f, Easing.Sinusoidal.easeOut);	
	rightArrow.alphaTo(timer, 0.0f, Easing.Sinusoidal.easeOut);
	leftArrow.alphaTo(timer, 0.0f, Easing.Sinusoidal.easeOut);
	aboutButtonStart.alphaTo(timer, 0.0f, Easing.Sinusoidal.easeOut);
	howToButton.alphaTo(timer, 0.0f, Easing.Sinusoidal.easeOut);
	//rightArrow.hidden = true;
	//leftArrow.hidden = true;
	//openSiteButton.hidden = true;
	
	yield WaitForSeconds(timer);
	
	loadLevelOne.hidden = true;
	loadLevelTwo.hidden = true;
	loadLevelThree.hidden = true;
	loadLevelFour.hidden = true;
	rightArrow.hidden = true;
	leftArrow.hidden = true;
	
	loadingLabel.hidden = false;
	loadingLabel.alphaFromTo(.5, 0.0f, 1.0f, Easing.Quartic.easeIn);	
	yield WaitForSeconds(.5);
	
}

function OpenHowTo() {

	rightArrow.hidden = true;
	leftArrow.hidden = true;
	aboutButtonStart.hidden = true;
	howToButton.hidden = true;
	
	BackToPauseMenuButton.hidden = false;

	helpIcon1.hidden = false;
	helpIcon2.hidden = false;
	helpIcon3.hidden = false;	
	helpIcon1.alphaFromTo(.5f, 0.0f, 0.9f, Easing.Sinusoidal.easeOut);
	helpIcon2.alphaFromTo(.75f, 0.0f, 0.9f, Easing.Sinusoidal.easeInOut);
	helpIcon3.alphaFromTo(1.5f, 0.0f, 0.9f, Easing.Sinusoidal.easeInOut);
}

function OpenAbout() {

	rightArrow.hidden = true;
	leftArrow.hidden = true;
	aboutButtonStart.hidden = true;
	howToButton.hidden = true;

	BackToPauseMenuButton.hidden = false;

	openSiteButtonText.hidden = false;
	text1.hidden = false;
	text2.hidden = false;
	text3.hidden = false;
	text1.alphaFromTo(1.0f, 0.0f, 0.8f, Easing.Sinusoidal.easeOut);
	text2.alphaFromTo(1.0f, 0.0f, 1.0f, Easing.Sinusoidal.easeOut);
	text3.alphaFromTo(1.5f, 0.0f, 0.6f, Easing.Sinusoidal.easeInOut);

}

function LoadLevel1ViaStart() {
//	loadLevelOne.hidden = true;
//	loadLevelTwo.hidden = true;
//	loadLevelThree.hidden = true;
//	loadLevelFour.hidden = true;
//	BackToPauseMenuButton.hidden = true;
//	loadingLabel.hidden = false;
//	rightArrow.hidden = true;
//	leftArrow.hidden = true;
		
	StartLevelLoad(level1);
}

function LoadLevel2ViaStart() {
	StartLevelLoad(level2);
}

function LoadLevel3ViaStart() {
	StartLevelLoad(level3);
}

function LoadLevel4ViaStart() {
	StartLevelLoad(level4);
}

function OpenSite() {
	Application.OpenURL ("http://tysonkubota.net/");
}

function OpenFallingSite() {
	Application.OpenURL ("http://tysonkubota.net/falling");
}

function HideGUI() {
	pauseButton.hidden = true;
}

function UnhideGUI() {
	pauseButton.hidden = true;
	pauseButton.alphaFromTo( 1.0f, 0.0f, 1.0f, Easing.Quartic.easeIn);
}

function fadeInRightArrow() {
	rightArrow.alphaTo(.05f, 1.0f, Easing.Sinusoidal.easeOut);
}

function fadeInLeftArrow() {
	leftArrow.alphaTo(.05f, 1.0f, Easing.Sinusoidal.easeOut);
}

function fadeOutRightArrow() {
	rightArrow.alphaTo(.25f, 0.4f, Easing.Sinusoidal.easeOut);
}

function fadeOutLeftArrow() {
	leftArrow.alphaTo(.25f, 0.4f, Easing.Sinusoidal.easeOut);
}

function fadeInLoadNewLevels() {
	loadLevelOne.alphaFromTo(.25f, 0.0f, 0.8f, Easing.Sinusoidal.easeOut);
	loadLevelTwo.alphaFromTo(.25f, 0.0f, 0.8f, Easing.Sinusoidal.easeOut);
	loadLevelThree.alphaFromTo(.25f, 0.0f, 0.8f, Easing.Sinusoidal.easeOut);
	loadLevelFour.alphaFromTo(.25f, 0.0f, 0.8f, Easing.Sinusoidal.easeOut);
}

function fadeInPauseMenu() {
	rightArrow.alphaFromTo( 0.5f, 0.0f, 0.4f, Easing.Sinusoidal.easeInOut);
	leftArrow.alphaFromTo( 0.5f, 0.0f, 0.4f, Easing.Sinusoidal.easeInOut);
	aboutButtonStart.alphaFromTo( 0.5f, 0.0f, 1.0f, Easing.Sinusoidal.easeIn);
	howToButton.alphaFromTo( 0.5f, 0.0f, 1.0f, Easing.Sinusoidal.easeIn);
}

function downLevel1() {
	if (aboutToLoad == false) {
		loadLevelOne.alphaTo(.05f, 1.0f, Easing.Sinusoidal.easeOut);	
	}
}

function downLevel2() {
	if (aboutToLoad == false) {
		loadLevelTwo.alphaTo(.05f, 1.0f, Easing.Sinusoidal.easeOut);	
	}
}

function downLevel3() {
	if (aboutToLoad == false) {
		loadLevelThree.alphaTo(.05f, 1.0f, Easing.Sinusoidal.easeOut);	
	}
}

function downLevel4() {
	if (aboutToLoad == false) {
		loadLevelFour.alphaTo(.05f, 1.0f, Easing.Sinusoidal.easeOut);	
	}
}


function upLevel1() {
	if (aboutToLoad == false) {
		loadLevelOne.alphaTo(.25f, 0.8f, Easing.Sinusoidal.easeOut);	
	}
}

function upLevel2() {
	if (aboutToLoad == false) {
		loadLevelTwo.alphaTo(.25f, 0.8f, Easing.Sinusoidal.easeOut);	
	}
}

function upLevel3() {
	if (aboutToLoad == false) {
		loadLevelThree.alphaTo(.25f, 0.8f, Easing.Sinusoidal.easeOut);	
	}
}

function upLevel4() {
	if (aboutToLoad == false) {
		loadLevelFour.alphaTo(.25f, 0.8f, Easing.Sinusoidal.easeOut);	
	}
}