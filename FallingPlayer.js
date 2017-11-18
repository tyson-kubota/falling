#pragma strict

private var fallingLaunch : GameObject;
private var fallingLaunchComponent : FallingLaunch;

// 10/25/2017: `Color` uses a 0-1 float range, not 0-2, in Unity.
// 2 = 255 for rgba in this color array
// static var startingFogColor : Color = Color(1.17, 1.17, 1.17, 2);
static var startingFogEndDistance : int = 1500;
static var startingFogStartDistance : int = 150;
static var startingCloudsAlpha : float = .25f; // Unity 4 used .39f (99 in RGBA)

//original for corroded sky tubes level
//static var startingFogEndDistance : int = 2500;
//static var startingCameraFarClipPlane : int = 2700;

var changeBackdrop : changeBackdrop;
changeBackdrop = GetComponent("changeBackdrop");
var levelChangeBackdrop : boolean = false;

var ScoreFlashTexture : GameObject;

static var ScoreFlashTextureScript : GUITextureLaunch;
ScoreFlashTextureScript = ScoreFlashTexture.GetComponent("GUITextureLaunch");

var lifeCountdownScript : lifeCountdown;

public var force:float = 1.0;
var dir : Vector3 = Vector3.zero;

enum FadeDir {In, Out}
var fadeTime : float = 0.75;

var origMat : Material;
//var thisOceanCamera : Component;

// Move object using accelerometer
var speed = 5.0;
var target : Transform;
var smooth = 2.0;
var tiltAngle = 30.0;

var tiltAroundZ : float;
var tiltAroundX : float;
//var flipMultiplier : int = 1;
//var flipMultiplier = FallingLaunch.flipMultiplier;

var script : ScoreController;
script = GetComponent("ScoreController");

static var isAlive : int = 1;

static var lifeStartTime : float = 0;
static var levelStartTime : float = 0;

static var isTiltable : boolean = true;

static var isPausable : boolean = false;
private var isExitableFromVR : boolean = true;
var isExitingLevel : boolean = false;

var UIscriptName : GameObject;
static var UIscriptComponent : fallingUITest;

var deathFadeUIVR : GameObject;
private var deathFadeUIVRRenderer : Renderer;
private var deathFadeUIVRMatl : Material;

var opaqueDeathFadeUIVR : GameObject;
private var opaqueDeathFadeUIVRRenderer : Renderer;
private var opaqueDeathFadeUIVRMatl : Material;

var levelStartUIVR : GameObject;
var deathPauseUIVR : GameObject;

var whiteFadeUIVR : GameObject;
private var whiteFadeUIVRRenderer : Renderer;
private var whiteFadeUIVRMatl : Material;

var whiteFadeEndGameUIVR : GameObject;
private var whiteFadeEndGameUIVRRenderer : Renderer;
private var whiteFadeEndGameUIVRMatl : Material;

var scoreUIVR : GameObject;
private var scoreUIVRRenderer : Renderer;
private var scoreUIVRMatl : Material;
private var peakScoreFlashValueVR : float = 1.0;

var reticleVRUIObj : GameObject;
static var reticleVRUIScript : VRLifeMeter;

var endGameUIObjVR : GameObject;
private var endGameUIVRRenderer : Renderer;
private var endGameUIVRMatl : Material;

var clearDestroyedObjects : boolean = false;

var whiteFader : FadeInOutAlt;
private var introComponent : IntroSequence1stPerson;
introComponent = GetComponent("IntroSequence1stPerson");

var simpleVelocityLimiterComponent : SimpleVelocityLimiter;
simpleVelocityLimiterComponent = GetComponent("SimpleVelocityLimiter");

var playAltScoreAudio : boolean = false;
var clipToPlay : float;
var audioToPlay : AudioSource;
var pitchRand : float;

var audioScore : AudioSource;
var audioScoreAlt : AudioSource;
var audioDeath : AudioSource;
var audioLevelEnd : AudioSource;
var myVol : float;
var peakVol : float;

private var myTransform : Transform;
private var myMainCamera : Camera;
private var myMainCameraTransform : Transform;

private var myBackdrop : GameObject;
private var myBackdropRenderer : Renderer;

private var BackdropMist : GameObject;

private var myVRViewer : GameObject;

var rb : Rigidbody;

function Awake() {
//	if (iPhoneInput.orientation == iPhoneOrientation.LandscapeRight) {
//	flipMultiplier = -1;
//}
    myTransform = transform;
}

