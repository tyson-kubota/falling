#pragma strict

var player : GameObject;
var fallingPlayerComponent : FallingPlayer;
var fallingLaunch : GameObject;
var fallingLaunchComponent : FallingLaunch;

var value : float = 0.5f;
var bgSprite : UISprite;
//static var tutorialSprite : UISprite;
static var tutorialSpriteExtraTimer : float = 0; 
var fadeSprite : UISprite;
var pauseButton : UIButton;
var circleReticle: UIButton;
var lifeBarOutline : UIProgressBar;
var lifeBar : UIProgressBar;
var lifeBarThreat : UIProgressBar;
var rightArrow : UIButton;
var leftArrow : UIButton;
var loadNewLevelButton : UIButton;
var loadLevelOne : UIButton;
var loadLevelTwo : UIButton;
var loadLevelThree : UIButton;
var loadLevelFour : UIButton;

static var nextLevelLabel : UISprite;

var ScreenH : float = Screen.height;
var ScreenW : float = Screen.width;
var screenAspectRatio : float = ScreenH / ScreenW;

// OPTIONS MENU STUFF

var angledTiltLabel : UIButton;
var flatTiltLabel : UIButton;
var TogglingTiltNeutral : boolean = false;

var boldText : UIText;
var thinText : UIText;

var tiltText2 : UITextInstance;
var invertAxesText1 : UITextInstance;
var invertAxesText1Yes : UIButton;
var invertAxesText1No : UIButton;

var optionsButton : UIButton;
var isSaving : boolean = false;

static var loadingLabel : UIButton;
var BackToPauseMenuButton : UIButton;
var BackToHomeMenuButton : UIButton;

static var spriteEdgeSize : int;
var buttonScaleFactor : float;
var initialRespawn : Respawn;

var levelToLoad : String = "";

var homeLevel : String = "Falling-scene-menu";

var level1 : String = "Falling-scene-tutorial";
var level2 : String = "Falling-scene2";
var level3 : String = "Falling-scene3";
var level4 : String = "Falling-scene4";

var level2Unlocked : boolean = false;
var level3Unlocked : boolean = false;
var level4Unlocked : boolean = false;

static var holdingPauseButton : boolean = false;
static var origPauseButtonArea : Rect;

private var savedTimeScale:float;
//var x:float;
//var y:float;
// private var lifeBar = UIProgressBar.create( "lifeBarRedTest.png", 0, 0 );

function Awake () {
	screenAspectRatio = (ScreenH / ScreenW);
}

