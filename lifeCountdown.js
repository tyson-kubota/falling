var script : ScoreController;

var LifeFlashTexture : GameObject;
static var LifeFlashTextureScript : GUITextureLaunch;
LifeFlashTextureScript = LifeFlashTexture.GetComponent("GUITextureLaunch");

var lifeFlashUIVR : GameObject;
var lifeFlashUIRenderer : Renderer;
var lifeFlashUIMatl : Material;
var peakLifeFlashValueVR : float = 0.33;

static var inOutro : boolean = false;

static var isAlive : int = 0;
var UIscriptName : GameObject;

private var maxSlowdownThreshold : float;

function Awake () {
   	script = GetComponent("ScoreController");
}

function Start () {
	if (FallingLaunch.isVRMode) {
		lifeFlashUIRenderer = lifeFlashUIVR.GetComponent.<Renderer>();
        lifeFlashUIMatl = lifeFlashUIRenderer.material;
        lifeFlashUIMatl.color.a = 0;
	}

	maxSlowdownThreshold = MoveController.maxSlowdown - 1;
   	isAlive = 1;
   	Loop ();
   	Loop2 ();
   	ScoreLerpLoop ();
}
	   	
function Loop () {
    while (true && inOutro == false) {
        yield TickingAway(.25);
//        Debug.Log("Your visible score is + " + script.visibleScore);
//        Debug.Log("Your current score is + " + script.currentScore);
    }
}

function Loop2 () {
    while (true && inOutro == false) {
		yield LifeFlashCheck(.2, 5);
    }
}

function ScoreLerpLoop () {
    while (true && inOutro == false) {
		script.ScoreUpdate(.25);
		yield WaitForSeconds(.25);
	}
}

function FadeFlashVR (timer : float, fadeType : FadeDir) {

    var start = fadeType == FadeDir.In? 0.0 : peakLifeFlashValueVR;
    var end = fadeType == FadeDir.In? peakLifeFlashValueVR : 0.0;
    var i = 0.0;
    var step = 1.0/timer;

    while (i <= 1.0) {
        i += step * Time.deltaTime;
        lifeFlashUIMatl.color.a = Mathf.Lerp(start, end, i);
        yield;
    }
}

function TickingAway (delay : float) {
	if (script.currentScore > 0) {
		if (MoveController.Slowdown > maxSlowdownThreshold) {
			script.DecrementScore(delay);
	   		yield WaitForSeconds((delay/4));
		}
		
		else if (MoveController.Slowdown < MoveController.maxSlowdown) {
			script.DecrementScore(delay);
	   		yield WaitForSeconds(delay);
	   	}
	} else {
		   	isAlive = 0;
		   	FallingPlayer.isPausable = false;

		   	if (FallingLaunch.isVRMode) {
		   		FadeFlashVR (1, FadeDir.Out);
		   	} else {
		   		LifeFlashTextureScript.FadeFlash (1, FadeDir.Out);
		   	}
		   	
		   	FallingLaunch.secondsAlive = (Time.time - FallingPlayer.lifeStartTime);

		   	//Debug.Log("You died!");

		   	GameAnalyticsSDK.GameAnalytics.NewDesignEvent (
		   		"Death:Drained:" + Application.loadedLevelName + ":" + FallingLaunch.thisLevelArea, 
		   		FallingLaunch.secondsAlive
	   		);

		   	yield GetComponent(FallingPlayer).DeathRespawn ();
			GetComponent(FallingPlayer).ShowDeathHelp();

			// New GameAnalytics "Design" event syntax: 
			// GameAnalytics.NewDesignEvent (string eventName, float eventValue);

			// Original GameAnalytics syntax: GA.API.Design.NewEvent(String eventName, float eventValue, Vector3 trackPosition); 

		}
}


function LifeFlashCheck (delay : float, score : int) {

	if (script.currentScore < score && inOutro == false) {
	    //Camera.main.SendMessage("lifeFlashOut");
	   	if (FallingLaunch.isVRMode) {
	   		FadeFlashVR(delay, FadeDir.In);
	   	} else {
			LifeFlashTextureScript.FadeFlash (delay, FadeDir.In);
		}
		yield WaitForSeconds(delay);
//		Camera.main.SendMessage("lifeFlashUp");
		if (FallingLaunch.isVRMode) {
	   		FadeFlashVR(delay, FadeDir.Out);
	   	} else {
			LifeFlashTextureScript.FadeFlash (delay, FadeDir.Out);
		}
		yield WaitForSeconds((delay*3)); // stagger the flash timing (compare w/ `delay` above)
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
