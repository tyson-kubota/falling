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

var oceanCamera : GameObject;
var oceanCameraVR : GameObject;
private var oceanCameraVRHead : GvrHead;

var backdropCamera : GameObject;
private var backdropCameraVRHead : GvrHead;

var oceanRenderer : Renderer;
var cloudRenderer : Renderer;

var eyeCamerasVR : Array;
var StereoControllerComponent : Component;

//var foo : Material; //set this in the editor
//var bar : Material; //set this in the editor
var oceanLevel : boolean = false;
var ShouldUseOceanCamera : boolean = false;
var ShouldChangeBackdrop : boolean = false;
var FogOnly : boolean = false;
var farClipPlaneValueOrig : int;
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

        var oceanCameraVRTransform : Transform = mainCamera.transform.FindChild("Camera-for-ocean-VR");
        oceanCameraVR = oceanCameraVRTransform ? oceanCameraVRTransform.gameObject : null;

        var backdropCameraTransform : Transform = transform.FindChild("Camera-for-backdrop");
        backdropCamera = backdropCameraTransform ? backdropCameraTransform.gameObject : null;

		oceanRenderer = gameObject.Find("sky-water-ocean/Mesh").GetComponent.<Renderer>();
		oceanRenderer.enabled = false;
		
		cloudRenderer = gameObject.Find("simple-cloud-plane/Mesh").GetComponent.<Renderer>();
		cloudRenderer.enabled = false;
	}
	
	cam = mainCamera.GetComponent.<Camera>();
    
    farClipPlaneValueOrig = cam.farClipPlane;

    // Warn re. plane-close/Cylinder if they haven't been manually associated via the Inspector:
    if (ShouldChangeBackdrop || oceanLevel) {
        if (!cloudCylinderObj && Debug.isDebugBuild) {
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

    // HACK: A coroutine to check for out-of-alignment sub-camera GvrHeads and fix them
    // (Ocean and Backdrop cameras). A more robust solution would be to ensure that
    // only one master GvrHead is applied to the scene at all, so we don't have to worry
    // about manging its rotation and inherited stereo cameras' values.
    if (FallingLaunch.isVRMode) {
        CheckAndFixSecondaryVRCameras(1.5);
    }
}

function Update () {
    // Existence check required for StereoControllerComponent in Update() 
    // since it takes 1+ seconds to set up everything via GVR plugin:
    if (FallingLaunch.isVRMode) {
        if (mainCamera && !StereoControllerComponent) {
            StereoControllerComponent = mainCamera.GetComponent.<StereoController>();
        }
    } else {
        return;
    }
}

function CheckAndFixSecondaryVRCameras (interval : float) {
    while (true && FallingLaunch.isVRMode) {
        yield WaitForSeconds(interval);
        MaintainOceanVRCamera();
        MaintainBackdropVRCamera();
    }
}

function MaintainBackdropVRCamera () {
    if (!backdropCameraVRHead) {
        if (backdropCamera.GetComponent.<GvrHead>()) {
            backdropCameraVRHead = backdropCamera.GetComponent.<GvrHead>();

            // this GvrHead is already nested within the Player object,
            // and the backdrop is meant to be static relative to the player, 
            // so therefore shouldn't independently track rotation:
            backdropCameraVRHead.trackRotation = false;
        }
    }    
}

function MaintainOceanVRCamera () {
    if (oceanLevel && oceanCameraVR && !oceanCameraVRHead) {
        if (oceanCameraVR.GetComponent.<GvrHead>()) {
            // See note in FallingPlayer.SetupVRUI() for explanation:
            // oceanCameraVRHead = oceanCameraVR.GetComponent.<StereoController>().Head;
            oceanCameraVRHead = oceanCameraVR.GetComponent.<GvrHead>();

            // this GvrHead is already nested within the Player camera's 
            // StereoController, so to stay aligned with its parent, 
            // it shouldn't independently track rotation:
            oceanCameraVRHead.trackRotation = false;
        }
    }
    
    // Unfortunately necessary, since any object with a GvrHead could potentially get
    // an out-of-whack rotation from player input for unknown causes,
    // which causes dependent stereo cameras to have a rotational offset that needs zeroing.
    // I thought it was caused by trackRotation ever being true (the default) after instantiation, 
    // but I've caught strange rotations in the Editor without the localRotation conditional 
    // ever logging as true... due to cached values persisting from GvrHead setup? 

    // To correct for the potential race condition, we check whether trackRotation ever becomes true
    // or if the ocean camera VR component's rotation is ever non-zero:
    if (oceanLevel && oceanCameraVR && oceanCameraVRHead) {
        if (oceanCameraVRHead.trackRotation || 
            oceanCameraVR.transform.localRotation != Quaternion.identity
        ) {
            if (Debug.isDebugBuild) {
                Debug.Log("oceanCameraVRHead.trackRotation value " + oceanCameraVRHead.trackRotation);
                Debug.Log("oceanCameraVR.localRotation value " + oceanCameraVR.transform.localRotation);
                Debug.Log("about to reset oceanCameraVR's rotation");
            }
            oceanCameraVR.transform.localRotation = Quaternion.identity;
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

		// Debug.Log("You hit a changeBackdrop trigger! " + other.gameObject);
		
		FadeCameraFarClipPlane (1);
		if (FogOnly == true) {SmoothFogFade (3);}
		if (ShouldUseOceanCamera) {
            if (FallingLaunch.isVRMode) {
                EnableOceanCamera(true);
            } else {
                EnableOceanCamera(false);
            }
            SmoothFogFade (1);
        }
	}

	else if (other.gameObject.CompareTag ("changeBackdrop2")) { 
		// Debug.Log("You hit an alt changeBackdrop trigger!");
        
		FadeCameraFarClipPlane (2);
		if (FogOnly == true) {SmoothFogFade (2);}
		if (ShouldUseOceanCamera) {
            if (FallingLaunch.isVRMode) {
                EnableOceanCamera(true);
            } else {
                EnableOceanCamera(false);
            }
            SmoothFogFade (2);
        }
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

// TODO: Switch iTween clip plane transitions to a regular lerp
function FadeCameraFarClipPlane (type : int) {
    if (Debug.isDebugBuild) {
        Debug.Log("calling FadeCameraFarClipPlane");
    }

    if (type == 2) {
        iTween.ValueTo ( gameObject,
            {
                "from" : cam.farClipPlane,
                "to" : farClipPlaneValue2,
                "onstart" : "EnableStereoUpdatesVR",
                "onupdate" : "ChangeCameraFarClipPlane",
                "oncomplete" : "YieldDisableStereoUpdatesVR",
                "time" : farClipPlaneFadeTime2,
                "easetype" : "easeInExpo"
           });
     	}
 	else {
 		    iTween.ValueTo ( gameObject,
        {
            "from" : cam.farClipPlane,
            "to" : farClipPlaneValue,
            "onstart" : "EnableStereoUpdatesVR",
            "onupdate" : "ChangeCameraFarClipPlane",
            "oncomplete" : "YieldDisableStereoUpdatesVR",
            "time" : farClipPlaneFadeTime,
            "easetype" : "easeInExpo"
       });
 	}   
}

function SmoothFogFade (type : int) {
    if (type == 1) {
        iTween.ValueTo ( gameObject,
            {
                "from" : FallingPlayer.startingFogEndDistance,
                "to" : fogEndValue,
                "onupdate" : "ChangeFogEndDistance",
                "time" : 3,
                "easetype" : "easeInExpo"
           });
    } else if (type == 2) {
        iTween.ValueTo ( gameObject,
            {
                "from" : FallingPlayer.startingFogEndDistance,
                "to" : fogEndValue2,
                "onupdate" : "ChangeFogEndDistance",
                "time" : farClipPlaneFadeTime2,
                "easetype" : "easeInExpo"
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

function ResetCameraClipPlane() {
    if (Debug.isDebugBuild) {
        Debug.Log("called ResetCameraClipPlane with current clip plane " + cam.farClipPlane);
        Debug.Log("...and farClipPlaneValueOrig " + farClipPlaneValueOrig);
    }

    // This function gets called on first level load (via LatestCheckpointRespawn),
    // so we only want to proceed if the current camera clip value doesn't match 
    // the specified starting value. This should avoid having more than one iTween lerp
    // occurring simultaneously and polluting each other.
    // TODO: Switch iTween to regular lerps
    if (FallingLaunch.isVRMode && farClipPlaneValueOrig != cam.farClipPlane) {
        
        if (Debug.isDebugBuild) {
            Debug.Log("resetting main VR camera clip plane to " + farClipPlaneValueOrig);
        }

        // Set the primary camera's draw distance (far clip plane), 
        // and enable the keepStereoUpdated boolean on the parent
        // stereo controller, so the child eye cameras will update to match.
        yield EnableStereoUpdatesVR(); 
        yield ResetFarClipPlane();
        yield DisableStereoUpdatesVR(); // Then disable `keepStereoUpdated` for performance

    } else if (cam && cam.farClipPlane != farClipPlaneValueOrig) {
        cam.farClipPlane = farClipPlaneValueOrig;
    }
}

// this gets yielded so we can be sure the new value is set before proceeding:
function ResetFarClipPlane() : IEnumerator {
    cam.farClipPlane = farClipPlaneValueOrig;
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

function EnableStereoUpdatesVR () {
    if (Debug.isDebugBuild) {
        Debug.Log("called EnableStereoUpdatesVR");
    }
    // Existence check required for StereoControllerComponent since 
    // it takes 1+ seconds to instantiate via GVR plugin:
    if (FallingLaunch.isVRMode && StereoControllerComponent) {
        // Type coercion is required... details in setVRMode.Start():
        (StereoControllerComponent as StereoController).keepStereoUpdated = true;
        if (Debug.isDebugBuild) {
            Debug.Log("keepStereoUpdated is true");
        }
    }
    yield;
}

// needed because iTween can't directly call a function that yields;
function YieldDisableStereoUpdatesVR () {
    yield DisableStereoUpdatesVR();
}

function DisableStereoUpdatesVR () {
    if (Debug.isDebugBuild) {
        Debug.Log("DisableStereoUpdatesVR");
    }
    // Existence check required for StereoControllerComponent since 
    // it takes 1+ seconds to instantiate via GVR plugin:
    if (FallingLaunch.isVRMode && StereoControllerComponent) {
        // Just to make sure the below parent camera alterations
        // actually propagate to the relevant stereo cameras:
        if ((StereoControllerComponent as StereoController).keepStereoUpdated == false) {
            (StereoControllerComponent as StereoController).keepStereoUpdated = true;
        }

        eyeCamerasVR = getMainChildVRCameras(mainCamera);

        for (var camera : Camera in eyeCamerasVR) {
            if (Debug.isDebugBuild) {
                Debug.Log("Setting camera " + camera + "'s farClipPlane to " + cam.farClipPlane);
            }
            camera.farClipPlane = cam.farClipPlane;
        }

        // it takes at least one frame for the GVR plugin to update the relevant cameras 
        // based on the keepStereoUpdated boolean, so this assumes at least 2fps:
        
        // ...or handle StereoController existence check via a coroutine/callback?
        yield WaitForSeconds(.5);
        // Type coercion is required... details in setVRMode.Start():
        (StereoControllerComponent as StereoController).keepStereoUpdated = false;
    }
    return;
}

function EnableOceanCamera (isVR: boolean) {
    if (!isVR) {
	   oceanCamera.GetComponent(Camera).enabled = true;
    }

	oceanRenderer.enabled = true;
}


function getMainChildVRCameras(obj : GameObject) : Array{
    var children : Array = new Array();
    for (var child : Transform in obj.transform) {
        var eyeCam = child.GetComponent.<Camera>();
        if (Debug.isDebugBuild) {
            Debug.Log("eyeCam is " + eyeCam);
            Debug.Log("with name " + child.gameObject.name);
        }
        
        // HACK: Brittle attempt to filter by camera name to include only 'main' child cameras,
        // and not those of VR UI, Ocean, or Backdrop cameras.
        if (eyeCam && (child.gameObject.name == 'Camera Left' || child.gameObject.name == 'Camera Right')) {
            if (Debug.isDebugBuild) {
                Debug.Log("Adding this eyeCam to results: " + eyeCam);
            }
            children.Add(eyeCam);
        }
    }
    return children;
}