private var script : ScoreController;

var LifeFlashTexture : GameObject;
static var LifeFlashTextureScript : GUITextureLaunch;
LifeFlashTextureScript = LifeFlashTexture.GetComponent("GUITextureLaunch");

var lifeFlashUIVR : GameObject;
private var lifeFlashUIRenderer : Renderer;
private var lifeFlashUIMatl : Material;
private var peakLifeFlashValueVR : float = 0.7;
var lifeFlashAudioObj : GameObject;
private var lifeFlashAudio : AudioSource;

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

    lifeFlashAudio = lifeFlashAudioObj.GetComponent.<AudioSource>();

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
		yield LifeFlashCheck(.2, ScoreController.maxScore/4.0);
    }
}

function ScoreLerpLoop () {
    while (true && inOutro == false) {
		script.ScoreUpdate(.25);
		yield WaitForSeconds(.25);
	}
}

function FadeFlashVR (timer : float, fadeType : FadeDir) {

    var start = fadeType == FadeDir.In ? 0.0 : peakLifeFlashValueVR;
    var end = fadeType == FadeDir.In ? peakLifeFlashValueVR : 0.0;
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

            // In VR mode, DeathRespawn is now decoupled from the actual respawning time: 
            // e.g. the player has a several-second time interval to decide whether 
            // to exit or respawn. If they take more time than showIconVR's timer,
            // the tutorial UI hint will already be transparent by the time they respawn. 
            // That's probably not a huge deal since it's non-critical UI, just a help hint.
            // TODO: Pass optional args to DeathRespawn in VR mode, so we can show specific UI 
            // after user-initiated respawn or via a callback.
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

        var lowLifeRatio = ScoreController.currentScore / score;

        if (lifeFlashAudio) {
            // if speeding up, use a louder ping volume for audibility, plus a shorter
            // yield wait since the health drain is 4x higher:
            if (MoveController.Slowdown > maxSlowdownThreshold) {
               lifeFlashAudio.volume = 0.9;
            } else {
                var deathPromixityScore = 1.0 - lowLifeRatio;
                // Clamp to a min volume of 0.2, max volume of .9;
                lifeFlashAudio.volume = Mathf.Clamp(deathPromixityScore, 0.2, 0.9);
            }
        }

	   	if (FallingLaunch.isVRMode) {
	   		FadeFlashVR(delay, FadeDir.In);
            if (lifeFlashAudio) {lifeFlashAudio.Play();}
	   		yield WaitForSeconds(delay);
	   		FadeFlashVR(delay, FadeDir.Out);
	   	} else {
			LifeFlashTextureScript.FadeFlash(delay, FadeDir.In);
            if (lifeFlashAudio) {lifeFlashAudio.Play();}
			yield WaitForSeconds(delay);
			LifeFlashTextureScript.FadeFlash(delay, FadeDir.Out);
		}

        // increase the flash frequency as death draws near (compare w/ `delay` above):
        if (MoveController.Slowdown > maxSlowdownThreshold) {
            // 4x delay when speeding up due to increased health drain:
            yield WaitForSeconds( Mathf.Max(delay*lowLifeRatio*2.0, delay) );
        } else {
            yield WaitForSeconds( Mathf.Max(delay*lowLifeRatio*8.0, delay*4.0) );
        }
	} else {
        return;
    }
}