function Start() {
  fallingLaunch = GameObject.Find("LaunchGameObject");
  fallingLaunchComponent = fallingLaunch.GetComponent.<FallingLaunch>();

  if (!FallingLaunch.isVRMode) {
    // In case the calculation in the start menu was wrong/outmoded:
    fallingLaunchComponent.LockDeviceOrientation(1.0);
  }

  myMainCamera = Camera.main;
  // Go up one level; this is the Player-cameras container object, which will get rotated on tilt:
  myMainCameraTransform = myMainCamera.gameObject.transform.parent;
  myBackdrop = GameObject.Find("plane-close");
  BackdropMist = GameObject.Find("Cylinder");
  myBackdropRenderer = myBackdrop ? myBackdrop.GetComponent.<Renderer>() : null;
  lifeCountdownScript = gameObject.GetComponent.<lifeCountdown>();

  if (FallingLaunch.isVRMode) {

    myVRViewer = GameObject.Find("GvrViewerMain");
    scoreUIVRRenderer = scoreUIVR.GetComponent.<Renderer>();
    scoreUIVRMatl = scoreUIVRRenderer.material;
    scoreUIVRMatl.color.a = 0;

    whiteFadeUIVRRenderer = whiteFadeUIVR.GetComponent.<Renderer>();
    whiteFadeUIVRMatl = whiteFadeUIVRRenderer.material;
    whiteFadeUIVRMatl.color.a = 0;

    if (whiteFadeEndGameUIVR) {
      whiteFadeEndGameUIVRRenderer = whiteFadeEndGameUIVR.GetComponent.<Renderer>();
      whiteFadeEndGameUIVRMatl = whiteFadeEndGameUIVRRenderer.material;
      whiteFadeEndGameUIVRMatl.color.a = 0;
    }

    // Hack to have two separate death/fade-to-black sphere objects,
    // but neither shader does everything. The inverted transparent shader occludes
    // all physical objects, but the UIToolkit one is needed for covering light halos.
    // The opaque and transparent materials have manual RenderQueue settings
    // of 5000 (the official max) and 6000, respectively.
    if (deathFadeUIVR && opaqueDeathFadeUIVR) {
      deathFadeUIVRRenderer = deathFadeUIVR.GetComponent.<Renderer>();
      deathFadeUIVRMatl = deathFadeUIVRRenderer.material;

      opaqueDeathFadeUIVRRenderer = opaqueDeathFadeUIVR.GetComponent.<Renderer>();
      opaqueDeathFadeUIVRMatl = opaqueDeathFadeUIVRRenderer.material;

      if (deathFadeUIVRMatl.HasProperty("_Color")) {
        deathFadeUIVRMatl.color.a = 0;
      }
      if (opaqueDeathFadeUIVRMatl.HasProperty("_TintColor")) {
        var currentColor : Color = opaqueDeathFadeUIVRMatl.GetColor("_TintColor");
        currentColor.a = 0;
        opaqueDeathFadeUIVRMatl.SetColor("_TintColor", currentColor);
      }
    }

    if (reticleVRUIObj) {
      reticleVRUIScript = reticleVRUIObj.GetComponent.<VRLifeMeter>();
    } else {
      Debug.LogError("You forgot to assign an object for the VR reticle... trying to look up manually");
      reticleVRUIScript = GameObject.Find("vr-radial-life-meter").GetComponent.<VRLifeMeter>();
    }
  }

	startingFogEndDistance = RenderSettings.fogEndDistance;
  startingFogStartDistance = RenderSettings.fogStartDistance;

  isAlive = 1;
  UIscriptComponent = UIscriptName.GetComponent(fallingUITest);
  lifeStartTime = Time.time;
  levelStartTime = Time.time;
  isExitingLevel = false;
  FallingLaunch.thisLevel = Application.loadedLevelName;
	FallingLaunch.thisLevelArea = "0-start";
	AudioListener.pause = false;
	myVol = audioScore.volume;
	peakVol = audioScore.volume;
  	FadeAudio(0.1, FadeDir.In);
	isPausable = false;

	rb = GetComponent.<Rigidbody>();

  if (FallingLaunch.isVRMode && levelStartUIVR && FallingLaunch.shouldShowVRIntroUI) {
    levelStartUIVR.SetActive(true);
    isAlive = 0;
    rb.isKinematic = true;
  } else {
    isAlive = 1;
    rb.isKinematic = false;
  }

  // introComponent's existence is a proxy for level 1, 
  // where we don't want the reticle to be visible yet
  // (resuming from a level 1 post-intro checkpoint
  // is handled in Respawn.js (mainRespawnScript):
	if (!introComponent) {
	   UIscriptComponent.UnhideGUI();

     if (FallingLaunch.isVRMode) {
        reticleVRUIScript.FadeReticleIn(1.5);
     }
	}

	LevelStartFade();
}

