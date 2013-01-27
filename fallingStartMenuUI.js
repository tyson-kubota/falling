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

private var savedTimeScale:float;

var canShowStart : boolean;

function Start () {
//  yield WaitForSeconds(0.5f);

//	  Testing to see if disabling this hard coded screen.orientation will allow auto detection of landscape 
//	  right or left mode on startup.
//    Screen.orientation = ScreenOrientation.LandscapeLeft;

//    if (iPhoneInput.orientation == iPhoneOrientation.LandscapeRight) {
//	Screen.orientation = ScreenOrientation.LandscapeRight;}
//	else {Screen.orientation = ScreenOrientation.LandscapeLeft;}
	Camera.main.SendMessage("fadeIn");
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

	tiltWarning = UIButton.create("tiltwarning.png","tiltwarning.png", 0, 0);
	tiltWarning.positionFromTop(buttonScaleFactor);
	
	rightArrow = UIButton.create("start.png","startDown.png", 0, 0);
	rightArrow.positionFromTopRight(buttonScaleFactor,0.2f);
	rightArrow.onTouchUpInside += LoadLevel1ViaStart;
	
	leftArrow = UIButton.create("chooselevel.png","chooselevelDown.png", 0, 0);
	leftArrow.positionFromTopLeft(buttonScaleFactor,0.2f);
	leftArrow.onTouchUpInside += LevelSelect;
	
	tiltWarning.hidden = true;
	rightArrow.hidden = true;
	leftArrow.hidden = true;
	
	BackToPauseMenuButton = UIButton.create("back.png","back.png", 40, 40);
	BackToPauseMenuButton.positionFromBottomLeft(.05f, .05f);
	BackToPauseMenuButton.normalTouchOffsets = new UIEdgeOffsets( 30 );
	BackToPauseMenuButton.highlightedTouchOffsets = new UIEdgeOffsets( 30 );

	if (level1 == Application.loadedLevelName) {
	loadLevelOne = UIButton.create("level1Down.png","level1.png", 0, 0);}
	else {				
	loadLevelOne = UIButton.create("level1.png","level1Down.png", 0, 0);}
	loadLevelOne.positionFromTopLeft(buttonScaleFactor,0.05f);
	loadLevelOne.onTouchUpInside += LoadLevel1ViaStart;
	
	if (level2 == Application.loadedLevelName) {
	loadLevelTwo = UIButton.create("level1Down.png","level1.png", 0, 0);}
	else {				
	loadLevelTwo = UIButton.create("level1.png","level1Down.png", 0, 0);}
	loadLevelTwo.positionFromTopLeft(buttonScaleFactor,0.3f);
	loadLevelTwo.onTouchUpInside += LoadLevel2ViaStart;
	
	if (level3 == Application.loadedLevelName) {
	loadLevelThree = UIButton.create("level1Down.png","level1.png", 0, 0);}
	else {				
	loadLevelThree = UIButton.create("level1.png","level1Down.png", 0, 0);}
	loadLevelThree.positionFromTopRight(buttonScaleFactor,0.3f);
	loadLevelThree.onTouchUpInside += LoadLevel3ViaStart;
	
	if (level4 == Application.loadedLevelName) {
	loadLevelFour = UIButton.create("level1Down.png","level1.png", 0, 0);}
	else {				
	loadLevelFour = UIButton.create("level1.png","level1Down.png", 0, 0);}
	loadLevelFour.positionFromTopRight(buttonScaleFactor,0.05f);
	loadLevelFour.onTouchUpInside += LoadLevel4ViaStart;		
	
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
	
	openSiteButton = UIButton.create("website.png","website.png", 40, 40);
	openSiteButton.positionFromBottomRight(.05f, .05f);	
	openSiteButton.onTouchUpInside += OpenSite;
	openSiteButton.hidden = true;

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
	rightArrow.alphaFromTo( 2.0f, 0.0f, 1.0f, Easing.Sinusoidal.easeIn);
	leftArrow.alphaFromTo( 2.0f, 0.0f, 1.0f, Easing.Sinusoidal.easeIn);
	canShowStart = false;
}

