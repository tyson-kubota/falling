#pragma strict 

// 2 = 255 for rgba in this color array
static var startingFogColor : Color = Color(1.17, 1.17, 1.17, 2);
static var startingFogEndDistance : int = 1500;
static var startingCameraFarClipPlane : int = 1700;
static var startingCloudsAlpha : float = .39f;

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
static var isNewGamePlus : String;
  	  	
static var isTiltable : boolean = true;

static var isPausable : boolean = false;
var isExitingLevel : boolean = false;

var UIscriptName : GameObject;
static var UIscriptComponent : fallingUITest;

var clearDestroyedObjects : boolean = false;

var whiteFader : FadeInOutAlt;
var introComponent : IntroSequence1stPerson;
introComponent = GetComponent("IntroSequence1stPerson");

var audioScore : AudioSource;
var audioScoreAlt : AudioSource;
var audioDeath : AudioSource;
var audioLevelEnd : AudioSource;
var myVol : float;
var peakVol : float;

private var myTransform : Transform;

private var BackdropMist : GameObject;
BackdropMist = transform.FindChild("Cylinder").gameObject;

function Awake() {
//	if (iPhoneInput.orientation == iPhoneOrientation.LandscapeRight) {
//	flipMultiplier = -1;
//}
	myTransform = transform;
}

function Start() {
//	startingFogColor = RenderSettings.fogColor * 2;
	startingFogEndDistance = RenderSettings.fogEndDistance;
	startingCameraFarClipPlane = myTransform.FindChild("Camera").camera.farClipPlane;
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
	rigidbody.isKinematic = false;
	if (!introComponent) {
	UIscriptComponent.UnhideGUI();
	}
	introFade();
}

function introFade() {
	// this disables (unchecks) the script FadeInOutAlt after three seconds,
	// so OnGui is only called at the start of each level load.
	yield WaitForSeconds (3);
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
	rigidbody.isKinematic = true;
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
  	
//	Camera.main.transform.position = respawnPosition - (transform.forward * 4) + Vector3.up;	// reset camera too
	collider.attachedRigidbody.transform.Translate(respawnPosition);
	// Relocate the player. We need to do this or the camera will keep trying to focus on the (invisible) player where he's standing on top of the FalloutDeath box collider.
	myTransform.position = respawnPosition; // + Vector3.up;
//	Camera.main.SendMessage("fadeIn");

  	FadeAudio (fadeTime, FadeDir.In);
//	thisOceanCamera.SendMessage("fadeIn");
	rigidbody.isKinematic = false;
//   	isAlive = 1;
	
	MoveController.controlMultiplier = 1;
   	
   	lerpControlIn(3);
   	yield UIscriptComponent.fadeIn(true);
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
//	Fade.use.Colors(guiTexture, (RenderSettings.fogColor * 2), startingFogColor, 2.0);	
	RenderSettings.fogEndDistance = startingFogEndDistance;
  	myTransform.FindChild("Camera").camera.farClipPlane = startingCameraFarClipPlane;
	myTransform.FindChild("plane-close").renderer.materials = [origMat];
	iTween.ColorTo(BackdropMist,{"a":startingCloudsAlpha,"time":.5});			   	
	}
	   		   	
function Update () {
	playerTilt ();
	//Debug.Log("slowdown is: " + MoveController.Slowdown + " and myVol is: " + myVol);
	Debug.Log("your current acceleration is: " + FallingLaunch.accelerator);
}
	  
function playerTilt () {
	if (isTiltable == true) {
	    var dir : Vector3 = Vector3.zero;

	    if (FallingLaunch.hasSetAccel == true) {
			tiltAroundZ = Mathf.Clamp((FallingLaunch.flipMultiplier * (-FallingLaunch.accelerator.y * tiltAngle)), -tiltAngle, tiltAngle);
    		tiltAroundX = Mathf.Clamp((FallingLaunch.flipMultiplier * (-FallingLaunch.accelerator.x * tiltAngle)), -tiltAngle, tiltAngle);
		}
	    else {
			tiltAroundZ = Mathf.Clamp((FallingLaunch.flipMultiplier * (-Input.acceleration.y * tiltAngle)), -tiltAngle, tiltAngle);
    		tiltAroundX = Mathf.Clamp((FallingLaunch.flipMultiplier * (-Input.acceleration.x * tiltAngle)), -tiltAngle, tiltAngle);
		}
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
        MoveController.controlMultiplier = Mathf.Lerp(start, end, i);
        if (isAlive == 0) {MoveController.controlMultiplier = start; break;}        
        
        yield;

        if (i >= 1.0 || isAlive == 0) {MoveController.controlMultiplier = start; break;} 
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
  		
  		GA.API.Design.NewEvent("Death:Collision:" + Application.loadedLevelName + ":" + FallingLaunch.thisLevelArea, FallingLaunch.secondsAlive, myTransform.position);
  		
  		//var deathCollideEvent : GAEvent = new GAEvent("Death", "Collision", FallingLaunch.thisLevelArea, FallingLaunch.secondsAlive);
		//GoogleAnalytics.instance.Add(deathCollideEvent);
		//GoogleAnalytics.instance.Dispatch();
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
		var clipToPlay : float = Random.Range(0.3f, 0.9f);
		var audioToPlay : AudioSource;
		//if (clipToPlay == 1) {audioToPlay = audioScoreAlt;}
		if (clipToPlay > 0.6f) {
			audioToPlay = audioScore;
			audioToPlay.pan = (-clipToPlay/2);
			audioToPlay.volume = Mathf.Clamp(myVol, (peakVol * .6), peakVol);
		}
		else {
			audioToPlay = audioScoreAlt;
			audioToPlay.volume = clipToPlay;
			audioToPlay.pan = (clipToPlay/2);
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
  	isNewGamePlus = (FallingLaunch.NewGamePlus) ? "new_game_plus" : "first_game";
	FallingLaunch.secondsInLevel = (Time.time - levelStartTime);
	
	GA.API.Design.NewEvent("LevelComplete:" + isNewGamePlus, FallingLaunch.secondsInLevel, myTransform.position);
	TestFlightUnity.TestFlight.PassCheckpoint( "LevelComplete:" + Application.loadedLevelName );
	
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