function Start () {
//  yield WaitForSeconds(0.5f);

//	  Testing to see if disabling this hard coded screen.orientation will allow auto detection of landscape 
//	  right or left mode on startup.
//    Screen.orientation = ScreenOrientation.LandscapeLeft;

//    if (iPhoneInput.orientation == iPhoneOrientation.LandscapeRight) {
//	Screen.orientation = ScreenOrientation.LandscapeRight;}
//	else {Screen.orientation = ScreenOrientation.LandscapeLeft;}
	
	fallingPlayerComponent = player.GetComponent("FallingPlayer");
	//moveControllerComponent = player.GetComponent("MoveController");
	fallingLaunch = GameObject.Find("LaunchGameObject");
	fallingLaunchComponent = fallingLaunch.GetComponent("FallingLaunch");
	
    bgSprite = UI.firstToolkit.addSprite( "menuBackground.png", 0, 0, 2 );
	bgSprite.positionCenter();
	bgSprite.scaleTo( 0.01f, new Vector3( (Screen.width * 6), (Screen.height * 6), 1 ), Easing.Linear.easeIn);
	bgSprite.alphaTo( 0.01f, 0.9f, Easing.Sinusoidal.easeOut);
	bgSprite.hidden = true;
	//Debug.Log("your highest level achieved is " + FallingLaunch.levelAchieved);

	if (FallingLaunch.levelAchieved == 5) {
		//loadLevelTwo.alphaTo(0.01f, 0.0f, Easing.Sinusoidal.easeOut);
		level2Unlocked = true;
		level3Unlocked = true;
		level4Unlocked = true;
	}
	else if (FallingLaunch.levelAchieved == 4) {
		level2Unlocked = true;
		level3Unlocked = true;
	}		
	else if (FallingLaunch.levelAchieved == 3) {
		level2Unlocked = true;
	}

	if (FallingLaunch.debugMode) {
		level2Unlocked = true;
		level3Unlocked = true;
		level4Unlocked = true;
	}

	var tiltPlacementRatio : float;

	if (UI.isHD == true) {
		spriteEdgeSize = 4;
		buttonScaleFactor = (((Screen.height / 2.0) - 100.0) / Screen.height);
		tiltPlacementRatio = (196.0/Screen.width);
	}
	else {
		spriteEdgeSize = 2;
		buttonScaleFactor = (((Screen.height / 2.0) - 50.0) / Screen.height);
		tiltPlacementRatio = (98.0/Screen.width);
	}

	boldText = new UIText( "font-bold", "font-bold.png" );
	thinText = new UIText( "font-thin", "font-thin.png" );
		
	boldText.alignMode = UITextAlignMode.Center;
	boldText.verticalAlignMode = UITextVerticalAlignMode.Middle;
    boldText.wrapMode = UITextLineWrapMode.MinimumLength;

	thinText.alignMode = UITextAlignMode.Center;
	thinText.verticalAlignMode = UITextVerticalAlignMode.Middle;
    thinText.wrapMode = UITextLineWrapMode.None;

		
//	var tutorialHeight = 1.25 * spriteEdgeSize;
//	tutorialSprite = UI.firstToolkit.addSprite( "tutorialBackground.png", 0, 0, 4 );
//	tutorialSprite.hidden = true;
//	tutorialSprite.scaleTo( 0.1f, new Vector3( (Screen.width), 3, 1 ), Easing.Sinusoidal.easeOut);
	
	fadeSprite = UI.firstToolkit.addSprite( "menuBackgroundBlack.png", 0, 0, -1 );
	fadeSprite.positionCenter();
	fadeSprite.scaleTo( 0.01f, new Vector3( (Screen.width * 6), (Screen.height * 6), 1 ), Easing.Linear.easeIn);
	fadeSprite.alphaTo( 0.01f, 0.0f, Easing.Sinusoidal.easeOut);
	fadeSprite.hidden = true;

	pauseButton = UIButton.create("pauseWhite.png","pauseGray.png", 0, 0);
	pauseButton.pixelsFromTopRight( 5, 5 );
	pauseButton.highlightedTouchOffsets = new UIEdgeOffsets(30);
	pauseButton.onTouchUpInside += PauseGameCheck;
	pauseButton.onTouchDown += setHoldingPauseButtonTrue;
	pauseButton.onTouchUp += setHoldingPauseButtonFalse;

	holdingPauseButton = false;

	rightArrow = UIButton.create("start.png","startDown.png", 0, 0);
	rightArrow.positionFromTopRight(buttonScaleFactor,0.2f);
	rightArrow.onTouchUpInside += PauseGameCheck;

	leftArrow = UIButton.create("restart.png","restart.png", 0, 0);
	leftArrow.positionFromBottomLeft(.05f, .05f);
	leftArrow.onTouchUpInside += RestartLevel;

	rightArrow.hidden = true;
	leftArrow.hidden = true;
	
	BackToPauseMenuButton = UIButton.create("back.png","back.png", 40, 40);
	BackToPauseMenuButton.positionFromBottomLeft ( .05f, (.05f * screenAspectRatio) );
	//BackToPauseMenuButton.pixelsFromBottomLeft ( 14, 14 );
	BackToPauseMenuButton.normalTouchOffsets = new UIEdgeOffsets( 30 );
	BackToPauseMenuButton.highlightedTouchOffsets = new UIEdgeOffsets( 30 );	
	BackToPauseMenuButton.onTouchUpInside += BackToPauseMenu;	
	BackToPauseMenuButton.hidden = true;

	BackToHomeMenuButton = UIButton.create("homeArrows.png","homeArrows.png", 40, 40);
	BackToHomeMenuButton.positionFromTopLeft ( .05f, (.05f * screenAspectRatio) );
	//BackToHomeMenuButton.pixelsFromTopLeft ( 14, 14 );
	BackToHomeMenuButton.normalTouchOffsets = new UIEdgeOffsets( 30 );
	BackToHomeMenuButton.highlightedTouchOffsets = new UIEdgeOffsets( 30 );
	BackToHomeMenuButton.onTouchUpInside += LoadHomeViaMenu;
	BackToHomeMenuButton.hidden = true;

	if (level1 == Application.loadedLevelName) {
		nextLevelLabel = UI.firstToolkit.addSprite( "level2.png", 0, 0, 0 );
	}
	else if (level2 == Application.loadedLevelName) {
		nextLevelLabel = UI.firstToolkit.addSprite( "level3.png", 0, 0, 0 );	
	}
	else if (level3 == Application.loadedLevelName) {
		nextLevelLabel = UI.firstToolkit.addSprite( "level4.png", 0, 0, 0 );	
	}
	else if (level4 == Application.loadedLevelName) {
		nextLevelLabel = UI.firstToolkit.addSprite( "level1.png", 0, 0, 0 );	
	}

	//nextLevelLabel.positionFromCenter(.0f);
	nextLevelLabel.positionCenter();
	nextLevelLabel.hidden = true;

	if (level1 == Application.loadedLevelName) {
		loadLevelOne = UIButton.create("level1.png","level1.png", 0, 0);
		loadLevelOne.alphaTo( 0.01f, 0.75f, Easing.Sinusoidal.easeOut);
	}
	else {				
		loadLevelOne = UIButton.create("level1.png","level1.png", 0, 0);
		loadLevelOne.alphaTo( 0.01f, 0.4f, Easing.Sinusoidal.easeOut);
	}
	loadLevelOne.positionFromTopLeft(buttonScaleFactor,0.05f);
	loadLevelOne.onTouchUpInside += LoadLevel1ViaMenu;
	
	if (level2 == Application.loadedLevelName) {
		loadLevelTwo = UIButton.create("level2.png","level2.png", 0, 0);
		loadLevelTwo.alphaTo( 0.01f, 0.75f, Easing.Sinusoidal.easeOut);
		loadLevelTwo.onTouchUpInside += LoadLevel2ViaMenu;
	}
	else {				
		loadLevelTwo = UIButton.create("level2.png","level2.png", 0, 0);
			if (level2Unlocked == false) {
				loadLevelTwo.alphaTo( 0.01f, 0.05f, Easing.Sinusoidal.easeOut);
				loadLevelTwo.onTouchUpInside += DoNothing;}
			else {
				loadLevelTwo.alphaTo( 0.01f, 0.4f, Easing.Sinusoidal.easeOut);
				loadLevelTwo.onTouchUpInside += LoadLevel2ViaMenu;
			}
	}
	loadLevelTwo.positionFromTopLeft(buttonScaleFactor,0.3f);
	
	if (level3 == Application.loadedLevelName) {
		loadLevelThree = UIButton.create("level3.png","level3.png", 0, 0);
		loadLevelThree.alphaTo( 0.01f, 0.75f, Easing.Sinusoidal.easeOut);
		loadLevelThree.onTouchUpInside += LoadLevel3ViaMenu;
	}
	else {				
		loadLevelThree = UIButton.create("level3.png","level3.png", 0, 0);
			if (level3Unlocked == false) {
				loadLevelThree.alphaTo( 0.01f, 0.05f, Easing.Sinusoidal.easeOut);
				loadLevelThree.onTouchUpInside += DoNothing;}
			else {
				loadLevelThree.alphaTo( 0.01f, 0.4f, Easing.Sinusoidal.easeOut);
				loadLevelThree.onTouchUpInside += LoadLevel3ViaMenu;
			}
	}
	loadLevelThree.positionFromTopRight(buttonScaleFactor,0.3f);
	
	if (level4 == Application.loadedLevelName) {
		loadLevelFour = UIButton.create("level4.png","level4.png", 0, 0);
		loadLevelFour.alphaTo( 0.01f, 0.75f, Easing.Sinusoidal.easeOut);
		loadLevelFour.onTouchUpInside += LoadLevel4ViaMenu;
	}
	else {				
		loadLevelFour = UIButton.create("level4.png","level4.png", 0, 0);
			if (level4Unlocked == false) {
				loadLevelFour.alphaTo( 0.01f, 0.05f, Easing.Sinusoidal.easeOut);
				loadLevelFour.onTouchUpInside += DoNothing;}
			else {
				loadLevelFour.alphaTo( 0.01f, 0.4f, Easing.Sinusoidal.easeOut);
				loadLevelFour.onTouchUpInside += LoadLevel4ViaMenu;
			}
	}
	loadLevelFour.positionFromTopRight(buttonScaleFactor,0.05f);

	loadLevelOne.hidden = true;
	loadLevelTwo.hidden = true;
	loadLevelThree.hidden = true;
	loadLevelFour.hidden = true;
	
	loadingLabel = UIButton.create("loading.png","loading.png", 20, 20);
	loadingLabel.positionCenter();
	loadingLabel.hidden = true;
	
	loadNewLevelButton = UIButton.create("chooselevel.png","chooselevelDown.png", 40, 40);
	loadNewLevelButton.positionFromTopLeft(buttonScaleFactor,0.2f);
	loadNewLevelButton.normalTouchOffsets = new UIEdgeOffsets( 30 );
	loadNewLevelButton.highlightedTouchOffsets = new UIEdgeOffsets( 30 );
	loadNewLevelButton.hidden = true;

	if (level2Unlocked) {
		loadNewLevelButton.onTouchUpInside += LevelSelect;
	}
	else {
		rightArrow.positionFromCenter(0f,0f);
	}

	optionsButton = UIButton.create("options.png", "options.png", 0,0);
	optionsButton.positionFromBottomRight ( .05f, (.05f * screenAspectRatio) );
	//optionsButton.pixelsFromBottomRight(14,14);
	optionsButton.normalTouchOffsets = new UIEdgeOffsets( 40 );
	optionsButton.highlightedTouchOffsets = new UIEdgeOffsets( 40 );
	optionsButton.onTouchUpInside += ShowOptions;
	optionsButton.hidden = true;

	tiltText2 = thinText.addTextInstance( "NEUTRAL TILT ANGLE", 0, 0 );
    tiltText2.verticalAlignMode = UITextVerticalAlignMode.Bottom;
    tiltText2.positionFromRight( -.08f, .52f );
	tiltText2.hidden = true;
	invertAxesText1 = thinText.addTextInstance( "TILT AXES", 0, 0 );
	invertAxesText1.verticalAlignMode = UITextVerticalAlignMode.Bottom;
    invertAxesText1.positionFromRight( .08f, .52f );
	invertAxesText1.hidden = true;


	invertAxesText1Yes = UIButton.create("axisInverted.png","axisInverted.png", 0, 0 );
    invertAxesText1Yes.positionFromLeft( .08f, .52f );
	invertAxesText1Yes.hidden = true;
	invertAxesText1Yes.alphaTo(0.01f, 0.75f, Easing.Sinusoidal.easeOut);

	invertAxesText1No = UIButton.create("axisNormal.png","axisNormal.png", 0, 0 );
    invertAxesText1No.positionFromLeft( .08f, .52f );
	invertAxesText1No.hidden = true;
	invertAxesText1No.alphaTo(0.01f, 0.4f, Easing.Sinusoidal.easeOut);

	invertAxesText1Yes.onTouchUpInside += UndoInvertedAxes;
	invertAxesText1No.onTouchUpInside += DoInvertedAxes;

	invertAxesText1Yes.highlightedTouchOffsets = new UIEdgeOffsets( 20 );
	invertAxesText1No.highlightedTouchOffsets = new UIEdgeOffsets( 20 );
	invertAxesText1Yes.normalTouchOffsets = new UIEdgeOffsets( 20 );
	invertAxesText1No.normalTouchOffsets = new UIEdgeOffsets( 20 );


	angledTiltLabel = UIButton.create("neutralAngle45.png","neutralAngle45.png", 0, 0 );
	angledTiltLabel.normalTouchOffsets = new UIEdgeOffsets( 30 );
	angledTiltLabel.highlightedTouchOffsets = new UIEdgeOffsets( 30 );
	angledTiltLabel.positionFromLeft( -.08f, .52f );	
	angledTiltLabel.onTouchUpInside += ToggleTiltNeutral;
	angledTiltLabel.hidden = true;

	flatTiltLabel = UIButton.create("neutralAngleFlat.png","neutralAngleFlat.png", 0, 0 );
	flatTiltLabel.normalTouchOffsets = new UIEdgeOffsets( 30 );
	flatTiltLabel.highlightedTouchOffsets = new UIEdgeOffsets( 30 );
	flatTiltLabel.positionFromLeft( -.08f, .52f );
	flatTiltLabel.onTouchUpInside += ToggleTiltNeutral;
	flatTiltLabel.hidden = true;


	circleReticle = UIButton.create("circle-reticle.png","circle-reticle.png", 0, 0);
	circleReticle.positionCenter();
	
	lifeBarOutline = UIProgressBar.create( "lifeBarOutline.png", 0, 0 );
	lifeBarOutline.pixelsFromTopLeft ( 8, 8 );
	lifeBarOutline.value = 1f;
	lifeBarOutline.resizeTextureOnChange = false;

	lifeBarThreat = UIProgressBar.create( "lifeBarRed.png", 0, 0 );
	lifeBarThreat.rightToLeft = true;
	lifeBarThreat.pixelsFromTopLeft ( 10, 246 );
	lifeBarThreat.value = 1f;
//	lifeBarThreat.resizeTextureOnChange = true;
//	animateThreatBar (lifeBarThreat);
	lifeBarThreat.hidden = true;
	lifeBarThreat.alphaFromTo( 0.01f, 0f, 0f, Easing.Sinusoidal.easeOut);
					
	lifeBar = UIProgressBar.create( "lifeBarWhite.png", 0, 0 );
	lifeBar.pixelsFromTopLeft ( 10, 10 );
	lifeBar.resizeTextureOnChange = true;
	lifeBar.value = 0.67f;	
	animateProgressBar (lifeBar);
//	Loop ();

	GA.API.Design.NewEvent("LevelBegin:" + Application.loadedLevelName + ":" + FallingLaunch.thisLevelArea, FallingLaunch.secondsInLevel, transform.parent.position);

	if (FallingLaunch.restPosition == FallingLaunch.neutralPosFlat) {
		GA.API.Design.NewEvent("TiltPreference:" + Application.loadedLevelName, 0.0f, transform.parent.position);
	}
	else {
		GA.API.Design.NewEvent("TiltPreference:" + Application.loadedLevelName, 45.0f, transform.parent.position);
	}
	if (FallingLaunch.invertAxesVal == 1) {
		GA.API.Design.NewEvent("AxesPreference:" + Application.loadedLevelName, 1.0f, transform.parent.position);
	}
	if (FallingLaunch.invertAxesVal == -1) {
		GA.API.Design.NewEvent("AxesPreference:" + Application.loadedLevelName, -1.0f, transform.parent.position);
	}
	}

