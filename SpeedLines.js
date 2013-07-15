#pragma strict

//public var launchTexture : Texture2D;
var peakValue : float;
var speedLinesRenderer : Renderer;
var speedLinesMaterial : Material;
var speedLinesAudio1 : AudioSource;
var speedLinesAudio2 : AudioSource;

function Start () {
	speedLinesRenderer = renderer;
	speedLinesMaterial = renderer.material;
	peakValue = renderer.material.color.a;
	speedLinesMaterial.color.a = 0.0;
	speedLinesRenderer.enabled = false;
}

function FadeFlash (timer : float, fadeType : FadeDir) {

    var start = fadeType == FadeDir.In? 0.0 : peakValue;
    var end = fadeType == FadeDir.In? peakValue : 0.0;
    var i = 0.0;
    var step = 1.0/timer;

    while (i <= 1.0) {
        i += step * Time.deltaTime;
        speedLinesMaterial.color.a = Mathf.Lerp(start, end, i);
        yield;
    }
}

function LinesFlash (timer : float, fadeType : FadeDir) {

    var start = fadeType == FadeDir.In? speedLinesMaterial.color.a : peakValue;
    var end = fadeType == FadeDir.In? peakValue : 0.0;
    var audioStart = speedLinesAudio2.volume;
    var audioEnd = .7; 
    var i = 0.0;
    var step = 1.0/timer;
	
	speedLinesRenderer.enabled = true;
// if (controllerITween2.speedingUp == 2) {
// if ((controllerITween2.speedingUp == 2) && (controllerITween2.Slowdown < 1)) {

    if (i == 0.0) {
    	if (speedLinesAudio1) {speedLinesAudio1.Play();}
    	if (speedLinesAudio2) {speedLinesAudio2.Play();}
    }
    
    while (i <= 1.0) { 
        i += step * Time.deltaTime;
        speedLinesMaterial.color.a = Mathf.Lerp(start, end, i);
        speedLinesAudio2.volume = Mathf.SmoothStep(audioStart, audioEnd, i);        
        yield;
                
        if (MoveController.Slowdown < 1) {break;}
    	}
    yield WaitForSeconds (timer);
    MoveController.speedingUp = 1; 
//    }
 
}

function LinesFlashOut (timer : float, fadeType : FadeDir) {

    var start = fadeType == FadeDir.In? 0.0 : peakValue;
    var end = fadeType == FadeDir.In? speedLinesMaterial.color.a : 0.0;
    var audioStart = speedLinesAudio2.volume;
    var audioEnd = 0.0;    
    var i = 0.0;
    var step = 1.0/timer;
 
    if (MoveController.speedingUp == 0) { 
 	while (i <= 1.0) {
        i += step * Time.deltaTime;
        speedLinesMaterial.color.a = Mathf.Lerp(end, start, i);
        speedLinesAudio2.volume = Mathf.SmoothStep(audioStart, audioEnd, i);
        yield;

        if (MoveController.Slowdown > 1) {speedLinesRenderer.enabled = true; break;}
        if (i >= 1.0) {speedLinesRenderer.enabled = false;} 
    	}
    yield WaitForSeconds (timer/3);
    MoveController.speedingUp = 1;
    //yield WaitForSeconds (timer*(2/3));
    //if (speedLinesAudio2) {speedLinesAudio2.Stop();}
    }
}

function LinesOff () {
        speedLinesMaterial.color.a = 0;
        speedLinesRenderer.enabled = false;
        //speedLinesAudio2.Stop();
        speedLinesAudio2.volume = 0;
}