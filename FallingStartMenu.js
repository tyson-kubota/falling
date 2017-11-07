#pragma strict 

// 2 = 255 for rgba in this color array
static var startingFogColor : Color = Color(1.17, 1.17, 1.17, 2);
static var startingFogEndDistance : int = 1500;
static var startingCameraFarClipPlane : int = 1700;
static var startingCloudsAlpha : float = .39f;

var titleCard : GameObject;

//original for corroded sky tubes level
//static var startingFogEndDistance : int = 2500;
//static var startingCameraFarClipPlane : int = 2700;

var changeBackdrop : changeBackdrop;
changeBackdrop = GetComponent("changeBackdrop");
var levelChangeBackdrop : boolean = false;

//var ScoreFlashTexture : GameObject;

//var ScoreFlashTextureScript : GUITextureLaunch;
//ScoreFlashTextureScript = ScoreFlashTexture.GetComponent("GUITextureLaunch");

public var force:float = 1.0;
var dir : Vector3 = Vector3.zero;
public var touchingSomething:boolean = false;

//enum FadeDir {In, Out}
var fadeTime = 0.5;

var origMat : Material;
//var thisOceanCamera : Component;

// Move object using accelerometer
var speed = 5.0;
var target : Transform;
var smooth = 2.0;
var tiltAngle = 30.0;
//var flipMultiplier : int = 1;
//var flipMultiplier = FallingLaunch.flipMultiplier;

private var rb : Rigidbody;
private var mainCamera: Camera;

var script : ScoreController;
script = GetComponent("ScoreController");

var isAlive : int = 1;

static var isPausable : boolean = true;

var UIscriptName : GameObject;
var UIscriptComponent : fallingStartMenuUI;

function Awake() {
//	if (iPhoneInput.orientation == iPhoneOrientation.LandscapeRight) {
//	flipMultiplier = -1;
//}
	mainCamera = Camera.main;
	if (mainCamera.aspect < 1.5) {
		titleCard.transform.Translate(-200,0,0);
	}
}

function Start() {
//	startingFogColor = RenderSettings.fogColor * 2;
	startingFogEndDistance = RenderSettings.fogEndDistance;
	startingCameraFarClipPlane = mainCamera.farClipPlane;
	// formerly startingCameraFarClipPlane = gameObject.Find("Camera").camera.farClipPlane;
  	isAlive = 1;
  	UIscriptComponent = UIscriptName.GetComponent(fallingStartMenuUI);  	
	AudioListener.pause = false;
  	FadeAudio (0.1, FadeDir.In);
	isPausable = true;  

	rb = GetComponent.<Rigidbody>();
	rb.isKinematic = false;	
	UIscriptComponent.UnhideGUI();
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
   	var respawnPosition = Respawn.currentRespawn.transform.position;
  	Camera.main.SendMessage("fadeOut");
//  isAlive = 1;

	if (levelChangeBackdrop == true) {
		changeLevelBackdrop ();
	}
	
  	FadeAudio (fadeTime/2, FadeDir.Out);
  	      
    gameObject.SendMessage ("ResetScore", 0);
  	yield WaitForSeconds(1);
//	Camera.main.transform.position = respawnPosition - (transform.forward * 4) + Vector3.up;	// reset camera too
	GetComponent.<Collider>().attachedRigidbody.transform.Translate(respawnPosition);
	// Relocate the player. We need to do this or the camera will keep trying to focus on the (invisible) player where he's standing on top of the FalloutDeath box collider.
	transform.position = respawnPosition; // + Vector3.up;
	Camera.main.SendMessage("fadeIn");
  	FadeAudio (fadeTime, FadeDir.In);
//	thisOceanCamera.SendMessage("fadeIn");
	isPausable = true;
	rb.isKinematic = false;
   	isAlive = 1;
}   	

function changeLevelBackdrop () {
  	changeBackdrop.oceanCamera.GetComponent(Camera).enabled = false;
	changeBackdrop.oceanRenderer.enabled = false;
	changeBackdrop.cloudRenderer.enabled = false;
	changeBackdrop.endSphereRenderer.enabled = false;

// the Fade argument below this breaks unpredictably if player gameobject lacks a Fade script component
//	Fade.use.Colors(guiTexture, (RenderSettings.fogColor * 2), startingFogColor, 2.0);	
	RenderSettings.fogEndDistance = startingFogEndDistance;
  	gameObject.Find("Camera").GetComponent.<Camera>().farClipPlane = startingCameraFarClipPlane;
	transform.Find("plane-close").GetComponent.<Renderer>().materials = [origMat];
	var BackdropMist = gameObject.Find("Cylinder");
	iTween.ColorTo(BackdropMist,{"a":startingCloudsAlpha,"time":.5});
			   	
	}
	   		   	
function Update () {
    var dir : Vector3 = Vector3.zero;
	var tiltAroundZ = (FallingLaunch.flipMultiplier * (-Input.acceleration.y * tiltAngle));
    var tiltAroundX = (FallingLaunch.flipMultiplier * (-Input.acceleration.x * tiltAngle));

    var target = Quaternion.Euler (tiltAroundX, 0, tiltAroundZ);
                // Dampen towards the target rotation
    transform.rotation = Quaternion.Slerp(transform.rotation, target,
                                   Time.deltaTime * smooth);  
	  }
	  
var initialRespawn : Respawn;	// set this to the initial respawn point for the level.