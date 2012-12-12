public var force:float = 1.0;
public var simulateAccelerometer:boolean = false;
public var touchedBy:boolean = false;
//public var fingerCount:float = 0;
var dir : Vector3 = Vector3.zero;
var endPoint = 0.0; 
//private var startPoint = 18000.0; 
var touch : Touch;
var fingerCount = 0;

private var myTransform : Transform;
private var startTime : float; 
private var timeTapEnded : float; 
private var timeAtTap : float; 
private var timeVar : float; 
static var Slowdown : int = 0;
var speed = 10.0;
static var isSlowing:boolean = false;
static var landscapeFlipped:boolean = false;
var flipMultiplier : int = 1;

var script : ScoreController;
script = GetComponent("ScoreController");

function Awake() {
	myTransform = transform;
}


function Start() {
	// make landscape view
	// iPhoneSettings.screenOrientation = iPhoneScreenOrientation.Landscape;
	
	if (iPhoneInput.orientation == iPhoneOrientation.LandscapeRight) {
	Screen.orientation = ScreenOrientation.LandscapeRight;
	landscapeFlipped = true;
	flipMultiplier = -1;
	}
	else {	Screen.orientation = ScreenOrientation.LandscapeLeft;}

//	iPhoneSettings.screenOrientation = iPhoneScreenOrientation.LandscapeLeft;
		
	Screen.sleepTimeout = 0.0f;
//	startPoint = transform.position; 
    startTime = Time.time; 
//    Edit yo FPS here, fool!
//    Application.targetFrameRate = 60;

//		Loop();
//	Slowdown = 0;
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

	dir.x = 2 * flipMultiplier * -((Input.acceleration.y) * Mathf.Abs(Input.acceleration.y));
	dir.z = 2 * flipMultiplier * ((Input.acceleration.x) * Mathf.Abs(Input.acceleration.x));

	// Make it move 10 meters per second instead of 10 meters per frame...
    dir *= Time.deltaTime;
        
    // Move object
    myTransform.Translate (dir * speed);

//    constantForce.relativeForce = (Vector3.down * Slowdown); 
	Screen.sleepTimeout = 0.0f;
}

// Animate score changes using iTween's ValueTo
function SmoothSlowdown () {
//    Camera.main.SendMessage("speedLinesDown");   
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

function DrainingAway (delay : float) {
		if ((Slowdown > 17999) && (script.currentScore > 0) && (isSlowing == false)) {
	   		gameObject.SendMessage ("DecrementScore", .4);
	   		yield WaitForSeconds(delay);
	   		}
	   	else {
	   		yield 0;
	   		}
		}
	   	
 	
function Loop() {
    while (true) {
//        if ((Slowdown > 17999) && (isSlowing == false)){ 
        yield DrainingAway(.1);
    }
}


function Update () {
	fallingSpeed();
}

function fallingSpeed () {
   
fingerCount = 0;

    for (touch in Input.touches) {
    	if (touch.phase != TouchPhase.Ended && touch.phase != TouchPhase.Canceled) {
    		fingerCount++;
    	}
	}
		
	if (fingerCount > 1) { 	
		speedUp();
	}
    else if (fingerCount < 2) {
//    	slowDown();
		Slowdown = 0;
    }
 
//	Debug.Log("You have " + fingerCount + " fingers touching the screen." );
constantForce.relativeForce = (Vector3.down * Slowdown);
}

function speedUp () {
		Slowdown = 18000;        
		Camera.main.SendMessage("speedLinesUp");
}

function slowDown () {
    if ((Slowdown > 0) && (isSlowing == false)) {
		SmoothSlowdown (); 
	    }
	    else {Slowdown = 0;}
//	the above Slowdown = 0 statement breaks the tweened slowdown, but prevents a nasty bug where newly-loaded levels don't slow properly 
//	    else { Camera.main.SendMessage("speedLinesDown"); }
}