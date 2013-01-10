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

var buttonScaleFactor : float;
var scriptName : GameObject;
var initialRespawn : Respawn;

var levelToLoad : String = "";


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
    bgSprite = UI.firstToolkit.addSprite( "menuBackground.png", 0, 0, 1 );
	bgSprite.positionCenter();
	bgSprite.scaleTo( 0.01f, new Vector3( (Screen.width * 6), (Screen.height * 6), 1 ), Easing.Sinusoidal.easeOut);
	bgSprite.alphaTo( 0.01f, 0.0f, Easing.Sinusoidal.easeOut);

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
	
	circleReticle = UIButton.create("circle-reticle.png","circle-reticle.png", 0, 0);
	circleReticle.positionCenter();
	
	lifeBarOutline = UIProgressBar.create( "lifeBarOutline.png", 0, 0 );
	lifeBarOutline.pixelsFromTopLeft ( 8, 8 );
	lifeBarOutline.value = 1f;
	lifeBarOutline.resizeTextureOnChange = false;
				
	lifeBar = UIProgressBar.create( "lifeBarRed.png", 0, 0 );
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
//  Camera.main.SendMessage("fadeOutHalf");
//  yield WaitForSeconds(1);
	rightArrow = UIButton.create("rightArrow.png","rightArrowDown.png", 0, 0);
	rightArrow.positionFromTopRight(buttonScaleFactor,0.2f);
	rightArrow.onTouchUpInside += PauseGameCheck;
	
	leftArrow = UIButton.create("restart.png","restartDown.png", 0, 0);
	leftArrow.positionFromTopLeft(buttonScaleFactor,0.2f);
	leftArrow.onTouchUpInside += RestartLevel;
//	Debug.Log(buttonScaleFactor);

	loadNewLevelButton = UIButton.create("newlevel.png","newlevel.png", 40, 40);
	loadNewLevelButton.positionFromBottomLeft(.05f, .05f);
	loadNewLevelButton.normalTouchOffsets = new UIEdgeOffsets( 30 );
	loadNewLevelButton.highlightedTouchOffsets = new UIEdgeOffsets( 30 );
	loadNewLevelButton.onTouchUpInside += LoadNewLevel;


	leftArrow.alphaFromTo( .01f, 1.0f, 0.0f, Easing.Sinusoidal.easeOut);
	rightArrow.alphaFromTo( .01f, 1.0f, 0.0f, Easing.Sinusoidal.easeOut);
	loadNewLevelButton.alphaFromTo( .01f, 1.0f, 0.0f, Easing.Sinusoidal.easeOut);    	
		
	bgSprite.alphaFromTo( 0.01f, 0.0f, 1.0f, Easing.Sinusoidal.easeOut);
	circleReticle.alphaFromTo( 0.01f, 1.0f, 0.0f, Easing.Sinusoidal.easeOut);
	lifeBar.alphaFromTo( 0.01f, 1.0f, 0.0f, Easing.Sinusoidal.easeOut);
	lifeBarOutline.alphaFromTo( .01f, 1.0f, 0.0f, Easing.Sinusoidal.easeOut);
	leftArrow.alphaFromTo( 0.01f, 0.0f, 1.0f, Easing.Sinusoidal.easeOut);
	rightArrow.alphaFromTo( 0.01f, 0.0f, 1.0f, Easing.Sinusoidal.easeOut);    
	loadNewLevelButton.alphaFromTo( 0.01f, 0.0f, 1.0f, Easing.Sinusoidal.easeOut);    	
    	savedTimeScale = Time.timeScale;
	scriptName.GetComponent(FallingPlayer).FadeAudio (.09, FadeDir.Out);
    yield WaitForSeconds (.1);
    Time.timeScale = 0;
    AudioListener.pause = true;
}

function UnPauseGame(resume : boolean) {
	FallingPlayer.isPausable = false;
    Time.timeScale = savedTimeScale;
    AudioListener.pause = false;
	scriptName.GetComponent(FallingPlayer).FadeAudio (1.0, FadeDir.In);
	bgSprite.alphaFromTo( 0.1f, 1.0f, 0.0f, Easing.Sinusoidal.easeOut);    
	circleReticle.alphaFromTo( 0.01f, 0.0f, 1.0f, Easing.Sinusoidal.easeOut);
	lifeBar.alphaFromTo( 0.01f, 0.0f, 1.0f, Easing.Sinusoidal.easeOut);
	lifeBarOutline.alphaFromTo( .01f, 0.0f, 1.0f, Easing.Sinusoidal.easeOut);
	leftArrow.alphaFromTo( 0.01f, 1.0f, 0.0f, Easing.Sinusoidal.easeOut);
	rightArrow.alphaFromTo( 0.01f, 1.0f, 0.0f, Easing.Sinusoidal.easeOut);  
	loadNewLevelButton.alphaFromTo( 0.01f, 1.0f, 0.0f, Easing.Sinusoidal.easeOut);    	
	UI.firstToolkit.removeElement(rightArrow);
	UI.firstToolkit.removeElement(leftArrow);
	UI.firstToolkit.removeElement(loadNewLevelButton);
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
	bgSprite.alphaFromTo( 1.0f, 0.0f, 1.0f, Easing.Sinusoidal.easeOut);
//	yield WaitForSeconds (.5);
// fade in congrats menu / buttons here 

    savedTimeScale = Time.timeScale;
    scriptName.GetComponent(FallingPlayer).FadeAudio (.8, FadeDir.Out);
    scriptName.rigidbody.isKinematic = true;
    yield WaitForSeconds (1);
//    Time.timeScale = 0;
    AudioListener.pause = true;	
    LoadNewLevel();
}

function LoadNewLevel() {
    //yield WaitForSeconds (.01);	
	UI.firstToolkit.removeElement(rightArrow);
	UI.firstToolkit.removeElement(leftArrow);
	UI.firstToolkit.removeElement(loadNewLevelButton);	

	loadNewLevelButton = UIButton.create("loading.png","loading.png", 20, 20);
	loadNewLevelButton.positionFromCenter(0f, 0f);
	
	Application.LoadLevel(levelToLoad);
	Time.timeScale = savedTimeScale;
//    AudioListener.pause = false;
}