function LevelStartFade () {
	if (PlayerPrefs.HasKey("LatestLevel") &&
        PlayerPrefs.GetString("LatestLevel") == Application.loadedLevelName) {
        FallingLaunch.LoadedLatestLevel = true;
    }

	if (FallingLaunch.LoadedLatestLevel == false) {
		introFade();
	}
}

function introFade() {
	// this disables (unchecks) the script FadeInOutAlt after three seconds,
	// so OnGui is only called at the start of each level load.
	yield WaitForSeconds (3);
	whiteFader = Camera.main.GetComponent(FadeInOutAlt);
	whiteFader.enabled = false;
}

function introNow() {  
	LatestCheckpointRespawn();
	yield WaitForSeconds (3);
	FallingLaunch.LoadedLatestLevel = false;
	whiteFader = Camera.main.GetComponent(FadeInOutAlt);
	if (whiteFader) {whiteFader.enabled = false;}
}


function FadeAudio(timer : float, fadeType : FadeDir) {

  var start = fadeType == FadeDir.In? 0.0 : 1.0;
  var end = fadeType == FadeDir.In? 1.0 : 0.0;
  var i = 0.0;
  var step = 1.0/timer;

  while (i <= 1.0) {
      i += step * Time.deltaTime;
      // var t : float = Mathf.Sin(i * Mathf.PI * 0.5f); // ease-out lerp
      AudioListener.volume = Mathf.Lerp(start, end, i);
      yield;
  }
}


function DeathRespawn () {
	isPausable = false;
	rb.isKinematic = true;
	lifeStartTime = Time.time;
 	var respawnPosition = Respawn.currentRespawn.transform.position;

  if (FallingLaunch.isVRMode) {
    reticleVRUIScript.FadeReticleOut(0.5);
    FadeAudio(1.5, FadeDir.Out);
    yield DeathFadeVR(1.0, FadeDir.Out);
  } else {
    FadeAudio(fadeTime, FadeDir.Out);
    yield UIscriptComponent.fadeOut();
  }

  if (levelChangeBackdrop == true) {
    changeLevelBackdrop ();
  }

  // VR mode does its own score reset later, due to a longer fade interval/
  // interstitial 'back to menu' screen.
  if (!FallingLaunch.isVRMode) {
    script.ResetScore();
  }

  // If you want to clear destroyed projectiles (set per-level)...
	if (clearDestroyedObjects) {
  		Resources.UnloadUnusedAssets();
	}

	isAlive = 1;
	RenderSettings.fogEndDistance = startingFogEndDistance;
    RenderSettings.fogStartDistance = startingFogStartDistance;

//	Camera.main.transform.position = respawnPosition - (transform.forward * 4) + Vector3.up;	// reset camera too
	GetComponent.<Collider>().attachedRigidbody.transform.Translate(respawnPosition);
	// Relocate the player. We need to do this or the camera will keep trying to focus on the (invisible) player where he's standing on top of the FalloutDeath box collider.
	myTransform.position = respawnPosition; // + Vector3.up;

	rb.isKinematic = false;

	MoveController.controlMultiplier = 1.0;

  if (FallingLaunch.isVRMode && deathPauseUIVR && deathFadeUIVR) {

    rb.isKinematic = true;
    isAlive = 0;

    deathPauseUIVR.SetActive(true);

    DeathFadeVR(1.0, FadeDir.In);
    // yield UIscriptComponent.fadeIn(false);

    // Managing isExitableFromVR gives finer control over the exit UI,
    // preventing the player from tapping mid-respawn fadeout.
    isExitableFromVR = true;
    yield WaitForSeconds(4);
    isExitableFromVR = false;

    yield DeathFadeVR(0.5, FadeDir.Out);

    rb.isKinematic = false;

    // TODO: Fade out material here instead of toggling the whole object outright?
    deathPauseUIVR.SetActive(false);

    // resetting score to max here for VR, to avoid the score
    // ticking away over the preceding ~4 WaitForSeconds.
    script.ResetScore();

    // In VR mode, we ignore fadeTime in favor of a longer fade-in
    // matched to the longer waiting interval below:
    FadeAudio(2.0, FadeDir.In);

    DeathFadeVR(1.0, FadeDir.In);
    isPausable = true;
     
    // setting isAlive is order-dependent with lerpControlIn below 
    // (isAlive = 0 will break its loop):
    isAlive = 1;
    lerpControlIn(3.0);

    yield WaitForSeconds(1);
    reticleVRUIScript.FadeReticleIn(1.5);

  } else {
    FadeAudio(fadeTime, FadeDir.In);
    lerpControlIn(3.0);
    yield UIscriptComponent.fadeIn(true);
  }
}

