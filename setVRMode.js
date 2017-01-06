#pragma strict

function Start () {
    // NOTE: Would be best to perform these lookups elsewhere, but
    // due to JS/C# interactions and compilation order it's less feasible.
    // http://answers.unity3d.com/questions/507580/bce0019-enabled-is-not-a-member-of-unityenginecomp-3.html
    var VRViewer = GetComponent("GvrViewer");
    
    if (FallingLaunch.isVRMode && VRViewer) {
        (VRViewer as MonoBehaviour).enabled = true; // type coersion required to access 'enabled'
    }

    if (!FallingLaunch.isVRMode) {
        gameObject.SetActive(false); // disable our own gameObject to stop blank viewer from rendering        
    }
}

function Update () {
	
}