function animateProgressBar(lifeBar : UIProgressBar) {
	while (true)
	{
	lifeBar.value = (parseFloat(ScoreController.visibleScore)/parseFloat(ScoreController.maxScore));
//	Debug.Log(lifeBar.value + " is lifebar value");
//	Debug.Log(ScoreController.currentScore + " is currentScore");
//	yield WaitForSeconds (1);
	yield 0;
	}
}

function animateThreatBar(lifeBar : UIProgressBar) {
	while (true)
	{
	lifeBar.value = (1 - (parseFloat(ScoreController.visibleScore)/parseFloat(ScoreController.maxScore)));
	yield 0;
	}
}

function flashProgressBar(delay : float) {
	lifeBar.alphaTo( 0.01f, 1.0f, Easing.Sinusoidal.easeOut);
	yield WaitForSeconds(.25);
	lifeBar.alphaTo( delay, 0.5f, Easing.Sinusoidal.easeInOut);
}

function showThreatBar(delay : float) {
	lifeBarThreat.hidden = false;
	lifeBarThreat.alphaTo( delay, 0.25f, Easing.Sinusoidal.easeInOut);
}

function hideThreatBar(delay : float) {
	lifeBarThreat.alphaTo( delay, 0.0f, Easing.Sinusoidal.easeInOut);
}

