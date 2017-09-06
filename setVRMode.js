#pragma strict

var GvrViewerMainObject : GameObject;

// should be a prefab tilted 90 degrees in X axis, so the user faces forward in headset:
var cameraVRParentPrefab : GameObject;
private var cameraVRParent : GameObject;

var cameraObj : GameObject;
private var VRViewerComponent : Component;
// var VRViewer : GvrViewer;
private var hasCentered : boolean = false;

function Awake () {
    if (!cameraObj) {cameraObj = transform.FindChild("Camera").gameObject;}
}

function Start () {
    // NOTE: Would be best to perform these lookups elsewhere, but
    // due to JS/C# interactions and compilation order it's less feasible.
    // http://answers.unity3d.com/questions/507580/bce0019-enabled-is-not-a-member-of-unityenginecomp-3.html
    // Also better to use a type below, not a string, but it's necessary due to C# + JS:
    // https://docs.unity3d.com/ScriptReference/Component.GetComponent.html
    VRViewerComponent = GvrViewerMainObject.GetComponent("GvrViewer");

    if (FallingLaunch.isVRMode && VRViewerComponent) {
        (VRViewerComponent as MonoBehaviour).enabled = true; // type coercion required to access 'enabled'
        (VRViewerComponent as GvrViewer).VRModeEnabled = true;
        // Re-parent camera for 90deg tilt offset (so player can look forward in VR):
        cameraVRParent = 
            Instantiate(cameraVRParentPrefab);

        // Make the camera-VR-parent object (post-instantiation) a child of this (player) gameObject transform,
        // then make the Camera (cameraObj) a child of the camera-VR-parent object:
        cameraVRParent.transform.SetParent(transform);
        cameraObj.transform.SetParent(cameraVRParent.transform);
        
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