function LatestCheckpointRespawn () {
	isPausable = false;
	rb.isKinematic = true;
 	var respawnPosition = Respawn.currentRespawn.transform.position;
	//UIscriptComponent.fadeOut();

	if (levelChangeBackdrop == true) {
		changeLevelBackdrop ();
	}
//  	yield WaitForSeconds(1);

  // if in VR intro, don't set isAlive yet, since that will start the lifeCountdown timer ticking:
  if (FallingLaunch.isVRMode && FallingLaunch.shouldShowVRIntroUI) {
    isAlive = 0;
  } else {
    isAlive = 1;
  }

	RenderSettings.fogEndDistance = startingFogEndDistance;
  RenderSettings.fogStartDistance = startingFogStartDistance;

	GetComponent.<Collider>().attachedRigidbody.transform.Translate(respawnPosition);
	myTransform.position = respawnPosition; // + Vector3.up;

  FadeAudio(fadeTime, FadeDir.In);
	
  if (!FallingLaunch.isVRMode) {
    rb.isKinematic = false;
    lerpControlIn(3.0);
    UIscriptComponent.UnhideGUI();
  }
}

function ShowDeathHelp() {
  if (introComponent) {
    introComponent.DeathHelp();
  }
}

function changeLevelBackdrop () {
  if (!FallingLaunch.isVRMode) {
    if (changeBackdrop.oceanCameraVR) {
      changeBackdrop.oceanCameraVR.GetComponent(Camera).enabled = false;
    }
  }

  // needed even in VR mode, so the ocean renderer disables on respawn:
  if (changeBackdrop.oceanCamera) {
    changeBackdrop.oceanCamera.GetComponent(Camera).enabled = false;
    changeBackdrop.oceanRenderer.enabled = false;
  }

	// the Fade argument below this breaks unpredictably if player gameobject lacks a Fade script component
	// Fade.use.Colors(guiTexture, (RenderSettings.fogColor * 2), startingFogColor, 2.0);
	RenderSettings.fogEndDistance = startingFogEndDistance;
  RenderSettings.fogStartDistance = startingFogStartDistance;

  if (myMainCamera) {
    // reset regular or VR cameras' clip planes (handles both cases internally):
    changeBackdrop.ResetCameraClipPlane();
  }
  if (myBackdropRenderer) {
      myBackdropRenderer.materials = [origMat];
  }
  if (BackdropMist) {
	 iTween.ColorTo(BackdropMist,{"a": startingCloudsAlpha,"time": .5});
  }
}

function Update () {
	// playerTilt moves camera on device tilt. Enable if not in VR mode:
    if (!FallingLaunch.isVRMode) {
        playerTilt();
    }

    // disable VR mode and return to menu on screen touch while dead:
    if (FallingLaunch.isVRMode) {

      if (FallingLaunch.showingVREndGameUI) {
        for (var i3 = 0; i3 < Input.touchCount; ++i3) {
          if (Input.GetTouch(i3).phase == TouchPhase.Ended && Input.GetTouch(i3).phase != TouchPhase.Canceled) {
            Application.LoadLevel("Falling-scene-menu");
          }
        }
      }

      if (isAlive == 0 && deathPauseUIVR.activeInHierarchy && isExitableFromVR) {
        for (var i = 0; i < Input.touchCount; ++i) {
          if (Input.GetTouch(i).phase != TouchPhase.Ended && Input.GetTouch(i).phase != TouchPhase.Canceled) {
            isPausable = false;
            FallingLaunch.isVRMode = false;

            UIscriptComponent.SaveCheckpointVR();
            Application.LoadLevel("Falling-scene-menu");
          }
        }
      }

      if (levelStartUIVR.activeInHierarchy && FallingLaunch.shouldShowVRIntroUI) {
        for (var i2 = 0; i2 < Input.touchCount; ++i2) {
          if (Input.GetTouch(i2).phase == TouchPhase.Ended && Input.GetTouch(i2).phase != TouchPhase.Canceled) {
            ContinueFromLevelStartVR();
          }
        }
      }
      
    }

	//Debug.Log("slowdown is: " + MoveController.Slowdown + " and myVol is: " + myVol);
	//Debug.Log("your current acceleration is: " + FallingLaunch.accelerator);
}