function flashThreatBar(delay : float) {
	lifeBarThreat.hidden = false;
	lifeBarThreat.alphaFromTo( delay, 1.0f, 0.0f, Easing.Sinusoidal.easeInOut);
	yield WaitForSeconds(delay);
//	lifeBarThreat.hidden = true;
}

function PauseGame() {
	if (FallingPlayer.isPausable == true) {
		FallingPlayer.isPausable = false;
		
		FallingLaunch.secondsInLevel = (Time.time - FallingPlayer.levelStartTime);
		GA.API.Design.NewEvent("GUI:PauseGame:" + Application.loadedLevelName + ":" + FallingLaunch.thisLevelArea, FallingLaunch.secondsInLevel, transform.parent.position);
		//Debug.Log("you paused at " + transform.parent.position);
		
		circleReticle.hidden = true;
		lifeBar.hidden = true;
		lifeBarOutline.hidden = true;
	    lifeBarThreat.hidden = true;
	    
	    origPauseButtonArea = MoveController.pauseButtonArea;
	    MoveController.pauseButtonArea = Rect(0, 0, Screen.width, Screen.height);

	    savedTimeScale = Time.timeScale;
		fallingPlayerComponent.FadeAudio (.09, FadeDir.Out);
	    yield WaitForSeconds (.1);
	    Time.timeScale = 0;
	    AudioListener.pause = true;

   		rightArrow.hidden = false;
		//leftArrow.hidden = false;
		if (level2Unlocked) {loadNewLevelButton.hidden = false;}
		BackToHomeMenuButton.hidden = false;
		optionsButton.hidden = false;
		bgSprite.hidden = false;

		//DisplayTiltOnPause();

		//clear any unused stuff in pause menu. 
		//audio and video should be stopped, so any hiccuping won't be as obvious.
		Resources.UnloadUnusedAssets();

		initialRespawn.SaveCheckpoint();

	    FallingPlayer.isPausable = true;
    }
}

