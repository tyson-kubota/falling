#pragma strict

var thisImage : UnityEngine.UI.Image;
var loadingCircleVR : UnityEngine.UI.Image;
var loadingCircleVRObj : GameObject;

// private var thisImageMatl : Material;
var fullColor: Color = Color32(255, 255, 255, 165);
var emptyColor: Color = Color.red; // Color32(156, 24, 24, 255);
private var lifePercentage : float = 1;

private var peakOpacity : float = 1.0;

private var isVisible : boolean = false;

function Awake() {
    peakOpacity = fullColor.a;
}

function Start() {
    if ( FallingLaunch.isVRMode && (!loadingCircleVR || !loadingCircleVRObj) ) {
        loadingCircleVRObj = GameObject.Find("loading-bar");

        var loadingObjTransform : Transform =
            loadingCircleVRObj ? loadingCircleVRObj.transform : null;

        loadingCircleVR = // loadingCircleVR ||
            loadingObjTransform ? loadingObjTransform.GetComponent.<UnityEngine.UI.Image>() : null;
    }

    if (FallingLaunch.isVRMode && loadingCircleVR) {
        HideLoadingCircle();
    }
}

function FadeReticle(timer : float, fadeType : FadeDir) {

    var start = fadeType == FadeDir.In ? 0.0 : peakOpacity;
    var end = fadeType == FadeDir.In ? peakOpacity : 0.0;
    var i = 0.0;
    var step = 1.0/timer;

    while (i <= 1.0) {
        i += step * Time.deltaTime;
        thisImage.color.a = Mathf.Lerp(start, end, i);
        // If you want to also change the color of the reticle center, modify the material
        // instead of Sprite color, via:
        // thisImageMatl.color.a = Mathf.Lerp(start, end, i);

        // Debug.Log('fading with fadeType ' + fadeType + ' and alpha ' + thisImageMatl.color.a);
        yield;
    }
}

function FadeReticleIn (timer : float) {
    isVisible = true;
    yield FadeReticle(timer, FadeDir.In);
}

function FadeReticleOut (timer : float) {
    yield FadeReticle(timer, FadeDir.Out);
    isVisible = false;
}

function UpdateLoadingCircle (value : float) {
    if (loadingCircleVRObj && loadingCircleVR) {
        if (!loadingCircleVRObj.activeInHierarchy) {
            loadingCircleVRObj.SetActive(true);
        }

        loadingCircleVR.color.a = 1.0;
        loadingCircleVR.fillAmount = value;
    }
}

function HideLoadingCircle () {
    if (loadingCircleVRObj && loadingCircleVR) {
        loadingCircleVR.color.a = 0;
        loadingCircleVRObj.SetActive(false);
    }
}

function Update () {
    // Deactivate the VR reticle and early return if we're not in VR mode.
    if (!FallingLaunch.isVRMode) {
        gameObject.SetActive(false);
        return;
    }

    if (FallingPlayer.isAlive == 1 && isVisible) {
        lifePercentage = parseFloat(ScoreController.visibleScore)/parseFloat(ScoreController.maxScore);
        thisImage.fillAmount = lifePercentage;

        // Fade reticle from white down to crimson once the player's life is below ~60%:
        // For a fancier squared-ratio lerp (starts at roughly 2/3 life ratio): (lifePercentage*lifePercentage)*2
        thisImage.color = Color.Lerp(emptyColor, fullColor, Mathf.Clamp(lifePercentage*2 - .2, 0.0, 1.0) );
    } else {
        thisImage.color.a = 0;
        // loadingCircleVR.color.a = 0;
    }
}
