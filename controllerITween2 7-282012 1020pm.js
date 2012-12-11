public var force:float = 1.0;
public var simulateAccelerometer:boolean = false;
public var touchedBy:boolean = false;
// public var fingerCount:float = 0;
var dir : Vector3 = Vector3.zero;
var endPoint = 0.0; 
//private var startPoint = 18000.0; 
private var startTime : float; 
private var timeTapEnded : float; 
private var timeAtTap : float; 
private var timeVar : float; 
var Slowdown : int = 0;
var speed = 10.0;

function Start()
{
	// make landscape view
	iPhoneSettings.screenOrientation = iPhoneScreenOrientation.Landscape;
	Screen.sleepTimeout = 0.0f;
//	startPoint = transform.position; 
    startTime = Time.time; 
//    Edit yo FPS here, fool!
//    Application.targetFrameRate = 60;
}

function FixedUpdate () {
	var dir : Vector3 = Vector3.zero;
		
	if (simulateAccelerometer)
	{
		// using joystick input instead of iPhone accelerometer
		dir.x = Input.GetAxis("Horizontal");
		dir.z = Input.GetAxis("Vertical");
	}
	else
	{
		// we assume that device is held parallel to the ground
		// and Home button is in the right hand
		
		// remap device acceleration axis to game coordinates
		// 1) XY plane of the device is mapped onto XZ plane
		// 2) rotated 90 degrees around Y axis
 		 dir.x = -Input.acceleration.y;
		 dir.z = Input.acceleration.x;
//		 print("Your X and Z accel are: " + dir.x + ", " + dir.z);

		// clamp acceleration vector to unit sphere
		if (dir.sqrMagnitude > 1)
			dir.Normalize();
			
			    // Make it move 10 meters per second instead of 10 meters per frame...
    dir *= Time.deltaTime;
        
    // Move object
    transform.Translate (dir * speed);
	}

//    constantForce.relativeForce = (Vector3.down * Slowdown); 
	Screen.sleepTimeout = 0.0f;
}



// Animate score changes using iTween's ValueTo
function SmoothSpeedup () {

    iTween.ValueTo ( gameObject,
        {
            "from" : Slowdown,
            "to" : 20000,
            "onupdate" : "ChangeSpeed",
            "time" : 1,
            "easetype": "easeOutExpo"
        }
    );

}

function SmoothSlowdown () {

    iTween.ValueTo ( gameObject,
        {
            "from" : Slowdown,
            "to" : 0,
            "onupdate" : "ChangeSpeed",
            "time" : 1,
            "easetype": "easeOutCirc"
        }
    );

}

function ChangeSpeed ( i : int ) {
Slowdown = i;
//constantForce.relativeForce = (Vector3.down * i);
}

function Update () {
var fingerCount = 0;

        for (var touch : Touch in Input.touches) {

//if (touch.phase == TouchPhase.Began){
//SmoothSpeedup ();
//accelerationState = 1;
//}

//if ((touch.phase == TouchPhase.Ended) || (touch.phase == TouchPhase.Canceled)){
//SmoothSlowdown ();
//}        		        
        if (touch.phase != TouchPhase.Ended && touch.phase != TouchPhase.Canceled){
            fingerCount++;}
		}		
		

	if ((fingerCount > 0))
        { 	
		Camera.main.SendMessage("speedLinesUp");
		SmoothSpeedup ();
		}
        
    else if ((fingerCount == 0) && (Slowdown > 0) && (Slowdown < 21000))
        {
        Camera.main.SendMessage("speedLinesDown");   
       	SmoothSlowdown ();
	    }
	   
//	rigidbody.AddRelativeForce (Vector3.down * Slowdown); 

constantForce.relativeForce = (Vector3.down * Slowdown); 	
	//     	rigidbody.AddRelativeForce (Vector3.down * Slowdown); 

    //    constantForce.relativeForce = (Vector3.down * Slowdown); 
    
}
