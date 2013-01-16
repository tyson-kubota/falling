var script : ScoreController;
script = GetComponent("ScoreController");

var LifeFlashTexture : GameObject;
static var LifeFlashTextureScript : GUITextureLaunch;
LifeFlashTextureScript = LifeFlashTexture.GetComponent("GUITextureLaunch");

static var isAlive : int = 0;

function Start () {
	   	isAlive = 1;
	   	Loop ();
	   	Loop2 ();
}
	   	
function Loop () {
    while (true) {
        yield TickingAway(.1);
//        Debug.Log(script.currentScore);
    }
}

function Loop2 () {
    while (true) {
		yield LifeFlashCheck(.2, 5);
    }
}
	   
	   	
function TickingAway (delay : float) {
		if ((script.currentScore > 0) && (controllerITween2.Slowdown < 18000)) {
	   		gameObject.SendMessage ("DecrementScore", delay);
	   		yield WaitForSeconds(delay);
	   	}
	   	
		else if ((script.currentScore > 0) && (controllerITween2.Slowdown > 17999)) {
			gameObject.SendMessage ("DecrementScoreNow", delay);
	   		yield WaitForSeconds((delay/4));
		}
		
	   	else {isAlive = 0;
	   	FallingPlayer.isPausable = false;
	   	LifeFlashTextureScript.FadeFlash (1, FadeDir.Out);
	   	GetComponent(FallingPlayer).DeathRespawn ();}
}


function LifeFlashCheck (delay : float, score : int) {

	if (script.currentScore < score) {
	    //Camera.main.SendMessage("lifeFlashOut");
		LifeFlashTextureScript.FadeFlash (delay, FadeDir.In);
		yield WaitForSeconds(delay);
//		Camera.main.SendMessage("lifeFlashUp");
		LifeFlashTextureScript.FadeFlash (delay, FadeDir.Out);
		yield WaitForSeconds((delay*3));		
	}
}

// not being used currently, due to more versatile LifeFlashCheck in a separate coroutine.
function LifeFlash (delay : float, score : int) {

	if (script.currentScore < score) {
	    Camera.main.SendMessage("lifeFlashOut");
		yield WaitForSeconds(delay);
		Camera.main.SendMessage("lifeFlashUp");
	}
}
