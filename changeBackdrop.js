#pragma strict

var newMat : Material;
var origMat : Material;

var fadeTex : Texture2D;

var mainCamera : GameObject;
var cam : Camera;

var closePlaneTransform : Transform;
static var closePlaneRenderer : Renderer;
var cloudCylinderObj : GameObject;
static var cloudCylinderRenderer : Renderer;

static var startingCloudAlpha : float; // Unity 4 used .39f (99 in RGBA)
var newCloudAlpha : float = .3f;
static var cloudOriginalMaterial : Material;

static var oceanCamera : GameObject;
static var oceanRenderer : Renderer;
static var cloudRenderer : Renderer;
static var endSphereRenderer : Renderer;

//var foo : Material; //set this in the editor
//var bar : Material; //set this in the editor
var oceanLevel : boolean = false;
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
		if (!mainCamera) {mainCamera = transform.FindChild("Camera").gameObject;}
		
		oceanCamera = transform.FindChild("Camera-for-ocean").gameObject;
		
		oceanRenderer = gameObject.Find("sky-water-ocean/Mesh").GetComponent.<Renderer>();
		oceanRenderer.enabled = false;
		
		cloudRenderer = gameObject.Find("simple-cloud-plane/Mesh").GetComponent.<Renderer>();
		cloudRenderer.enabled = false;
		
		endSphereRenderer = gameObject.Find("score-orbs-end/score-orb/Mesh").GetComponent.<Renderer>();
		endSphereRenderer.enabled = false;
	}
	
	cam = mainCamera.GetComponent.<Camera>();
    
    // Warn re. plane-close/Cylinder if they haven't been manually associated via the Inspector:
    if (ShouldChangeBackdrop || oceanLevel) {
        if (!cloudCylinderObj) {
            Debug.Log('Did you forget to link your cloudCylinderObj in the Inspector?');
        }
        if (cloudCylinderObj) {
            cloudCylinderRenderer = cloudCylinderObj.GetComponent.<Renderer>();
            cloudOriginalMaterial = cloudCylinderRenderer.material;
            startingCloudAlpha = cloudOriginalMaterial.color.a; // Storing for later use.
        }

        if (!closePlaneTransform) {
            closePlaneTransform = transform.Find("plane-close");
        }
        if (closePlaneTransform) {
            closePlaneRenderer = closePlaneTransform.GetComponent.<Renderer>();
        }
    }

}

function OnTriggerEnter (other : Collider) {
	if (other.gameObject.CompareTag ("changeBackdrop")) { 
	
		if (ShouldChangeBackdrop && closePlaneRenderer) {
            closePlaneRenderer.materials = [newMat];
        }

        if ((ShouldChangeBackdrop || oceanLevel) && cloudOriginalMaterial) {
            iTween.ColorTo(cloudCylinderObj,{"a": newCloudAlpha, "time": 1});
        }

//		FadeBetweenCameras ();
//		Enable the above method to re-add the fade 2d image backdrop on trigger enter.

		// Debug.Log("You hit a changeBackdrop trigger! " + other.gameObject);
		
		FadeCameraFarClipPlane (1);
		if (FogOnly == true) {SmoothFogFade (3);}
		if (ShouldUseOceanCamera == true) {enableOceanCamera(); SmoothFogFade (1);}
	}

	else if (other.gameObject.CompareTag ("changeBackdrop2")) { 
		// Debug.Log("You hit an alt changeBackdrop trigger!");
		FadeCameraFarClipPlane (2);
		if (FogOnly == true) {SmoothFogFade (2);}
		if (ShouldUseOceanCamera == true) {enableOceanCamera(); SmoothFogFade (2);}
	}
	
}

function OnTriggerExit (other : Collider) {
    if (other.gameObject.CompareTag ("changeBackdrop") && cloudCylinderObj &&
        ShouldChangeBackdrop == true && closePlaneRenderer)  {
            closePlaneRenderer.materials = [origMat];
        
        // Restore old clouds alpha on death:
        if ((ShouldChangeBackdrop || oceanLevel) && cloudOriginalMaterial) {
            iTween.ColorTo(cloudCylinderObj,{"a": startingCloudAlpha, "time": .5});
        }
    }
}

function changeCameraFadeLayer() {
    var cameraFadeObject : GameObject = GameObject.Find ("iTween Camera Fade");
    if (cameraFadeObject) {cameraFadeObject.layer = 4;}
}

function FadeCameraFarClipPlane (type : int) {
    if (type == 2) {

    iTween.ValueTo ( gameObject,
        {
            "from" : cam.farClipPlane,
            "to" : farClipPlaneValue2,
            "onupdate" : "ChangeCameraFarClipPlane",
            "time" : farClipPlaneFadeTime2,
            "easetype" : "easeInExpo"
       });
 	}
 	else {
 		    iTween.ValueTo ( gameObject,
        {
            "from" : cam.farClipPlane,
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
	} else if (type == 2) {
    iTween.ValueTo ( gameObject,
        {
            "from" : FallingPlayer.startingFogEndDistance,
            "to" : fogEndValue,
            "onupdate" : "ChangeFogEndDistance",
            "time" : 3,
            "easetype" : "easeInExpo"
//			"oncomplete" : "CameraFadeEnd"
       });
	} else if (type == 3) {
        // Effectively zeroes out fog via gentler distance dispersal.
        // Assumes that fogEndValue is large enough that halving it 
        // will still place the fog start far from the camera.
        var fogStartType3 : float = fogEndValue * .5;
        
        iTween.ValueTo ( gameObject,
        {
            "from" : FallingPlayer.startingFogStartDistance,
            "to" : fogStartType3,
            "onupdate" : "ChangeFogStartDistance",
            "time" : 3,
            "easetype" : "easeInExpo"
       });
        iTween.ValueTo ( gameObject,
        {
            "from" : FallingPlayer.startingFogEndDistance,
            "to" : fogEndValue,
            "onupdate" : "ChangeFogEndDistance",
            "time" : 3,
            "easetype" : "easeInExpo"
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
}

function ChangeFogStartDistance (i : int) {
    RenderSettings.fogStartDistance = i;
}

function ChangeCameraFarClipPlane (i : int) {
	cam.farClipPlane = i;
}

function enableOceanCamera () {
	oceanCamera.GetComponent(Camera).enabled = true;
	oceanRenderer.enabled = true;
	cloudRenderer.enabled = true;
	endSphereRenderer.enabled = true;
}