function CheckTiltAngle() {
	canShowStart = false;
	
	yield WaitForSeconds (.75);
	if ((Mathf.Abs(Input.acceleration.x) < .25) && (Mathf.Abs(Input.acceleration.y) < .25)) {
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
	if ((canShowStart == true) && (Mathf.Abs(Input.acceleration.x) < .2) && (Mathf.Abs(Input.acceleration.y) < .2)) {
		CheckTiltAngle();
	}
	else if (canShowStart == true) {
		ShowTiltWarning();
	}
//	Debug.Log ("your input accel y is " + Input.acceleration.y + " and input accel x is " + Input.acceleration.x);
}

function PauseGame() {
	if (FallingPlayer.isPausable == true) {
		rightArrow.hidden = false;
		leftArrow.hidden = false;
		loadNewLevelButton.hidden = false;
		bgSprite.hidden = false;
		openSiteButton.hidden = false;
			    
	    savedTimeScale = Time.timeScale;
//		scriptName.GetComponent(FallingPlayer).FadeAudio (.09, FadeDir.Out);
	    yield WaitForSeconds (.1);
	    Time.timeScale = 0;
	    AudioListener.pause = true;
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
	openSiteButton.hidden = true;
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

function LevelComplete() {
	FallingPlayer.isPausable = false;
	controllerITween2.Slowdown = 0;
	bgSprite.hidden = false;
	bgSprite.alphaFromTo( 1.0f, 0.0f, 0.8f, Easing.Sinusoidal.easeOut);
//	yield WaitForSeconds (.5);
// fade in congrats menu / buttons here 

    savedTimeScale = Time.timeScale;
    scriptName.GetComponent(FallingPlayer).FadeAudio (.8, FadeDir.Out);
    scriptName.rigidbody.isKinematic = true;
    yield WaitForSeconds (1);
//    Time.timeScale = 0;
    AudioListener.pause = true;	
	loadingLabel.hidden = false;
	Application.LoadLevel(levelToLoad);
	Time.timeScale = savedTimeScale;
}

function LoadNewLevelViaMenu() {
	loadLevelOne.hidden = true;
	loadLevelTwo.hidden = true;
	loadLevelThree.hidden = true;
	loadLevelFour.hidden = true;
	BackToPauseMenuButton.hidden = true;
	loadingLabel.hidden = false;

	Application.LoadLevel(levelToLoad);
	Time.timeScale = savedTimeScale;
}

function LevelSelect() {
	leftArrow.hidden = true;
	rightArrow.hidden = true;
	pauseButton.hidden = true;
	
	loadLevelOne.hidden = false;
	loadLevelTwo.hidden = false;
	loadLevelThree.hidden = false;
	loadLevelFour.hidden = false;
	
	loadNewLevelButton.hidden = true;	
	BackToPauseMenuButton.hidden = false;
}

function BackToPauseMenu() {
	leftArrow.hidden = false;
	rightArrow.hidden = false;
	pauseButton.hidden = false;
	
	loadLevelOne.hidden = true;
	loadLevelTwo.hidden = true;
	loadLevelThree.hidden = true;
	loadLevelFour.hidden = true;
	
	loadNewLevelButton.hidden = false;
	BackToPauseMenuButton.hidden = true;
}


function LoadLevel1ViaStart() {
	loadLevelOne.hidden = true;
	loadLevelTwo.hidden = true;
	loadLevelThree.hidden = true;
	loadLevelFour.hidden = true;
	BackToPauseMenuButton.hidden = true;
	loadingLabel.hidden = false;
	rightArrow.hidden = true;
	leftArrow.hidden = true;
	
	Application.LoadLevel(level1);
}

function LoadLevel2ViaStart() {
	loadLevelOne.hidden = true;
	loadLevelTwo.hidden = true;
	loadLevelThree.hidden = true;
	loadLevelFour.hidden = true;
	BackToPauseMenuButton.hidden = true;
	loadingLabel.hidden = false;	
	
	Application.LoadLevel(level2);
}

function LoadLevel3ViaStart() {
	loadLevelOne.hidden = true;
	loadLevelTwo.hidden = true;
	loadLevelThree.hidden = true;
	loadLevelFour.hidden = true;
	BackToPauseMenuButton.hidden = true;
	loadingLabel.hidden = false;
	
	Application.LoadLevel(level3);
}

function LoadLevel4ViaStart() {
	loadLevelOne.hidden = true;
	loadLevelTwo.hidden = true;
	loadLevelThree.hidden = true;
	loadLevelFour.hidden = true;
	BackToPauseMenuButton.hidden = true;
	loadingLabel.hidden = false;
	
	Application.LoadLevel(level4);
}

function OpenSite() {
	Application.OpenURL ("http://tyson-kubota.github.com/");
}

function HideGUI() {
		pauseButton.hidden = true;
}

function UnhideGUI() {
		pauseButton.hidden = true;
		pauseButton.alphaFromTo( 1.0f, 0.0f, 1.0f, Easing.Quartic.easeIn);
}