function playerTilt() {
	if (isTiltable == true) {
	    var dir : Vector3 = Vector3.zero;

	    if (FallingLaunch.hasSetAccel == false) {
    		FallingLaunch.accelerator = FallingLaunch.calibrationRotation * Input.acceleration;
    	}
		tiltAroundZ = FallingLaunch.invertHorizAxisVal * Mathf.Clamp((FallingLaunch.flipMultiplier * (-FallingLaunch.accelerator.y * tiltAngle)), -tiltAngle, tiltAngle);
		tiltAroundX = FallingLaunch.invertVertAxisVal * Mathf.Clamp((FallingLaunch.flipMultiplier * (-FallingLaunch.accelerator.x * tiltAngle)), -tiltAngle, tiltAngle);

	    var target = Quaternion.Euler (tiltAroundX, 0, tiltAroundZ);
      // Dampen towards the target rotation
      // Rotating the camera transform, not the Player transform itself, so the 3D clouds 
      // (which are the child of the Player object) have correct tilt context.
	    myMainCameraTransform.rotation = Quaternion.Lerp(myMainCameraTransform.rotation, target,
	                                   Time.deltaTime * smooth);
    }
}

function lerpControlIn(timer : float) {

	// Debug.Log("your flip multiplier is " + FallingLaunch.flipMultiplier);
	// Debug.Log("your control multiplier is " + MoveController.controlMultiplier);

    var start = 0.0;
    var end = 1.0; // MoveController.controlMultiplier;
    var i = 0.0;
    var step = 1.0/timer;


    while (i <= 1.0) {
        i += step * Time.deltaTime;
        MoveController.controlMultiplier = Mathf.Lerp(start, end, i);
        if (isAlive == 0) {MoveController.controlMultiplier = end; break;}
		yield;

        if (i >= 1.0 || isAlive == 0) {MoveController.controlMultiplier = end; break;}
    	}
    yield WaitForSeconds (timer);
}

function lerpControlOut(timer : float) {

    var startControl : float = MoveController.controlMultiplier;
    var end : float = 0.0;
    var startMaxVelocity : float = simpleVelocityLimiterComponent.GetMaxVelocity();
    var endVelocity : float = 0; // startMaxVelocity * .15; // / 3;

    // timer 1 and 2 run sequentially via the two `yields` /
    // inner `while` looops below, adding up to the overall `timer` argument:
    var timer2 : float = 1.25;
    var timer1 : float = timer - timer2;

    var i = 0.0;
    var step = 1.0/timer1;

    while (i <= 1.0) {
        i += step * Time.deltaTime;

        var controlT : float = Mathf.Sin(i * Mathf.PI * 0.5f); // ease-out lerp

        MoveController.controlMultiplier = Mathf.Lerp(startControl, end, controlT);

        if (isAlive == 0) {
            MoveController.controlMultiplier = startControl;
            simpleVelocityLimiterComponent.SetMaxVelocity(startMaxVelocity);
            break;
        }

        yield;

        // the && is because the smootherstep math can overshoot 1.0 on its own:
        if (i >= 1.0 && isAlive == 0) {
            MoveController.controlMultiplier = startControl;
            simpleVelocityLimiterComponent.SetMaxVelocity(startMaxVelocity);
            break;
        }
	}

    // In the final bit of time (timer2), lerp the speed cap down to zero:
    var i2 : float = 0.0;
    var step2 = 1.0/timer2;

    while (i2 <= 1.0) {
        i2 += step2 * Time.deltaTime;

        // var maxVelocityT : float = i2*i2*i2 * (i2 * (6f*i2 - 15f) + 10f); // smootherstep lerp
        var maxVelocityT : float = Mathf.Sin(i2 * Mathf.PI * 0.5f); // ease-out lerp

        var newMaxVelocity : float = Mathf.Lerp(startMaxVelocity, endVelocity, maxVelocityT);

        simpleVelocityLimiterComponent.SetMaxVelocity(newMaxVelocity);

        if (isAlive == 0) {
            MoveController.controlMultiplier = startControl;
            simpleVelocityLimiterComponent.SetMaxVelocity(startMaxVelocity);
            break;
        }

        yield;

        // the && is because the smootherstep math can overshoot 1.0 on its own:
        if (i2 >= 1.0 && isAlive == 0) {
            MoveController.controlMultiplier = startControl;
            simpleVelocityLimiterComponent.SetMaxVelocity(startMaxVelocity);
            break;
        }
    }
}

