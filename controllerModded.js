public var force:float = 1.0;
public var simulateAccelerometer:boolean = false;
public var touchedBy:boolean = false;
public var doBlah:boolean = false;
// public var fingerCount:float = 0;
var dir : Vector3 = Vector3.zero;
var duration : float = 18000; 
var endPoint = 0.0; 
private var startPoint = 18000.0; 
private var startTime : float; 
private var timeSinceTap : float; 
private var timeAtTap : float; 
private var timeTapEnded : float; 
var blah = Mathf.Lerp(startPoint, endPoint, (timeTapEnded - timeAtTap));

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

function Update () {
var fingerCount = 0;

        for (var touch : Touch in Input.touches) {
        if (touch.phase != TouchPhase.Ended && touch.phase != TouchPhase.Canceled)
            fingerCount++;
        }
  
 /* 
    
    if (fingerCount > 0)
        {
        print ("User has " + fingerCount + " finger(s) touching the screen");
        constantForce.relativeForce = Vector3.down * 18000; 
        timeAtTap = Time.time;
                    }
    else
    {
    timeSinceTap = (Time.time - timeAtTap);
    
   */


 for (var touch : Touch in Input.touches) {
 
 if (touch.phase == TouchPhase.Began)
 {
 timeAtTap = Time.time;
  }
  
 if (touch.phase == TouchPhase.Moved || touch.phase == TouchPhase.Stationary) 
 {
	constantForce.relativeForce = Vector3.down * 18000; 
	}
	
	if
	(touch.phase == TouchPhase.Ended)
	{
		timeTapEnded = Time.time;
		doBlah = true;
		print ("your blah is: " + blah + ", your timeAtTap is " + timeAtTap + " and your timeTapEnded is " + timeTapEnded);
		//timeSinceTap = (Time.time - timeAtTap);
	}


/*    var minimum = 18000;
    var maximum = 0.0;
	var blah = Mathf.Lerp(minimum, maximum, Time.deltaTime);
	constantForce.relativeForce = Vector3.down * blah;
	fingerCount = 0;
	
	*/
//	var blah = Mathf.Lerp(startPoint, endPoint, (Time.time - startTime) / duration);
//	var blah = Mathf.Lerp(startPoint, endPoint, (timeSinceTap - startTime));
	// / duration);
	
		
			
//	print ("your blah is: timeTapEnded " + timeTapEnded + " timeSinceTap " +  timeSinceTap + ", Time " + (Time.time - startTime) + " divided by duration " + duration + " = blah  " + blah + ", based on " + Vector3.down);

//constantForce.relativeForce = Vector3.down * blah;
 
//transform.position = Vector3.Lerp(startPoint, endPoint, (Time.time - startTime) / duration); 
}


    }
    
    if (doBlah == true)
    {
		while (blah > 1)
		{
		constantForce.relativeForce = Vector3.down * blah;
		}
}