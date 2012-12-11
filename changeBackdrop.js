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

function Start () {

	if (oceanLevel == true) {
		mainCamera = gameObject.Find("Camera");
		
		oceanCamera = gameObject.Find("Camera-for-ocean");
		backdropMist = gameObject.Find("Cylinder");
		
		oceanRenderer = gameObject.Find("sky-water-ocean/Mesh").renderer;
		oceanRenderer.enabled = false;
		
		cloudRenderer = gameObject.Find("simple-cloud-plane/Mesh").renderer;
		cloudRenderer.enabled = false;
		
		endSphereRenderer = gameObject.Find("score-orbs-end/score-orb/Mesh").renderer;
		endSphereRenderer.enabled = false;
		}
}

function OnTriggerEnter (other : Collider) {
	if (other.gameObject.CompareTag ("changeBackdrop")) { 
	
// 		not needed if not actually changing backdrop
//		transform.Find("plane-close").renderer.materials = [newMat];

//		FadeBetweenCameras ();
//		Enable the above method to re-add the fade 2d image backdrop on trigger enter.

//		Debug.Log("You hit a changeBackdrop trigger!");

		SmoothFogFade ();
		enableOceanCamera();
	}
}

function changeCameraFadeLayer() {
    var cameraFadeObject : GameObject = GameObject.Find ("iTween Camera Fade");
    if(cameraFadeObject)
       cameraFadeObject.layer = 4;
}

function SmoothFogFade () {
    iTween.ValueTo ( gameObject,
        {
            "from" : FallingPlayer.startingFogEndDistance,
            "to" : 3000,
            "onupdate" : "ChangeFogEndDistance",
            "time" : 3,
            "easetype" : "easeInExpo"
//			"oncomplete" : "CameraFadeEnd"
       });
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
}

function ChangeCameraFarClipPlane (i : int) {
	gameObject.Find("Camera").camera.farClipPlane = i;
}

function enableOceanCamera () {
	oceanCamera.GetComponent(Camera).enabled = true;
	oceanRenderer.enabled = true;
	cloudRenderer.enabled = true;
	endSphereRenderer.enabled = true;
	iTween.ColorTo(backdropMist,{"a":0.0f,"time":4});
}

function OnTriggerExit (other : Collider) {
	if (other.gameObject.CompareTag ("changeBackdrop")) 
		transform.Find("plane-close").renderer.materials = [origMat];
}