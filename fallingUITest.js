#pragma strict

var player : GameObject;
var value : float = 0.5f;
var bgSprite : UISprite;
var pauseButton : UIButton;
var circleReticle: UIButton;
var lifeBarOutline : UIProgressBar;
var lifeBar : UIProgressBar;
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

var buttonScaleFactor : float;
var scriptName : GameObject;
var initialRespawn : Respawn;

var levelToLoad : String = "";

var level1 : String = "Falling-scene-tutorial";
var level2 : String = "Falling-scene2";
var level3 : String = "Falling-scene1-scale";
var level4 : String = "Falling-scene3";

private var savedTimeScale:float;
//var x:float;
//var y:float;
// private var lifeBar = UIProgressBar.create( "lifeBarRedTest.png", 0, 0 );

function Start () {
//  yield WaitForSeconds(0.5f);

//	  Testing to see if disabling this hard coded screen.orientation will allow auto detection of landscape 
//	  right or left mode on startup.
//    Screen.orientation = ScreenOrientation.LandscapeLeft;

//    if (iPhoneInput.orientation == iPhoneOrientation.LandscapeRight) {
//	Screen.orientation = ScreenOrientation.LandscapeRight;}
//	else {Screen.orientation = ScreenOrientation.LandscapeLeft;}
    bgSprite = UI.firstToolkit.addSprite( "menuBackground.png", 0, 0, 2 );
	bgSprite.positionCenter();
	bgSprite.scaleTo( 0.01f, new Vector3( (Screen.width * 6), (Screen.height * 6), 1 ), Easing.Linear.easeIn);
	bgSprite.alphaTo( 0.01f, 0.9f, Easing.Sinusoidal.easeOut);
	bgSprite.hidden = true;
	
	pauseButton = UIButton.create("pauseWhite.png","pauseGray.png", 0, 0);
	pauseButton.pixelsFromTopRight( 5, 5 );
	pauseButton.highlightedTouchOffsets = new UIEdgeOffsets(30);
	pauseButton.onTouchUpInside += PauseGameCheck;

//	var resumeButton = UIButton.create("pauseGray.png","pauseWhite.png", 0, 0 );
//	resumeButton.pixelsFromBottomRight( 10, 10 );
//    savedTimeScale = Time.timeScale;
//	pauseButton.highlightedTouchOffsets = new UIEdgeOffsets(20);
//	resumeButton.onTouchUpInside += UnPauseGame;
	if (UI.isHD == true) {
	buttonScaleFactor = (((Screen.height / 2.0) - 100.0) / Screen.height);
	}
	else {
	buttonScaleFactor = (((Screen.height / 2.0) - 50.0) / Screen.height);
	}

	rightArrow = UIButton.create("rightArrow.png","rightArrowDown.png", 0, 0);
	rightArrow.positionFromTopRight(buttonScaleFactor,0.2f);
	rightArrow.onTouchUpInside += PauseGameCheck;
	
	leftArrow = UIButton.create("restart.png","restartDown.png", 0, 0);
	leftArrow.positionFromTopLeft(buttonScaleFactor,0.2f);
	leftArrow.onTouchUpInside += RestartLevel;

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
	loadLevelOne.onTouchUpInside += LoadLevel1ViaMenu;
	
	if (level2 == Application.loadedLevelName) {
	loadLevelTwo = UIButton.create("level1Down.png","level1.png", 0, 0);}
	else {				
	loadLevelTwo = UIButton.create("level1.png","level1Down.png", 0, 0);}
	loadLevelTwo.positionFromTopLeft(buttonScaleFactor,0.3f);
	loadLevelTwo.onTouchUpInside += LoadLevel2ViaMenu;
	
	if (level3 == Application.loadedLevelName) {
	loadLevelThree = UIButton.create("level1Down.png","level1.png", 0, 0);}
	else {				
	loadLevelThree = UIButton.create("level1.png","level1Down.png", 0, 0);}
	loadLevelThree.positionFromTopRight(buttonScaleFactor,0.3f);
	loadLevelThree.onTouchUpInside += LoadLevel3ViaMenu;
	
	if (level4 == Application.loadedLevelName) {
	loadLevelFour = UIButton.create("level1Down.png","level1.png", 0, 0);}
	else {				
	loadLevelFour = UIButton.create("level1.png","level1Down.png", 0, 0);}
	loadLevelFour.positionFromTopRight(buttonScaleFactor,0.05f);
	loadLevelFour.onTouchUpInside += LoadLevel4ViaMenu;		
	
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
	
	circleReticle = UIButton.create("circle-reticle.png","circle-reticle.png", 0, 0);
	circleReticle.positionCenter();
	
	lifeBarOutline = UIProgressBar.create( "lifeBarOutline.png", 0, 0 );
	lifeBarOutline.pixelsFromTopLeft ( 8, 8 );
	lifeBarOutline.value = 1f;
	lifeBarOutline.resizeTextureOnChange = false;
				
	lifeBar = UIProgressBar.create( "lifeBarWhite.png", 0, 0 );
	lifeBar.pixelsFromTopLeft ( 10, 10 );
	lifeBar.resizeTextureOnChange = true;
	lifeBar.value = 0.67f;	
	animateProgressBar (lifeBar);
//	Loop ();

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

function PauseGame() {
	if (FallingPlayer.isPausable == true) {
		FallingPlayer.isPausable = false;
		rightArrow.hidden = false;
		leftArrow.hidden = false;
		loadNewLevelButton.hidden = false;
		bgSprite.hidden = false;
		openSiteButton.hidden = false;
		
		circleReticle.hidden = true;
		lifeBar.hidden = true;
		lifeBarOutline.hidden = true;
	    
	    savedTimeScale = Time.timeScale;
		scriptName.GetComponent(FallingPlayer).FadeAudio (.09, FadeDir.Out);
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
	scriptName.GetComponent(FallingPlayer).FadeAudio (1.0, FadeDir.In);
	circleReticle.hidden = false;
	lifeBar.hidden = false;
	lifeBarOutline.hidden = false;
	
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

function RestartLevel() {
	FallingPlayer.isPausable = false;	
	Camera.main.SendMessage("fadeOut");
	Respawn.currentRespawn = initialRespawn;
	scriptName.GetComponent(FallingPlayer).DeathRespawn ();
	UnPauseGame(false);
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
	loadingLabel.hidden = false;
	loadingLabel.alphaFromTo( 1.0f, 0.0f, 1.0f, Easing.Sinusoidal.easeOut);    
    yield WaitForSeconds (1);
//    Time.timeScale = 0;
	scriptName.rigidbody.isKinematic = true;
    AudioListener.pause = true;	
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

function LoadLevel1ViaMenu() {
	loadLevelOne.hidden = true;
	loadLevelTwo.hidden = true;
	loadLevelThree.hidden = true;
	loadLevelFour.hidden = true;
	BackToPauseMenuButton.hidden = true;
	loadingLabel.hidden = false;
	
	Application.LoadLevel(level1);
	Time.timeScale = savedTimeScale;
}

function LoadLevel2ViaMenu() {
	loadLevelOne.hidden = true;
	loadLevelTwo.hidden = true;
	loadLevelThree.hidden = true;
	loadLevelFour.hidden = true;
	BackToPauseMenuButton.hidden = true;
	loadingLabel.hidden = false;	
	
	Application.LoadLevel(level2);
	Time.timeScale = savedTimeScale;
}

function LoadLevel3ViaMenu() {
	loadLevelOne.hidden = true;
	loadLevelTwo.hidden = true;
	loadLevelThree.hidden = true;
	loadLevelFour.hidden = true;
	BackToPauseMenuButton.hidden = true;
	loadingLabel.hidden = false;
	
	Application.LoadLevel(level3);
	Time.timeScale = savedTimeScale;
}

function LoadLevel4ViaMenu() {
	loadLevelOne.hidden = true;
	loadLevelTwo.hidden = true;
	loadLevelThree.hidden = true;
	loadLevelFour.hidden = true;
	BackToPauseMenuButton.hidden = true;
	loadingLabel.hidden = false;
	
	Application.LoadLevel(level4);
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
}

function UnhideGUI() {
		pauseButton.hidden = false;
		circleReticle.hidden = false;
		lifeBar.hidden = false;
		lifeBarOutline.hidden = false;
		
		pauseButton.alphaFromTo( 1.0f, 0.0f, 1.0f, Easing.Quartic.easeIn);
		lifeBar.alphaFromTo( 1.0f, 0.0f, 1.0f, Easing.Quartic.easeIn);
		lifeBarOutline.alphaFromTo( 1.0f, 0.0f, 1.0f, Easing.Quartic.easeIn);
		circleReticle.alphaFromTo( 1.0f, 0.0f, 1.0f, Easing.Linear.easeIn);
}