function UnPauseGame(resume : boolean) {
	FallingPlayer.isPausable = false;
    Time.timeScale = savedTimeScale;
    AudioListener.pause = false;
	fallingPlayerComponent.FadeAudio (1.0, FadeDir.In);
	circleReticle.hidden = false;
	lifeBar.hidden = false;
	lifeBarOutline.hidden = false;
	lifeBarThreat.hidden = false;
	
	bgSprite.hidden = true;
	rightArrow.hidden = true;
	leftArrow.hidden = true;
	loadNewLevelButton.hidden = true;
	BackToHomeMenuButton.hidden = true;
	HideOptionsButton();

	angledTiltLabel.hidden = true;
	flatTiltLabel.hidden = true;

	FallingPlayer.isPausable = resume;	
	holdingPauseButton = false;
	MoveController.pauseButtonArea = origPauseButtonArea;
    }
    
function IsGamePaused() {
    return Time.timeScale==0;
}

function PauseGameCheck() {

	holdingPauseButton = true;
	
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

function RestartLevel() {
	FallingPlayer.isPausable = false;	
//	Camera.main.SendMessage("fadeOut");
	//fadeOut();
	
	GA.API.Design.NewEvent("GUI:RestartLevel:" + Application.loadedLevelName + ":" + FallingLaunch.thisLevelArea, FallingLaunch.secondsInLevel, transform.parent.position);
	
	Respawn.currentRespawn = initialRespawn;
	HideGUI();
	fallingPlayerComponent.DeathRespawn ();
	UnPauseGame(false);
}

function LevelComplete() {
	HideGUI();
	FallingPlayer.isPausable = false;
	MoveController.Slowdown = 0;
	bgSprite.hidden = false;
	bgSprite.alphaFromTo( 3.0f, 0.0f, 0.97f, Easing.Sinusoidal.easeIn);
	FallingLaunch.levelEndSlowdown = MoveController.Slowdown;
	
	yield WaitForSeconds (3);
// fade in congrats menu / buttons here 

    savedTimeScale = Time.timeScale;
	//loadingLabel.hidden = false;
	//loadingLabel.alphaFromTo( 0.75f, 0.0f, 1.0f, Easing.Sinusoidal.easeIn);    
	nextLevelLabel.hidden = false;
	nextLevelLabel.alphaFromTo( 1.0f, 0.0f, 0.75f, Easing.Sinusoidal.easeIn);    
    fallingPlayerComponent.FadeAudio (.9, FadeDir.Out);
    yield WaitForSeconds (1);
//  Time.timeScale = 0;
	player.rigidbody.isKinematic = true;
    AudioListener.pause = true;
	Application.LoadLevel(levelToLoad);
//  not necessary because Respawn.js resets the latest checkpoint in its Start	
//	PlayerPrefs.SetString("LatestLevel", levelToLoad);
	FallingLaunch.levelAchieved = (Application.loadedLevel + 1);
 	PlayerPrefs.SetInt("HighestLevel", (Application.loadedLevel + 1));
	Time.timeScale = savedTimeScale;
	PlayerPrefs.Save();
}

function BeginOutroUI() {
	FadeOutGUI();
	FallingPlayer.isPausable = false;
	player.rigidbody.isKinematic = true;
}

function OldGameCompleteUI() {
	bgSprite.hidden = false;
	bgSprite.alphaFromTo( 4.5f, 0.0f, 0.99f, Easing.Sinusoidal.easeInOut);
	fallingPlayerComponent.FadeAudio (2.0, FadeDir.Out);
	yield WaitForSeconds (1.0);
	yield WaitForSeconds (2.0);
}

function GameComplete() {
	bgSprite.hidden = false;
	bgSprite.alphaFromTo( 1.5f, 0.0f, 0.90f, Easing.Sinusoidal.easeIn);
	fallingPlayerComponent.FadeAudio (1.5, FadeDir.Out);
	yield WaitForSeconds (.5);
    savedTimeScale = Time.timeScale;
//	loadingLabel.hidden = false;
//	loadingLabel.alphaFromTo( 1.0f, 0.0f, 1.0f, Easing.Sinusoidal.easeIn);    
    yield WaitForSeconds (1);
    AudioListener.pause = true;
	FallingPlayer.isTiltable = true;
	Application.LoadLevel(levelToLoad);
	Time.timeScale = savedTimeScale;
}

function GameCompleteUI() {
	bgSprite.hidden = false;
	bgSprite.alphaFromTo( 2f, 0.0f, 0.8f, Easing.Sinusoidal.easeIn);
	// fallingPlayerComponent.FadeAudio (1.5, FadeDir.Out);
	
	// add anything else that requires main uitoolkit instance
}

function OutroDiamondFlash( timer : float ) {
	bgSprite.hidden = false;
	bgSprite.alphaFromTo( timer, 1.0f, 0.2f, Easing.Sinusoidal.easeOut);
	yield WaitForSeconds (timer);
	bgSprite.alphaTo( 1.0f, 0.0f, Easing.Sinusoidal.easeIn);
}

function LoadNewLevelViaMenu() {
	loadLevelOne.hidden = true;
	loadLevelTwo.hidden = true;
	loadLevelThree.hidden = true;
	loadLevelFour.hidden = true;
	BackToPauseMenuButton.hidden = true;
	loadingLabel.hidden = false;
	
	FallingLaunch.levelEndSlowdown = 0;

	Application.LoadLevel(levelToLoad);
	Time.timeScale = savedTimeScale;
}

function LevelSelect() {
	HidePauseMenuElements();
	loadLevelOne.hidden = false;
	loadLevelTwo.hidden = false;
	loadLevelThree.hidden = false;
	loadLevelFour.hidden = false;
	
	BackToHomeMenuButton.hidden = false;
	
	angledTiltLabel.hidden = true;
	flatTiltLabel.hidden = true;

	loadNewLevelButton.hidden = true;	
	ShowBackButton();
}

function HidePauseMenuElements() {
	rightArrow.hidden = true;
	leftArrow.hidden = true;
	pauseButton.hidden = true;
	optionsButton.hidden = true;
	loadNewLevelButton.hidden = true;
	
}

function ShowBackButton() {
	BackToPauseMenuButton.hidden = false;
}

function BackToPauseMenu() {
	//leftArrow.hidden = false;
	rightArrow.hidden = false;
	pauseButton.hidden = false;
	
	loadLevelOne.hidden = true;
	loadLevelTwo.hidden = true;
	loadLevelThree.hidden = true;
	loadLevelFour.hidden = true;
	HideOptions();
	
	ShowOptionsButton();

	//BackToHomeMenuButton.hidden = true;

	if (level2Unlocked) {loadNewLevelButton.hidden = false;}
	BackToPauseMenuButton.hidden = true;
	//DisplayTilt();
}


function ShowOptions() {
	loadNewLevelButton.hidden = true;
	fadeInOptions();
	DisplayTiltChooser();
	HidePauseMenuElements();
	ShowBackButton();
}

function HideOptions() {
	tiltText2.hidden = true;
	invertAxesText1.hidden = true;

	invertAxesText1Yes.hidden = true;
	invertAxesText1No.hidden = true;
	angledTiltLabel.hidden = true;
	flatTiltLabel.hidden = true;

	
}

function ShowOptionsButton () {
	optionsButton.hidden = false;
}

function HideOptionsButton () {
	optionsButton.hidden = true;
}

function fadeInOptions() {
	optionsButton.hidden = true;
	tiltText2.hidden = false;
	invertAxesText1.hidden = false;
	
	if (FallingLaunch.invertAxesVal == -1) {
		invertAxesText1Yes.hidden = false;
	}
	else {
		invertAxesText1No.hidden = false;
	}
	
}

function DisplayTiltChooser () {

		if (PlayerPrefs.GetInt("TiltNeutral", 0) == 1) {
			angledTiltLabel.hidden = false;
		}
		else {
			flatTiltLabel.hidden = false;
		}
}

function SaveAxesPrefs( invert : boolean) {
	if (isSaving == false) {
		isSaving = true;
		if (invert == true) {
			FallingLaunch.invertAxesVal = -1;
			PlayerPrefs.SetInt("invertAxes", 1);
			//Debug.Log("Inverted axes!");
		}
		else {
			FallingLaunch.invertAxesVal = 1;
			PlayerPrefs.SetInt("invertAxes", -1);
			//Debug.Log("Un-inverted axes!");
		}
		isSaving = false;
	}
}

function DoInvertedAxes() {
		SaveAxesPrefs(true);
		invertAxesText1No.hidden = true;
		invertAxesText1Yes.hidden = false;	
}

function UndoInvertedAxes() {
		SaveAxesPrefs(false);
		invertAxesText1No.hidden = false;
		invertAxesText1Yes.hidden = true;
}


function DoNothing () {
	return;
}

function LoadLevel1ViaMenu() {
	loadLevelOne.hidden = true;
	loadLevelTwo.hidden = true;
	loadLevelThree.hidden = true;
	loadLevelFour.hidden = true;
	BackToPauseMenuButton.hidden = true;
	BackToHomeMenuButton.hidden = true;
	loadingLabel.hidden = false;
	
	FallingLaunch.hasSetAccel = false;
	Application.LoadLevel(level1);
	Time.timeScale = savedTimeScale;
}

function LoadLevel2ViaMenu() {
	loadLevelOne.hidden = true;
	loadLevelTwo.hidden = true;
	loadLevelThree.hidden = true;
	loadLevelFour.hidden = true;
	BackToPauseMenuButton.hidden = true;
	BackToHomeMenuButton.hidden = true;
	loadingLabel.hidden = false;	
	
	FallingLaunch.hasSetAccel = false;
	Application.LoadLevel(level2);
	Time.timeScale = savedTimeScale;
}

function LoadLevel3ViaMenu() {
	loadLevelOne.hidden = true;
	loadLevelTwo.hidden = true;
	loadLevelThree.hidden = true;
	loadLevelFour.hidden = true;
	BackToPauseMenuButton.hidden = true;
	BackToHomeMenuButton.hidden = true;
	loadingLabel.hidden = false;
	
	FallingLaunch.hasSetAccel = false;
	Application.LoadLevel(level3);
	Time.timeScale = savedTimeScale;
}

function LoadLevel4ViaMenu() {
	loadLevelOne.hidden = true;
	loadLevelTwo.hidden = true;
	loadLevelThree.hidden = true;
	loadLevelFour.hidden = true;
	BackToPauseMenuButton.hidden = true;
	BackToHomeMenuButton.hidden = true;
	loadingLabel.hidden = false;
	
	FallingLaunch.hasSetAccel = false;
	Application.LoadLevel(level4);
	Time.timeScale = savedTimeScale;
}

function LoadHomeViaMenu() {
	loadLevelOne.hidden = true;
	loadLevelTwo.hidden = true;
	loadLevelThree.hidden = true;
	loadLevelFour.hidden = true;
	BackToPauseMenuButton.hidden = true;
	BackToHomeMenuButton.hidden = true;
	loadingLabel.hidden = false;
	
	HidePauseMenuElements();
	HideOptions();

	loadNewLevelButton.hidden = true;

	angledTiltLabel.hidden = true;
	flatTiltLabel.hidden = true;

	FallingLaunch.hasSetAccel = false;
	Application.LoadLevel(homeLevel);
	Time.timeScale = savedTimeScale;
}


function OpenSite() {
	Application.OpenURL ("http://tysonkubota.net/");
}

function HideGUI() {
		pauseButton.hidden = true;
		circleReticle.hidden = true;
		lifeBar.hidden = true;
		lifeBarOutline.hidden = true;
		lifeBarThreat.hidden = true;
}

function FadeOutGUI() {
	pauseButton.alphaTo( 0.5f, 0.0f, Easing.Quartic.easeIn);
	lifeBar.alphaTo( 0.5f, 0.0f, Easing.Quartic.easeIn);
	lifeBarOutline.alphaTo( 0.5f, 0.0f, Easing.Quartic.easeIn);
	circleReticle.alphaTo( 0.5f, 0.0f, Easing.Quartic.easeIn);
	lifeBarThreat.hidden = true;
	yield WaitForSeconds (1.0);
	
	pauseButton.hidden = true;
	circleReticle.hidden = true;
	lifeBar.hidden = true;
	lifeBarOutline.hidden = true;
}


function UnhideGUI() {
		pauseButton.hidden = false;
		circleReticle.hidden = false;
		lifeBar.hidden = false;
		lifeBarOutline.hidden = false;
		lifeBarThreat.hidden = true;
		
//		lifeBarThreat.alphaFrom( 1.0f, 0.0f, Easing.Quartic.easeIn);
		pauseButton.alphaFromTo( 1.0f, 0.0f, 1.0f, Easing.Quartic.easeIn);
		lifeBar.alphaFromTo( 1.0f, 0.0f, 0.5f, Easing.Quartic.easeIn);
		lifeBarOutline.alphaFromTo( 1.0f, 0.0f, 1.0f, Easing.Quartic.easeIn);
		circleReticle.alphaFromTo( 1.0f, 0.0f, 1.0f, Easing.Quartic.easeIn);
		yield WaitForSeconds (1.0);
		FallingPlayer.isPausable = true;
//		lifeBarThreat.hidden = false;
}

function fadeIn( shouldUnhideGUI : boolean ) {
		fadeSprite.hidden = false;
		fadeSprite.alphaTo( 1.0f, 0.0f, Easing.Sinusoidal.easeOut);
		yield WaitForSeconds(.5);
		if (shouldUnhideGUI == true) {UnhideGUI();}
		yield WaitForSeconds(.5);
		fadeSprite.hidden = true;
}

function fadeOut() {
		fadeSprite.hidden = false;
		fadeSprite.alphaTo( 1.0f, 1.0f, Easing.Sinusoidal.easeOut);
		yield WaitForSeconds(1);
		fadeSprite.hidden = true;
}


function OnApplicationPause(pauseStatus: boolean) {
    if (pauseStatus && Time.timeScale != 0 && FallingPlayer.isPausable == true) {setSavedTimeScale(); PauseGameNow();}
}

function setSavedTimeScale() {
	savedTimeScale = Time.timeScale;
}
	
function PauseGameNow() {		
	circleReticle.hidden = true;
	lifeBar.hidden = true;
	lifeBarOutline.hidden = true;
	lifeBarThreat.hidden = true;
	
    origPauseButtonArea = MoveController.pauseButtonArea;
    MoveController.pauseButtonArea = Rect(0, 0, Screen.width, Screen.height);
    
//	savedTimeScale = Time.timeScale;
    Time.timeScale = 0;
    AudioListener.volume = 0;
    AudioListener.pause = true;

	rightArrow.hidden = false;
	//leftArrow.hidden = false;
	if (level2Unlocked) {loadNewLevelButton.hidden = false;}
	bgSprite.hidden = false;
	optionsButton.hidden = false;
	//DisplayTiltOnPause();
}

function PauseGameBackgroundCheck() {
	if (FallingPlayer.isPausable == true) {
		if (Time.timeScale == 0) {
			UnPauseGame(true);
		}
		else {
			PauseGameNow();
		}
	}
}

function setHoldingPauseButtonTrue() {
	holdingPauseButton = true;
}

function setHoldingPauseButtonFalse() {
	holdingPauseButton = false;
}

function ToggleTiltNeutral () {
	if (TogglingTiltNeutral == false) {
		
		TogglingTiltNeutral = true;
		
		if (PlayerPrefs.GetInt("TiltNeutral", 0) == 1) {
			fallingLaunchComponent.ChangeTilt(true);
			flatTiltLabel.hidden = false;
			angledTiltLabel.hidden = true;
		}
		else {
			fallingLaunchComponent.ChangeTilt(false);
			angledTiltLabel.hidden = false;
			flatTiltLabel.hidden = true;
		}

		TogglingTiltNeutral = false;

	}
}

function DisplayTilt () {
	if (PlayerPrefs.GetInt("TiltNeutral", 0) == 1) {
		flatTiltLabel.hidden = true;
		angledTiltLabel.hidden = false;
	}
	else {
		flatTiltLabel.hidden = false;
		angledTiltLabel.hidden = true;
	}
}

function DisplayTiltOnPause () {

		if (PlayerPrefs.GetInt("TiltNeutral", 0) == 1) {
			angledTiltLabel.hidden = false;
		}
		else {
			flatTiltLabel.hidden = false;
		}
}