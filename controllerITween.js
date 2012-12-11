public var force:float = 1.0;
public var simulateAccelerometer:boolean = false;
public var touchedBy:boolean = false;
// public var fingerCount:float = 0;
var dir : Vector3 = Vector3.zero;
var duration : float = 18000; 
var endPoint = 0.0; 
private var startPoint = 18000.0; 
private var startTime : float; 
private var timeSinceTap : float; 
private var timeAtTap : float; 
var Slowdown : int = 0;

function Start()
{
	// make landscape view
	iPhoneSettings.screenOrientation = iPhoneScreenOrientation.Landscape;
	Screen.sleepTimeout = 0.0f;
//	startPoint = transform.position; 
    startTime = Time.time; 
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
		

		
		// clamp acceleration vector to unit sphere
		if (dir.sqrMagnitude > 1)
			dir.Normalize();
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
function SmoothSlowdown () {

    iTween.ValueTo ( gameObject,
        {
            "from" : 18000,
            "to" : 0,
            "onupdate" : "ChangeSlowdown",
            "time" : 1,
            "easetype": "easeOutExpo"
        }
    );

}

function ChangeSlowdown ( i : int ) {
Slowdown = i;
}



function Update () {
var fingerCount = 0;

        for (var touch : Touch in Input.touches) {
        if (touch.phase != TouchPhase.Ended && touch.phase != TouchPhase.Canceled)
            fingerCount++;
            }
  
     		rigidbody.AddRelativeForce (Vector3.down * Slowdown); 

    
    if (fingerCount > 0)
        {
//        constantForce.relativeForce = Vector3.down * Slowdown;
//        rigidbody.AddRelativeForce (Vector3.down * Slowdown); 
        timeAtTap = Time.time;
//       print("User has " + fingerCount + " finger(s) touching the screen. Your touching slowdown is " + Slowdown);
		SmoothSlowdown ();
        }
    }
