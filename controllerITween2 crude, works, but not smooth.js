public var force:float = 1.0;
public var simulateAccelerometer:boolean = false;
public var touchedBy:boolean = false;
// public var fingerCount:float = 0;
var dir : Vector3 = Vector3.zero;
var duration : float = 18000; 
var endPoint = 0.0; 
private var startPoint = 18000.0; 
private var startTime : float; 
private var timeTapEnded : float; 
private var timeAtTap : float; 
private var timeVar : float; 
var Slowdown : int = 0;
var speed = 10.0;
var Accel : int = 1;

function Start()
{
	// make landscape view
	iPhoneSettings.screenOrientation = iPhoneScreenOrientation.Landscape;
	Screen.sleepTimeout = 0.0f;
//	startPoint = transform.position; 
    startTime = Time.time; 
//    Edit yo FPS here, fool!
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

	//	if (touchingSomething)
	//	{
	// dir.z = Input.acceleration.x;
	// }
 
//	rigidbody.AddForce(dir * force);
	Screen.sleepTimeout = 0.0f;
}

/*
function OnCollisionEnter (collision : Collision) {
 Debug.Log("Hit something!" + collision.contacts[0].normal + dir.x + dir.z + Input.acceleration.x);
// dir = collision.contacts[0].normal;
 //   for (var contact : ContactPoint in collision.contacts) {
//  Debug.DrawLine(contact.point, contact.point + contact.normal, Color.green, 2);
  }      


  
// collider.attachedRigidbody.AddForce(dir * force);
*/ 


// Animate score changes using iTween's ValueTo
function SmoothSpeedup () {

    iTween.ValueTo ( gameObject,
        {
            "from" : 18000,
            "to" : 0,
            "onupdate" : "ChangeSpeed",
            "time" : 1.5,
            "easetype": "easeInExpo",
            "oncomplete": "ResumeAccel"
        }
    );

}

function ChangeSpeed ( i : int ) {
Slowdown = i;
}


function ResumeAccel () {
Accel = 1;
} 

function Update () {
var fingerCount = 0;

        for (var touch : Touch in Input.touches) {
        if (touch.phase != TouchPhase.Ended && touch.phase != TouchPhase.Canceled){
            fingerCount++;}
//            else
//            {Camera.main.SendMessage("speedLinesDown");
//            print(fingerCount);
//              }
            
//        if (touch.phase == TouchPhase.Began){
//            Camera.main.SendMessage("speedLinesUp");}
        //    	print("Speedlines Start");
//        if (fingerCount == 0) {
//  			Camera.main.SendMessage("speedLinesDown");}
//        	print(fingerCount);
//touch.phase == TouchPhase.Ended || touch.phase == TouchPhase.Canceled || 

/*
                     if (touch.phase == TouchPhase.Began)
 {
 timeAtTap = Time.time;
 timeTapEnded = 0;
  }
  	if (touch.phase == TouchPhase.Ended)
	{
		timeTapEnded = Time.time;
	}
		*/
		}		
		
//     		rigidbody.AddRelativeForce (Vector3.down * Slowdown); 
    constantForce.relativeForce = (Vector3.down * Slowdown); 
    
    if ((fingerCount > 0) && (Accel == 1))
        {
//        constantForce.relativeForce = Vector3.down * Slowdown;
//        rigidbody.AddRelativeForce (Vector3.down * Slowdown); 
//       print("User has " + fingerCount + " finger(s) touching the screen. Your touching slowdown is " + Slowdown + " and your timeVar is " + timeVar);
	SmoothSpeedup ();
	Accel = 0;
		Camera.main.SendMessage("speedLinesUp");
        }
    else if (fingerCount == 0)
        {Camera.main.SendMessage("speedLinesDown"); Accel = 1;}      
    }
