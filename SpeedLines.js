#pragma strict

//public var launchTexture : Texture2D;
var peakValue : float;

function Start () {
	peakValue = renderer.material.color.a;
	renderer.material.color.a = 0.0;
}

function FadeFlash (timer : float, fadeType : FadeDir) {

    var start = fadeType == FadeDir.In? 0.0 : peakValue;
    var end = fadeType == FadeDir.In? peakValue : 0.0;
    var i = 0.0;
    var step = 1.0/timer;

    while (i <= 1.0) {
        i += step * Time.deltaTime;
        renderer.material.color.a = Mathf.Lerp(start, end, i);
        yield;
    }
}

function LinesFlash (timer : float, fadeType : FadeDir) {

    var start = fadeType == FadeDir.In? renderer.material.color.a : peakValue;
    var end = fadeType == FadeDir.In? peakValue : 0.0;
    var i = 0.0;
    var step = 1.0/timer;
	
	renderer.enabled = true;
// if (controllerITween2.speedingUp == 2) {
// if ((controllerITween2.speedingUp == 2) && (controllerITween2.Slowdown < 1)) {
    while (i <= 1.0) { 
        i += step * Time.deltaTime;
        renderer.material.color.a = Mathf.Lerp(start, end, i);
        yield;
        
        if (MoveController.Slowdown < 1) {break;}
    	}
    yield WaitForSeconds (timer);
    MoveController.speedingUp = 1; 
//    }
 
}

function LinesFlashOut (timer : float, fadeType : FadeDir) {

    var start = fadeType == FadeDir.In? 0.0 : peakValue;
    var end = fadeType == FadeDir.In? renderer.material.color.a : 0.0;
    var i = 0.0;
    var step = 1.0/timer;
 
    if (MoveController.speedingUp == 0) { 
 	while (i <= 1.0) {
        i += step * Time.deltaTime;
        renderer.material.color.a = Mathf.Lerp(end, start, i);
        yield;

        if (MoveController.Slowdown > 1) {break; renderer.enabled = true;}
        if (i >= 1.0) {renderer.enabled = false;} 
    	}
    yield WaitForSeconds (timer/3);
    MoveController.speedingUp = 1;
    //yield WaitForSeconds (timer*(2/3));
    }
}

function LinesOff () {
        renderer.material.color.a = 0;
        renderer.enabled = false;
}