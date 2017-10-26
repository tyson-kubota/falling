#pragma strict 

// 10/25/2017: `Color` uses a 0-1 float range, not 0-2, in Unity.
// 2 = 255 for rgba in this color array
// static var startingFogColor : Color = Color(1.17, 1.17, 1.17, 2);
static var startingFogEndDistance : int = 1500;
static var startingFogStartDistance : int = 150;
static var startingCameraFarClipPlane : int = 1700;
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

static var isAlive : int = 0;
isAlive = lifeCountdown.isAlive;

static var lifeStartTime : float = 0;
static var levelStartTime : float = 0;
  	  	
static var isTiltable : boolean = true;

static var isPausable : boolean = false;
var isExitingLevel : boolean = false;

var UIscriptName : GameObject;
static var UIscriptComponent : fallingUITest;

// todo: handle spherical fade-out UI in script
// var blackUIVR : GameObject;

var deathUIVR : GameObject;

var scoreUIVR : GameObject;
var scoreUIVRRenderer : Renderer;
var scoreUIVRMatl : Material;
var peakScoreFlashValueVR : float = 1.0;

var reticleVRUIObj : GameObject;
var reticleVRUIScript : VRLifeMeter;

var clearDestroyedObjects : boolean = false;

var whiteFader : FadeInOutAlt;
var introComponent : IntroSequence1stPerson;
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
    myMainCamera = Camera.main;
    myBackdrop = GameObject.Find("plane-close");
    BackdropMist = GameObject.Find("Cylinder");
    myBackdropRenderer = myBackdrop ? myBackdrop.GetComponent.<Renderer>() : null;

    if (FallingLaunch.isVRMode) {
      myVRViewer = GameObject.Find("GvrViewerMain");
      scoreUIVRRenderer = scoreUIVR.GetComponent.<Renderer>();
      scoreUIVRMatl = scoreUIVRRenderer.material;
      scoreUIVRMatl.color.a = 0;
      if (reticleVRUIObj) {
        reticleVRUIScript = reticleVRUIObj.GetComponent.<VRLifeMeter>();
      } else {
        Debug.LogError("You forgot to assign an object for the VR reticle... trying to look up manually");
        reticleVRUIScript = GameObject.Find("vr-radial-life-meter").GetComponent.<VRLifeMeter>();
      }
      reticleVRUIScript.FadeReticleIn(1.5);
    }

//	startingFogColor = RenderSettings.fogColor * 2;
	startingFogEndDistance = RenderSettings.fogEndDistance;
    startingFogStartDistance = RenderSettings.fogStartDistance;
    
	startingCameraFarClipPlane = myMainCamera.farClipPlane;
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
//	fadeInAudio ();
  	FadeAudio (0.1, FadeDir.In);
	isPausable = false;  

	rb = GetComponent.<Rigidbody>();
	rb.isKinematic = false;

	if (!introComponent) {
	   UIscriptComponent.UnhideGUI();
	}

	LevelStartFade();

    // since it was probably lerped down to zero at previous levelEnd, initialize it here.
    MoveController.controlMultiplier = 1;
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
	whiteFader.enabled = false;
}


function FadeAudio (timer : float, fadeType : FadeDir) {

    var start = fadeType == FadeDir.In? 0.0 : 1.0;
    var end = fadeType == FadeDir.In? 1.0 : 0.0;
    var i = 0.0;
    var step = 1.0/timer;

    while (i <= 1.0) {
        i += step * Time.deltaTime;
        AudioListener.volume = Mathf.Lerp(start, end, i);
        yield;
    }
}