function ScoreFlashVR (timer : float, fadeType : FadeDir) {

    var start = fadeType == FadeDir.In? 0.0 : peakScoreFlashValueVR;
    var end = fadeType == FadeDir.In? peakScoreFlashValueVR : 0.0;
    var i = 0.0;
    var step = 1.0/timer;

    while (i <= 1.0) {
        i += step * Time.deltaTime;
        scoreUIVRMatl.color.a = Mathf.Lerp(start, end, i);
        yield;
    }
}

function DeathFadeVR (timer : float, fadeType : FadeDir) {

    var start = fadeType == FadeDir.In ? 1.0 : 0.0;
    var end = fadeType == FadeDir.In ? 0.0 : 1.0;
    var i = 0.0;
    var step = 1.0/timer;

    while (i <= 1.0) {
        i += step * Time.deltaTime;
        // ease-out lerp, to match non-VR fade timing:
        var t : float = Mathf.Sin(i * Mathf.PI * 0.5f);

        if (deathFadeUIVRMatl.HasProperty("_Color")) {
          deathFadeUIVRMatl.color.a = Mathf.Lerp(start, end, t);
        }
        if (opaqueDeathFadeUIVRMatl.HasProperty("_TintColor")) {
          var currentColor : Color = opaqueDeathFadeUIVRMatl.GetColor("_TintColor");
          currentColor.a = Mathf.Lerp(start, end, t);
          opaqueDeathFadeUIVRMatl.SetColor("_TintColor", currentColor);
        }

        yield;
    }
}

function WhiteFadeVR (timer : float, fadeType : FadeDir) {

    var start = fadeType == FadeDir.In ? 1.0 : 0.0;
    var end = fadeType == FadeDir.In ? 0.0 : 1.0;
    var i = 0.0;
    var step = 1.0/timer;

    while (i <= 1.0) {
        i += step * Time.deltaTime;
        whiteFadeUIVRMatl.color.a = Mathf.Lerp(start, end, i);
        yield;
    }
}

function WhiteFadeVREndGame (timer : float) {

    var start = 0.0;
    var end = 0.66;
    var i = 0.0;
    var step = 1.0/timer;
    
    if (endGameUIObjVR) {
      endGameUIObjVR.SetActive(true);
      endGameUIVRRenderer = endGameUIObjVR.GetComponent.<Renderer>();
      endGameUIVRMatl = endGameUIVRRenderer.material;
    }

    if (whiteFadeEndGameUIVR) {
      whiteFadeEndGameUIVR.SetActive(true);
    }

    while (i <= 1.0) {
        i += step * Time.deltaTime;
        whiteFadeEndGameUIVRMatl.color.a = Mathf.Lerp(start, end, i);
        if (endGameUIVRMatl) {endGameUIVRMatl.color.a = Mathf.Lerp(start, end, i);}
        yield;
    }

    // this will allow screen taps to return to the main menu:
    FallingLaunch.showingVREndGameUI = true;
}

function OnCollisionEnter (collision : Collision) {
// Debug.Log("Hit something!" + collision.contacts[0].normal + dir.x + dir.z + Input.acceleration.x);
// Screen.sleepTimeout = 0.0f;

  if (collision.gameObject.CompareTag ("Death") && isAlive == 1) {
  	if (isPausable == true || collision.gameObject.layer == 17 ) {
  		isAlive = 0;
  		isPausable = false;

      if (!FallingLaunch.isVRMode) {
        lifeCountdown.LifeFlashTextureScript.FadeFlash(1, FadeDir.Out);
        UIscriptComponent.HideGUI();
      } else {
        lifeCountdownScript.FadeFlashVR(1.0, FadeDir.Out);
      }

  		FallingLaunch.secondsAlive = (Time.time - lifeStartTime);

  		if (audioDeath) {audioDeath.Play();}

        GameAnalyticsSDK.GameAnalytics.NewDesignEvent (
            "Death:Collision:" + Application.loadedLevelName + ":" + FallingLaunch.thisLevelArea,
            FallingLaunch.secondsAlive
        );
  		//Debug.Log("you died in the area " + FallingLaunch.thisLevelArea);
  		//Debug.Log("You died in a fatal collision with " + collision.gameObject);

    	yield DeathRespawn ();
		//isPausable = true;
		//UIscriptComponent.UnhideGUI();
	}
  }

}

