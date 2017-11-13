#pragma strict

var GvrViewerMainObject : GameObject;

// should be a prefab tilted 90 degrees in X axis, so the user faces forward in headset:
var cameraVRParentPrefab : GameObject;
private var cameraVRParent : GameObject;

var cameraObj : GameObject;

private var VRViewerComponent : Component;
// var VRViewer : GvrViewer;
private var hasCentered : boolean = false;

var VRUICameraVRTransform : Transform;
var oceanCameraVRTransform : Transform;

var VRUICameraObj : GameObject;
var VRUICamera : Camera;
private var VRUICameraVRHead : GvrHead;

var fogColor : Color;
var fogColorVR : Color;

function Awake () {
    if (!cameraObj) {cameraObj = transform.FindChild("Camera").gameObject;}
}

function Start () {

    // oceanCameraVRTransform = cameraObj.transform.FindChild("Camera-for-ocean-VR");
    // VRUICameraVRTransform = cameraObj.transform.FindChild("Camera-for-VR-UI");

    // VR UI Camera lives two levels down from the Player GameObject, 
    // inside the main parent Camera:

    oceanCameraVRTransform = cameraObj.transform.FindChild("Camera-for-ocean-VR");

    VRUICameraVRTransform = cameraObj.transform.FindChild("Camera-for-VR-UI");
    VRUICameraObj = VRUICameraVRTransform ? VRUICameraVRTransform.gameObject : null;
    VRUICamera = VRUICameraObj.GetComponent.<Camera>();

    // NOTE: Would be best to perform these lookups elsewhere, but
    // due to JS/C# interactions and compilation order it's less feasible.
    // http://answers.unity3d.com/questions/507580/bce0019-enabled-is-not-a-member-of-unityenginecomp-3.html
    // Also better to use a type below, not a string, but it's necessary due to C# + JS:
    // https://docs.unity3d.com/ScriptReference/Component.GetComponent.html
    VRViewerComponent = GvrViewerMainObject.GetComponent("GvrViewer");

    fogColor = RenderSettings.fogColor;

    if (FallingLaunch.isVRMode && VRViewerComponent) {

        // Clear is the Unity-default color:
        if (fogColorVR.ToString() != Color.clear.ToString()) {
            Debug.Log('fogColorVR.ToString is ' + fogColorVR.ToString() );
            Debug.Log('Color.clear.ToString is ' + Color.clear.ToString() );
            RenderSettings.fogColor = fogColorVR;
        }

        (VRViewerComponent as MonoBehaviour).enabled = true; // type coercion required to access 'enabled'
        (VRViewerComponent as GvrViewer).VRModeEnabled = true;
        // Re-parent camera for 90deg tilt offset (so player can look forward in VR):
        cameraVRParent = 
            Instantiate(cameraVRParentPrefab);

        // Make the camera-VR-parent object (post-instantiation) a child of this (Player) gameObject transform,
        // then make the Camera (cameraObj) a child of the camera-VR-parent object:
        cameraVRParent.transform.SetParent(transform);
        cameraObj.transform.SetParent(cameraVRParent.transform);
 
        // oceanCameraVR in particular seems to sometimes to adopt skewed rotation. 
        // (related to whether Player is tilted when the main VR camera object is re-parented?)
        // Consider manually forcing it and the UI camera to (0,0,0) post-reparenting, to be safe:
        if (oceanCameraVRTransform) {
            // Debug.Log("found oceanCameraVRTransform with rotation " + oceanCameraVRTransform.rotation);
            oceanCameraVRTransform.localRotation = Quaternion.identity;
        }

        if (VRUICameraVRTransform) {
            // Debug.Log("found VRUICameraVRTransform with rotation " + VRUICameraVRTransform.rotation);
            VRUICameraVRTransform.localRotation = Quaternion.identity;
        }

        // center cardboard view post-instantiation:
        // TODO: This recentering needs some kind of rotational offset to account for the parent head's 90-degree (we want to map 'forward' in cardboard to 'down' in world space)
        // if (!hasCentered) {
        //     VRViewer = GvrViewerMainObject.GetComponent.<GvrViewer>();
        //     VRViewer.Instance.Recenter();
        //     hasCentered = true;
        // }
    } else if (VRViewerComponent) {
        (VRViewerComponent as GvrViewer).VRModeEnabled = false;
    }

    if (!FallingLaunch.isVRMode) {
        GvrViewerMainObject.SetActive(false); // disable the GvrViewerMain gameObject to stop blank viewer from rendering
    }
}

function Update () {
    MaintainVRUI();
    // Early return if not in VR mode:
    // if (!FallingLaunch.isVRMode) {
    //     return;
    // } else 
    if (FallingLaunch.isVRMode) {
        if (VRViewerComponent) {
            // See note in Start() about unfortunate-but-required type coercion:
            if ( (VRViewerComponent as GvrViewer).BackButtonPressed ) {
                // When Cardboard SDK close icon / back button tapped, return home:
                FallingPlayer.isPausable = false;
                FallingLaunch.isVRMode = false;              
                FallingPlayer.UIscriptComponent.SaveCheckpointVR();
                FallingPlayer.UIscriptComponent.LoadHomeNow();
            } 
        }
    }

}


function MaintainVRUI () {
    // Existence check required for StereoControllerComponent in Update() 
    // since it takes 1+ seconds to set up everything via GVR plugin:
    if (!VRUICameraVRHead && VRUICameraObj && VRUICamera) {
        // Early return if we're not in VR mode and we've already disabled the VR UI camera:
        if (!FallingLaunch.isVRMode && VRUICamera.enabled == false) {
            return;
        }  

        if (FallingLaunch.isVRMode) {
            if (VRUICameraObj.GetComponent.<GvrHead>()) {        

                // This GvrHead is already nested within the Player object,
                // and the UI is meant to be static relative to the player, 
                // so therefore shouldn't independently track rotation.        

                // We use getComponent.<GvrHead> instead of the Google plugin's Head getter,
                // because the latter is not guaranteed to be located on this component. 
                // It could be a parent object's GvrHead, since the GvrHeads are applied at runtime 
                // by GVRViewer, which adds a StereoController to `Camera.allCameras`'s results array.
                // Then StereoController executes `AddStereoRig`, which only adds a new GvrHead if a 
                // component's parent is not presumed to have one. Otherwise, the parent GvrHead is used.        

                // If we just set `trackRotation` on StereoController.Head directly, we might be disabling
                // the parent (main) camera's ability to track with head movement, which is `no bueno.`

                // Keep VR UI aligned with parent gameObject, in case of drift via GvrHead
                // (currently, this gameObj doesn't get its own GvrHead, but the order of assignment 
                // is nondeterministic, constructed by looping through an array of Camera.allCameras).
                // Thus, the below is defensive code in case it does ever get its own GvrHead.
                if (Debug.isDebugBuild) {
                    Debug.Log("Found matching GvrHead for VRUICameraVRHead");
                }        

                VRUICameraVRHead = VRUICameraObj.GetComponent.<GvrHead>();
                VRUICameraVRHead.trackRotation = false;
            }
        } else if (!FallingLaunch.isVRMode && VRUICamera.enabled) {
            // Disable VR-specific UI camera if we're not in VR mode:
            VRUICamera.enabled = false;
        }
    }
}