function DeathRespawn () {
	isPausable = false;
	rb.isKinematic = true;
	lifeStartTime = Time.time;
 	var respawnPosition = Respawn.currentRespawn.transform.position;  

	UIscriptComponent.fadeOut();
// 	Camera.main.SendMessage("fadeOut");

	if (levelChangeBackdrop == true) {
		changeLevelBackdrop ();
	}
	
  	FadeAudio (fadeTime, FadeDir.Out);
  	      
    script.ResetScore(0);

  	yield WaitForSeconds(1);

//	if you want to clear destroyed projectiles...
	if (clearDestroyedObjects == true) {
  		Resources.UnloadUnusedAssets();
	}

	isAlive = 1;
	RenderSettings.fogEndDistance = startingFogEndDistance;
    RenderSettings.fogStartDistance = startingFogStartDistance;
  	
//	Camera.main.transform.position = respawnPosition - (transform.forward * 4) + Vector3.up;	// reset camera too
	GetComponent.<Collider>().attachedRigidbody.transform.Translate(respawnPosition);
	// Relocate the player. We need to do this or the camera will keep trying to focus on the (invisible) player where he's standing on top of the FalloutDeath box collider.
	myTransform.position = respawnPosition; // + Vector3.up;
//	Camera.main.SendMessage("fadeIn");

  	FadeAudio (fadeTime, FadeDir.In);
//	thisOceanCamera.SendMessage("fadeIn");
	rb.isKinematic = false;
//   	isAlive = 1;
	
	MoveController.controlMultiplier = 1;
 	  
  if (FallingLaunch.isVRMode && deathUIVR) {

    rb.isKinematic = true; 
    isAlive = 0;

    deathUIVR.SetActive(true);
    reticleVRUIScript.FadeReticleOut(0.5);

    yield UIscriptComponent.fadeIn(false);
    
    yield WaitForSeconds(4);
    
    yield UIscriptComponent.fadeOut();
    // UIscriptComponent.UnPauseGame(true);
    rb.isKinematic = false;
    
    // TODO: Fade out material here instead of toggling the whole object outright?
    deathUIVR.SetActive(false);

    lerpControlIn(3.0);

    yield UIscriptComponent.fadeIn(false);
    yield WaitForSeconds(1);

    reticleVRUIScript.FadeReticleIn(1.5);

    isPausable = true;
    isAlive = 1;
  } else {
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

	isAlive = 1;
	RenderSettings.fogEndDistance = startingFogEndDistance;
  	RenderSettings.fogStartDistance = startingFogStartDistance;

	GetComponent.<Collider>().attachedRigidbody.transform.Translate(respawnPosition);
	myTransform.position = respawnPosition; // + Vector3.up;

  	FadeAudio (fadeTime, FadeDir.In);
	rb.isKinematic = false;
	
	MoveController.controlMultiplier = 1;
   	
   	lerpControlIn(3);
   	//yield UIscriptComponent.fadeIn(true);
   	UIscriptComponent.UnhideGUI();
}   

function ShowDeathHelp() {
  if (introComponent && !FallingLaunch.isVRMode) {
    introComponent.DeathHelp();
  }
}

function changeLevelBackdrop () {
  changeBackdrop.oceanCamera.GetComponent(Camera).enabled = false;
	changeBackdrop.oceanRenderer.enabled = false;
	changeBackdrop.cloudRenderer.enabled = false;
	changeBackdrop.endSphereRenderer.enabled = false;

	// the Fade argument below this breaks unpredictably if player gameobject lacks a Fade script component
	// Fade.use.Colors(guiTexture, (RenderSettings.fogColor * 2), startingFogColor, 2.0);	
	RenderSettings.fogEndDistance = startingFogEndDistance;
  RenderSettings.fogStartDistance = startingFogStartDistance;

  if (myMainCamera) {myMainCamera.farClipPlane = startingCameraFarClipPlane;}
  if (myBackdropRenderer) {
      myBackdropRenderer.materials = [origMat];
  }
	iTween.ColorTo(BackdropMist,{"a": startingCloudsAlpha,"time": .5});
	}
	   		   	
function Update () {
	// playerTilt moves camera on device tilt. Enable if not in VR mode:
    if (!FallingLaunch.isVRMode) {
        playerTilt();
    }

    // disable VR mode and return to menu on screen touch while dead:
    if (FallingLaunch.isVRMode && isAlive == 0 && deathUIVR.activeInHierarchy) {
      for (var i = 0; i < Input.touchCount; ++i) {
        if (Input.GetTouch(i).phase != TouchPhase.Ended && Input.GetTouch(i).phase != TouchPhase.Canceled) {
          FallingLaunch.isVRMode = false;
          Application.LoadLevel("Falling-scene-menu");
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
	    myTransform.rotation = Quaternion.Lerp(myTransform.rotation, target,
	                                   Time.deltaTime * smooth);  
    }
}	 

function lerpControlIn(timer : float) {
	
	//Debug.Log("your flip multiplier is " + FallingLaunch.flipMultiplier);
	//Debug.Log("your control multiplier is " + MoveController.controlMultiplier);
    
    var start = 0.0;
    var end = MoveController.controlMultiplier;
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

function OnCollisionEnter (collision : Collision) {
// Debug.Log("Hit something!" + collision.contacts[0].normal + dir.x + dir.z + Input.acceleration.x);
// Screen.sleepTimeout = 0.0f;

  if (collision.gameObject.CompareTag ("Death") && isAlive == 1) {
  	if (isPausable == true || collision.gameObject.layer == 17 ) {
  		isAlive = 0;
  		isPausable = false;
  		lifeCountdown.LifeFlashTextureScript.FadeFlash (1, FadeDir.Out);
  		UIscriptComponent.HideGUI();
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
    //  Camera.main.SendMessage("flashOut");
    if (FallingLaunch.isVRMode) {
      ScoreFlashVR(0.8, FadeDir.Out);
    } else {
  	 ScoreFlashTextureScript.FadeFlash (0.8, FadeDir.Out);
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
    UIscriptComponent.LevelComplete(3.0, 1.5);
  }	
}
			
@script AddComponentMenu("Scripts/FallingPlayer")