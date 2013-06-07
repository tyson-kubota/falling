public var force:float = 1.0;
public var simulateAccelerometer:boolean = false;
public var touchedBy:boolean = false;
var dir : Vector3 = Vector3.zero;
var endPoint = 0.0; 
var touch : Touch;
var fingerCount = 0;

private var myTransform : Transform;
private var startTime : float; 
private var timeTapEnded : float; 
private var timeAtTap : float; 
private var timeVar : float; 
static var Slowdown : int = 0;
var speed = 2.4;
static var isSlowing:boolean = false;
static var speedingUp:int = 1;

var mainCamera : GameObject;
var myPitch : float;
var script : ScoreController;
script = GetComponent("ScoreController");

var SpeedLinesTexture : GameObject;

var SpeedLinesTextureScript : GUITextureLaunch;
SpeedLinesTextureScript = SpeedLinesTexture.GetComponent("GUITextureLaunch");

function Awake() {
	myTransform = transform;
}


function Start() {

//	Screen.sleepTimeout = 0.0f;
//	deprecated, now should use NeverSleep
	Screen.sleepTimeout = SleepTimeout.NeverSleep;
    startTime = Time.time; 
	Slowdown = FallingLaunch.levelEndSlowdown;
	lerpSlowdown(.5);
	
	mainCamera = transform.FindChild("Camera").gameObject;
}

function FixedUpdate () {
	var dir : Vector3 = Vector3.zero;
		
//	if (simulateAccelerometer)
//	{
		// using joystick input instead of iPhone accelerometer
//		dir.x = Input.GetAxis("Horizontal");
//		dir.z = Input.GetAxis("Vertical");
//	}
//	else

		// we assume that device is held parallel to the ground
		// and Home button is in the right hand
		
		// remap device acceleration axis to game coordinates
		// 1) XY plane of the device is mapped onto XZ plane
		// 2) rotated 90 degrees around Y axis
 //		 dir.x = -Input.acceleration.y;
//		 dir.z = Input.acceleration.x;

//		 print("Your X and Z accel are: " + dir.x + ", " + dir.z);

		// clamp acceleration vector to unit sphere
//		if (dir.sqrMagnitude > 1)
//			dir.Normalize();

if (FallingPlayer.isAlive == 1) {
	dir.x = 2 * FallingPlayer.isAlive * FallingLaunch.flipMultiplier * -((Input.acceleration.y) * Mathf.Abs(Input.acceleration.y));
	dir.z = 2 * FallingPlayer.isAlive * FallingLaunch.flipMultiplier * ((Input.acceleration.x) * Mathf.Abs(Input.acceleration.x));

	// Make it move 10 meters per second instead of 10 meters per frame...
	// .:. not necessary in fixedupdate
    // dir *= Time.deltaTime;
    // print("Your dir is: " + dir);     
    
    myTransform.Translate (dir * speed);
}
else {dir = Vector3.zero;}

}

function SmoothSlowdown () {

	isSlowing = true;    
    iTween.ValueTo ( gameObject,
        {
            "from" : 18000,
            "to" : 0,
            "onupdate" : "ChangeSpeed",
            "time" : 1,
            "easetype": "easeOutExpo",
            "oncomplete": "ResumeSpeed"
       }
    );

}

function ChangeSpeed ( i : int ) {
Slowdown = i;
//	Debug.Log("Your current speed score is " + ScoreController.visibleScore);
}

function ResumeSpeed () {
isSlowing = false;
}

function Update () {
	fallingSpeed();
//	Debug.Log("Slowdown = " + Slowdown);
}

// I also tried moving fallingSpeed function to fixedUpdate, but it actually made the game slower,
// since iOS is usually 30fps and fixedUpdate needs to run at 50fps (0.02 fixed timestep) for
// decent collision detection.