function OnTriggerEnter (other : Collider) {
  if (other.gameObject.CompareTag ("Score")){
    //  Debug.Log("You scored!");

    if (FallingLaunch.isVRMode) {
      ScoreFlashVR(0.8, FadeDir.Out);
    } else {
  	 ScoreFlashTextureScript.FadeFlash(0.8, FadeDir.Out);
    }

  	script.IncrementScore(6);
  	UIscriptComponent.flashProgressBar(1);

  	if (audioScore) {
  		//Debug.Log(Random.Range(0,2));
  		myVol = ((MoveController.Slowdown / MoveController.maxSlowdown) * peakVol);
  		clipToPlay = Random.Range(0.3f, 0.9f);
  		pitchRand = Random.Range(0.98f,1.03f);

  		if (playAltScoreAudio) {
  			audioToPlay = audioScoreAlt;
  			playAltScoreAudio = false;
  		}
  		else {
  			audioToPlay = audioScore;
  			playAltScoreAudio = true;
  		}

  		audioToPlay.pitch = pitchRand;

  		//if (clipToPlay == 1) {audioToPlay = audioScoreAlt;}
  		if (clipToPlay > 0.6f) {
  			audioToPlay.panStereo = (-clipToPlay/2);
  			audioToPlay.volume = Mathf.Clamp(myVol, (peakVol/2), peakVol);
  		}
  		else {
  			audioToPlay.volume = clipToPlay;
  			audioToPlay.panStereo = (clipToPlay/2);
  		}

  		//audioToPlay.volume = Mathf.Clamp(myVol, (peakVol * .5), peakVol);
  		audioToPlay.Play();
  	}

  	//yield WaitForSeconds(.2);

    //	try using PlayClipAtPoint here so score sound fades away in 3D space as you fall?
    //  Camera.main.SendMessage("flashUp");
	}

  if (other.gameObject.CompareTag ("LevelEnd") && isExitingLevel == false) {
  	isExitingLevel = true;
  	isPausable = false;
  	var isNewGamePlus = (FallingLaunch.NewGamePlus) ? "new_game_plus" : "first_game";
  	FallingLaunch.secondsInLevel = (Time.time - levelStartTime);

    // TODO: Send separate event indicating whether you were in VR mode?
    GameAnalyticsSDK.GameAnalytics.NewDesignEvent (
        "LevelComplete:" + SceneManagement.SceneManager.GetActiveScene().name + ":" + isNewGamePlus,
        FallingLaunch.secondsInLevel
    );

    // reset the level area identifier for analytics purposes:
    FallingLaunch.thisLevelArea = "0-start";

  	// TestFlightUnity.TestFlight.PassCheckpoint( "LevelComplete:" + Application.loadedLevelName );

  	// to keep you from dying after you strike the levelend trigger
  	script.IncrementScore(25);

  	audioLevelEnd.Play();

    // the lerpControlOut timer argument must be equal to, or just less than,
    // the sum of levelComplete's first argument,
    // in order to create a convincing slowdown lerp and UI/camera fadeout:
    lerpControlOut(4.0);

    if (FallingLaunch.isVRMode) {
      WhiteFadeVR(3.0, FadeDir.Out);
    }
    // Handles 2D (non-VR) UI logic in its own conditional, 
    // plus saves progress, loads the next level, etc. 
    UIscriptComponent.LevelComplete(3.0, 1.5);
  }
}

function ContinueFromLevelStartVR () {
  FallingLaunch.shouldShowVRIntroUI = false;

  // TODO: Fade out material here instead of toggling the whole object outright?
  levelStartUIVR.SetActive(false);
  rb.isKinematic = false;
  isAlive = 1;
  isPausable = true;
  lerpControlIn(1.5);
}

@script AddComponentMenu("Scripts/FallingPlayer")
