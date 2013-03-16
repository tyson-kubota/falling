#pragma strict

//public var launchTexture : Texture2D;
var peakValue : float;

function Start () {
	transform.position = Vector3.zero;
	transform.localScale = Vector3.zero;
	guiTexture.pixelInset = Rect (0, 0, Screen.width, Screen.height);
	guiTexture.color.a = 0.0;
}

function FadeFlash (timer : float, fadeType : FadeDir) {

    var start = fadeType == FadeDir.In? 0.0 : peakValue;
    var end = fadeType == FadeDir.In? peakValue : 0.0;
    var i = 0.0;
    var step = 1.0/timer;

    while (i <= 1.0) {
        i += step * Time.deltaTime;
        guiTexture.color.a = Mathf.Lerp(start, end, i);
        yield;
    }
}

function LinesFlash (timer : float, fadeType : FadeDir) {

    var start = fadeType == FadeDir.In? guiTexture.color.a : peakValue;
    var end = fadeType == FadeDir.In? peakValue : 0.0;
    var i = 0.0;
    var step = 1.0/timer;
 
// if (controllerITween2.speedingUp == 2) {
// if ((controllerITween2.speedingUp == 2) && (controllerITween2.Slowdown < 1)) {
    while (i <= 1.0) { 
        i += step * Time.deltaTime;
        guiTexture.color.a = Mathf.Lerp(start, end, i);
        yield;
        
        if (controllerITween2.Slowdown < 1) {break;}
    	}
    yield WaitForSeconds (timer);
    controllerITween2.speedingUp = 1; 
//    }
 
}

function LinesFlashOut (timer : float, fadeType : FadeDir) {

    var start = fadeType == FadeDir.In? 0.0 : peakValue;
    var end = fadeType == FadeDir.In? peakValue : 0.0;
    var i = 0.0;
    var step = 1.0/timer;
 
    if (controllerITween2.speedingUp == 0) { 
 	while (i <= 1.0) {
        i += step * Time.deltaTime;
        guiTexture.color.a = Mathf.Lerp(end, start, i);
        yield;

        if (controllerITween2.Slowdown > 1) {break;}
    	}
    yield WaitForSeconds (timer/3);
    controllerITween2.speedingUp = 1; 
    }
}