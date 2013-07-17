#pragma strict

var newMat : Material;

var origMat : Material;

var fadeTex : Texture2D;

var mainCamera : GameObject;
static var oceanCamera : GameObject;
var backdropMist : GameObject;
static var oceanRenderer : Renderer;
static var cloudRenderer : Renderer;
static var endSphereRenderer : Renderer;
//var foo : Material; //set this in the editor
//var bar : Material; //set this in the editor
var oceanLevel : boolean = false;
var mistLevel : boolean = false;
var ShouldUseOceanCamera : boolean = false;
var ShouldChangeBackdrop : boolean = false;
var FogOnly : boolean = false;
var farClipPlaneValue : int = 2500;
var fogEndValue : int = 3000;
var farClipPlaneFadeTime : float = 3;

var farClipPlaneValue2 : int = 2800;
var fogEndValue2 : int = 1500;
var farClipPlaneFadeTime2 : float = 2;

function Start () {

	if (oceanLevel == true) {
		mainCamera = transform.FindChild("Camera").gameObject;
		
		oceanCamera = transform.FindChild("Camera-for-ocean").gameObject;
		backdropMist = transform.FindChild("Cylinder").gameObject;
		
		oceanRenderer = gameObject.Find("sky-water-ocean/Mesh").renderer;
		oceanRenderer.enabled = false;
		
		cloudRenderer = gameObject.Find("simple-cloud-plane/Mesh").renderer;
		cloudRenderer.enabled = false;
		
		endSphereRenderer = gameObject.Find("score-orbs-end/score-orb/Mesh").renderer;
		endSphereRenderer.enabled = false;
		}
	
	if (mistLevel == true) {	
		backdropMist = transform.FindChild("Cylinder").gameObject;
		}
}

function OnTriggerEnter (other : Collider) {
	if (other.gameObject.CompareTag ("changeBackdrop")) { 
	
// 		not needed if not actually changing backdrop
//		transform.Find("plane-close").renderer.materials = [newMat];
		if (ShouldChangeBackdrop == true) {
		transform.Find("plane-close").renderer.materials = [newMat];}

//		FadeBetweenCameras ();
//		Enable the above method to re-add the fade 2d image backdrop on trigger enter.

//		Debug.Log("You hit a changeBackdrop trigger!");
		
		FadeCameraFarClipPlane (1);
		if (FogOnly == true) {SmoothFogFade (1);}
		if (ShouldUseOceanCamera == true) {enableOceanCamera(); SmoothFogFade (1);}
		else if (mistLevel == true) {iTween.ColorTo(backdropMist,{"a":0.0f,"time":4});}
	}

	else if (other.gameObject.CompareTag ("changeBackdrop2")) { 
		//Debug.Log("You hit an alt changeBackdrop trigger!");
		FadeCameraFarClipPlane (2);
		if (FogOnly == true) {SmoothFogFade (2);}
		if (ShouldUseOceanCamera == true) {enableOceanCamera(); SmoothFogFade (2);}
		else if (mistLevel == true) {iTween.ColorTo(backdropMist,{"a":0.0f,"time":4});}
	}
	
}

function changeCameraFadeLayer() {
    var cameraFadeObject : GameObject = GameObject.Find ("iTween Camera Fade");
    if(cameraFadeObject)
       cameraFadeObject.layer = 4;
}

function FadeCameraFarClipPlane (type : int) {
    if (type == 2) {

    iTween.ValueTo ( gameObject,
        {
            "from" : mainCamera.camera.farClipPlane,
            "to" : farClipPlaneValue2,
            "onupdate" : "ChangeCameraFarClipPlane",
            "time" : farClipPlaneFadeTime2,
            "easetype" : "easeInExpo"
       });
 	}
 	else {
 		    iTween.ValueTo ( gameObject,
        {
            "from" : mainCamera.camera.farClipPlane,
            "to" : farClipPlaneValue,
            "onupdate" : "ChangeCameraFarClipPlane",
            "time" : farClipPlaneFadeTime,
            "easetype" : "easeInExpo"
       });
 	}   
}

function SmoothFogFade (type : int) {
    if (type == 2) {

    iTween.ValueTo ( gameObject,
        {
            "from" : FallingPlayer.startingFogEndDistance,
            "to" : fogEndValue2,
            "onupdate" : "ChangeFogEndDistance",
            "time" : farClipPlaneFadeTime2,
            "easetype" : "easeInExpo"
       });
	}
	else {

    iTween.ValueTo ( gameObject,
        {
            "from" : FallingPlayer.startingFogEndDistance,
            "to" : fogEndValue,
            "onupdate" : "ChangeFogEndDistance",
            "time" : 3,
            "easetype" : "easeInExpo"
//			"oncomplete" : "CameraFadeEnd"
       });
	}
}


function FadeBetweenCameras () {
		iTween.CameraFadeAdd(fadeTex);
		changeCameraFadeLayer();
		iTween.CameraFadeTo(0.75,.25);
		yield WaitForSeconds(.25);
		iTween.CameraFadeTo(0.0,3);
}

function CameraFadeEnd () {
	iTween.CameraFadeTo(0.0,1);
}

function ChangeFogEndDistance (i : int) {
	RenderSettings.fogEndDistance = i;
	//RenderSettings.fogStartDistance = .5*i;
}

function ChangeCameraFarClipPlane (i : int) {
	mainCamera.camera.farClipPlane = i;
}

function enableOceanCamera () {
	oceanCamera.GetComponent(Camera).enabled = true;
	oceanRenderer.enabled = true;
	cloudRenderer.enabled = true;
	endSphereRenderer.enabled = true;
	iTween.ColorTo(backdropMist,{"a":0.0f,"time":4});
}

function OnTriggerExit (other : Collider) {
	if (other.gameObject.CompareTag ("changeBackdrop") && ShouldChangeBackdrop == true)  {
		transform.Find("plane-close").renderer.materials = [origMat];
	}
}