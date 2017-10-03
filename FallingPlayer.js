#pragma strict 

// 2 = 255 for rgba in this color array
static var startingFogColor : Color = Color(1.17, 1.17, 1.17, 2);
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
var fadeTime = 0.75;

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

var clearDestroyedObjects : boolean = false;

var whiteFader : FadeInOutAlt;
var introComponent : IntroSequence1stPerson;
introComponent = GetComponent("IntroSequence1stPerson");

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

    myVRViewer = GameObject.Find("GvrViewerMain");

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
	
//	fadeOutAudio ();
  	FadeAudio ((fadeTime), FadeDir.Out);
  	      
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
   	
   	lerpControlIn(3);
   	yield UIscriptComponent.fadeIn(true);
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
   	if (introComponent) {
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

    var start = MoveController.controlMultiplier;
    var end = 0.0;
    var i = 0.0;
    var step = 1.0/timer;
 
    while (i <= 1.0) { 
        i += step * Time.deltaTime;
        var t : float = i*i * (3f - 2f*i); // smoothstep lerp
        MoveController.controlMultiplier = Mathf.Lerp(start, end, t);
        
        if (isAlive == 0) {
            MoveController.controlMultiplier = start; 
            break;
        }

        yield;

        if (i >= 1.0 || isAlive == 0) {
            MoveController.controlMultiplier = start; 
            break;
        } 
	}
    yield WaitForSeconds (timer);
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
//    Camera.main.SendMessage("flashOut");
	ScoreFlashTextureScript.FadeFlash (0.8, FadeDir.Out);

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
        "LevelComplete:" + isNewGamePlus,
        FallingLaunch.secondsInLevel
    );

	// TestFlightUnity.TestFlight.PassCheckpoint( "LevelComplete:" + Application.loadedLevelName );
	
	// to keep you from dying after you strike the levelend trigger
	script.IncrementScore(25);
		
	audioLevelEnd.Play();
	lerpControlOut(3);
	//yield WaitForSeconds (audioLevelEnd.clip.length - 3);
	//yield WaitForSeconds (1);
	UIscriptComponent.LevelComplete();
  }	
}
			
@script AddComponentMenu("Scripts/FallingPlayer")