function fallingSpeed () {

fingerCount = 0;
	
	if (FallingPlayer.isAlive == 1) {
	    for (touch in Input.touches) {
	    	if (touch.phase != TouchPhase.Ended && touch.phase != TouchPhase.Canceled) {
	    		fingerCount++;
	    	}
		}
			
		if (fingerCount > 1) { 	
			//speedUp();
			if (Slowdown < 1) {speedingUp = 2; Slowdown = 18000; speedsUp();}
			//if (Slowdown < 1) 
			//{speedingUp = 2; speedsUp(); Slowdown = 18000; }
			
		}
	    else if (fingerCount < 2) {
	//    	slowDown();
			//if (Slowdown > 0) {speedDown(); yield;}
			//Slowdown = 0;
			if (Slowdown > 0) { speedingUp = 0; speedsUp(); lerpSlowdown(.5); }
			//else if (Slowdown > 0) {speedingUp = 0; speedsUp(); }
	    }
	}

	else {
	Slowdown = 0;
	speedingUp = 1;
	SpeedLinesTextureScript.LinesOff();
	mainCamera.audio.pitch = 1;
	dir = Vector3.zero;
	FallingPlayer.UIscriptComponent.hideThreatBar(0.1);
	}

//  Debug.Log("Slowdown = " + Slowdown + ", speedingUp = " + speedingUp );
//	Debug.Log("You have " + fingerCount + " fingers touching the screen." );
constantForce.relativeForce = (Vector3.down * Slowdown);
}

function speedsUp () {
		if (speedingUp == 2) {
		speedingUp = 1;
		SpeedLinesTextureScript.LinesFlash (0.25, FadeDir.In);
		FallingPlayer.UIscriptComponent.showThreatBar(1);
		if (mainCamera.audio) {lerpPitchUp(.5, 2);}
		}
		else {
		SpeedLinesTextureScript.LinesFlashOut (0.75, FadeDir.In);
		FallingPlayer.UIscriptComponent.hideThreatBar(.5);
		if (mainCamera.audio) {lerpPitchDown(1, 1);}
}		
}

function speedUp () {
		Slowdown = 18000;        
		Camera.main.SendMessage("speedLinesUp");
//		SendMessage is slow; rephrase if I ever use this speedUp method again.

//		UIscriptComponent.speedLinesNow();		

//		if (speedingUp == true) {
//		SpeedLinesTextureScript.FadeFlash (0.25, FadeDir.In);
//		yield WaitForSeconds(.25);}
//		else {
//		SpeedLinesTextureScript.FadeFlash (0.5, FadeDir.Out);
//		yield WaitForSeconds(.5);}
}

function speedDown () {
		Slowdown = 0;
		SpeedLinesTextureScript.LinesFlash (1.0, FadeDir.Out);
		yield WaitForSeconds(1.0);
}

function slowDown () {
    if ((Slowdown > 0) && (isSlowing == false)) {
		SmoothSlowdown (); 
	    }
	    else {Slowdown = 0;}
//	the above Slowdown = 0 statement breaks the tweened slowdown, but prevents a nasty bug where newly-loaded levels don't slow properly 
//	    else { Camera.main.SendMessage("speedLinesDown"); }
}

function lerpSlowdown (timer : float) {

    var start = Slowdown;
    var end = 0.0;
    var i = 0.0;
    var step = 1.0/timer;
 
    while (i <= 1.0) { 
        i += step * Time.deltaTime;
        Slowdown = Mathf.Lerp(start, end, i);
        yield;
        
        if (Slowdown > 17999) {break;}
    	}
    yield WaitForSeconds (timer);
    //speedingUp = 1; 
 
}

function lerpPitchUp (timer : float, endPitch : float) {

    var start = mainCamera.audio.pitch;
    var end = endPitch;
    var i = 0.0;
    var step = 1.0/timer;
 

    while (i <= 1.0) { 
        i += step * Time.deltaTime;
        mainCamera.audio.pitch = Mathf.Lerp(start, end, i);
        yield;
        
        if (Slowdown < 1) {break;}
    	}
    yield WaitForSeconds (timer);
}

function lerpPitchDown (timer : float, endPitch : float) {

    var start = mainCamera.audio.pitch;
    var end = endPitch;
    var i = 0.0;
    var step = 1.0/timer;
 

    while (i <= 1.0) { 
        i += step * Time.deltaTime;
        mainCamera.audio.pitch = Mathf.Lerp(start, end, i);
        yield;

        if (Slowdown > 17999) {break;}        
    	}
    yield WaitForSeconds (timer);
}

function SpeedLinesOff (timer : float) {
	SpeedLinesTextureScript.FadeOut (timer);
	yield WaitForSeconds(timer);
	SpeedLinesTextureScript.LinesOff();
}