private var script : ScoreController;

var LifeFlashTexture : GameObject;
static var LifeFlashTextureScript : GUITextureLaunch;
LifeFlashTextureScript = LifeFlashTexture.GetComponent("GUITextureLaunch");

var lifeFlashUIVR : GameObject;
private var lifeFlashUIRenderer : Renderer;
private var lifeFlashUIMatl : Material;
private var peakLifeFlashValueVR : float = 0.7;

var fallingIntroUIComponent : fallingIntroUI;

static var inOutro : boolean = false;

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
        var t : float = i*i * (3f - 2f*i); // smoothstep lerp
        lifeFlashUIMatl.color.a = Mathf.Lerp(start, end, t);
        yield;
    }
}

function TickingAway (delay : float) {
	// Early return if player's not alive, so we stop flashing red:
	if (FallingPlayer.isAlive == 0) {
		return;
	}

	// The visibleScore check is to ensure that the onscreen health UI
	// is actually empty before the player dies; if we used currentScore directly,
	// the UI health bar's lerp would lag behind the actual value, so the player would
	// appear to die too soon in some cases.
	if (ScoreController.currentScore > 0 || ScoreController.visibleScore > 0) {
		
		if (MoveController.Slowdown > maxSlowdownThreshold) {
			script.DecrementScore(delay);
	   		yield WaitForSeconds((delay/4)); // 4x health penalty during player speedup
		} else if (MoveController.Slowdown < MoveController.maxSlowdown) {
			script.DecrementScore(delay);
	   		yield WaitForSeconds(delay);
	   	}
	} else {
		   	FallingPlayer.isAlive = 0;
		   	FallingPlayer.isPausable = false;

		   	if (FallingLaunch.isVRMode) {
		   		FadeFlashVR(1, FadeDir.Out);
		   	} else {
		   		LifeFlashTextureScript.FadeFlash(1, FadeDir.Out);
		   	}

		   	FallingLaunch.secondsAlive = (Time.time - FallingPlayer.lifeStartTime);

		   	//Debug.Log("You died!");

		   	FallingLaunch.Analytics.Event(
		   		"Death:Drained:" + FallingLaunch.vrModeAnalyticsString + Application.loadedLevelName + ":" + FallingLaunch.thisLevelArea,
		   		FallingLaunch.secondsAlive
	   		);

		   	yield GetComponent(FallingPlayer).DeathRespawn();

		   	if (!FallingLaunch.isVRMode) {
				GetComponent(FallingPlayer).ShowDeathHelp();
			} else if (fallingIntroUIComponent) {
				// fallingIntroUIComponent only exists on intro level:
				// 'tutorial-vr-intro-2' is the name of the 'gather orbs to survive' icon
				fallingIntroUIComponent.ShowIconVR('tutorial-vr-intro-2', 8);
			}

			// New GameAnalytics "Design" event syntax:
			// GameAnalytics.NewDesignEvent (string eventName, float eventValue);

			// Original GameAnalytics syntax: GA.API.Design.NewEvent(String eventName, float eventValue, Vector3 trackPosition);

		}
}


function LifeFlashCheck (delay : float, score : int) {
	// Early return if player's not alive, so we stop flashing red:
	if (!FallingPlayer.isAlive) {
		return;
	}

	if (ScoreController.currentScore < score && inOutro == false) {

	   	if (FallingLaunch.isVRMode) {
	   		FadeFlashVR(delay, FadeDir.In);
	   		yield WaitForSeconds(delay);
	   		FadeFlashVR(delay, FadeDir.Out);
	   	} else {
			LifeFlashTextureScript.FadeFlash(delay, FadeDir.In);
			yield WaitForSeconds(delay);
			LifeFlashTextureScript.FadeFlash(delay, FadeDir.Out);
		}

		yield WaitForSeconds(delay*3); // stagger the flash timing (compare w/ `delay` above)
	}
}