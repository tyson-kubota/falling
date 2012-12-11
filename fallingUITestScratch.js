#pragma strict

var player : GameObject;
//var scoreController : ScoreController = player.GetComponent("ScoreController");

//var script : ScoreController = player.GetComponent("ScoreController");
// Keep track of the players main score

//var uiScore = ScoreController.currentScore;
var value : float = 0.5f;


// var lifeCountdown : lifeCountdown;
// lifeCountdown = GetComponent("lifeCountdown");

private var savedTimeScale:float;
//var x:float;
//var y:float;
// private var lifeBar = UIProgressBar.create( "lifeBarRedTest.png", 0, 0 );

function Start () {
//  yield WaitForSeconds(0.5f);
    Screen.orientation = ScreenOrientation.LandscapeLeft;
    
	var pauseButton = UIButton.create("pauseWhite.png","pauseGray.png", 0, 0);
	pauseButton.pixelsFromTopRight( 10, 10 );
	pauseButton.highlightedTouchOffsets = new UIEdgeOffsets(20);
	pauseButton.onTouchUpInside += PauseGame;

	var resumeButton = UIButton.create("pauseGray.png","pauseWhite.png", 0, 0 );
	resumeButton.pixelsFromBottomRight( 10, 10 );
    savedTimeScale = Time.timeScale;
	pauseButton.highlightedTouchOffsets = new UIEdgeOffsets(20);
	resumeButton.onTouchUpInside += UnPauseGame;
	
	var lifeBar = UIProgressBar.create( "lifeBarRedTest.png", 0, 0 );
	lifeBar.pixelsFromTopLeft ( 10, 10);
	lifeBar.resizeTextureOnChange = true;
	lifeBar.value = 0.5f;	
	animateProgressBar (lifeBar);
//	Loop ();
	}

function animateProgressBar(lifeBar : UIProgressBar) {
//	var value : float = 1.0f;
//	var value : float = (ScoreController.startingScore / 10);

//	var value : float = parseFloat(ScoreController.currentScore);
	while (true)
	{
//	value -= (parseFloat(ScoreController.startingScore - ScoreController.currentScore)/10);
//	value -= 0.01f;
//	lifeBar.value = value;
	lifeBar.value = (parseFloat(ScoreController.visibleScore)/parseFloat(ScoreController.maxScore));
//Debug.Log(lifeBar.value + " is lifebar value");
//Debug.Log(ScoreController.currentScore + " is currentScore");
//	yield WaitForSeconds (1);

//if (!lifeCountdown.isAlive) {
//yield WaitForSeconds (3);
//}

//	lifeBar.value = parseFloat(ScoreController.currentScore);
	yield 0;
	}
}


//function Loop () {
//    while (true) {
//        yield UpdateLife(1.0);
//    }
//}

//function UpdateLife (delay : float) {
//		if (script.visibleScore > 0) {
//	   		var value : float = parseFloat(visibleScore);
// this breaks it			lifeBar.resizeTextureOnChange = !progressBar.resizeTextureOnChange;
//			yield WaitForSeconds(delay);
//	   	}
//	   	else {lifeCountdown.isAlive = false;
//	   	}
//}


function animateProgressBarRising(lifeBar : UIProgressBar) {
	var value : float = 0.0f;
//	var value : float = parseFloat(ScoreController.currentScore);
//	Debug.Log(visibleScore);
	while (true)
	{
if (lifeBar.value > 1.0f) {
	lifeBar.resizeTextureOnChange = !lifeBar.resizeTextureOnChange;
	value = 0.0f;
}				
else
{	value += 0.01f;
}
	lifeBar.value = value;
	yield 0;
	}
}



function PauseGame() {
//        Camera.main.SendMessage("fadeOutHalf");
//        yield WaitForSeconds(1);
    savedTimeScale = Time.timeScale;
    Time.timeScale = 0;
    AudioListener.pause = true;
}

function UnPauseGame() {
    Time.timeScale = savedTimeScale;
    AudioListener.pause = false;
    }
    
function IsGamePaused() {
    return Time.timeScale==0;
}
