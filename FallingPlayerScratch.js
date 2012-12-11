#pragma strict 

 public var force:float = 1.0;
 var dir : Vector3 = Vector3.zero;
 public var touchingSomething:boolean = false;


// Move object using accelerometer
var speed = 5.0;
var target : Transform;
var smooth = 2.0;
var tiltAngle = 30.0;

var script : ScoreController;
script = GetComponent("ScoreController");

static var isAlive : boolean;

function DeathRespawn () {
   	var respawnPosition = Respawn.currentRespawn.transform.position;
  	Camera.main.SendMessage("fadeOut");
  	isAlive = true;
    gameObject.SendMessage ("ResetScore", 0);
  	yield WaitForSeconds(1);
//	  gameObject.SendMessage ("DecrementScore");
//	  gameObject.SendMessage ("ZeroScore", 1);

//	Camera.main.transform.position = respawnPosition - (transform.forward * 4) + Vector3.up;	// reset camera too
	collider.attachedRigidbody.transform.Translate(respawnPosition);
	// Relocate the player. We need to do this or the camera will keep trying to focus on the (invisible) player where he's standing on top of the FalloutDeath box collider.
	transform.position = respawnPosition; // + Vector3.up;
	  	  	Camera.main.SendMessage("fadeIn");
 }
	   	
	   	
function Update () {
    var dir : Vector3 = Vector3.zero;

    var tiltAroundZ = -Input.acceleration.y * tiltAngle;
    var tiltAroundX = -Input.acceleration.x * tiltAngle;
    var target = Quaternion.Euler (tiltAroundX, 0, tiltAroundZ);

                // Dampen towards the target rotation
    transform.rotation = Quaternion.Slerp(transform.rotation, target,
                                   Time.deltaTime * smooth);;  
                                //   Debug.Log(isAlive);     
// 	Debug.Log(script.currentScore);
	  }
	  
// private var speed : Vector3 = Vector3 (3, 0, 0);
// var startingPosition = (0, 129, 0);
var deadlyObjectName : String = "DeathByFire";
var initialRespawn : Respawn;	// set this to the initial respawn point for the level.
// var damping:float = 0.7; // is this necessary?

// textfield to hold the score and score variable
private var textfield:GUIText;
private var score:int;

public var simulateAccelerometer:boolean = false;

 
function OnCollisionEnter (collision : Collision) {
// Debug.Log("Hit something!" + collision.contacts[0].normal + dir.x + dir.z + Input.acceleration.x);
 Screen.sleepTimeout = 0.0f;
//    collider.attachedRigidbody.velocity.y *= damping;
    
    
// collider.attachedRigidbody.AddForce(dir * force);
 
// iPhoneUtils.Vibrate ();
// var relativeStartingPosition = transform.InverseTransformPoint(0, -500, 0);


	   	
// if (collision.gameObject.name == deadlyObjectName){
  if (collision.gameObject.CompareTag ("Death")) {
	DeathRespawn ();
  }
 

// if (collision.gameObject.layer == 8){
// collider.attachedRigidbody.transform.Translate(relativeStartingPosition);
 
// Destroy the projectile
//    Destroy (gameObject);
//if (relativeStartingPosition.y > 100)
//    Debug.Log("You've moved up more than 100 units");

}


// function FixedUpdate () {
//    rigidbody.MovePosition(rigidbody.position + speed * Time.deltaTime);}


function OnTriggerEnter (other : Collider) {
  if (other.gameObject.CompareTag ("Score")){ 
 //     Debug.Log("You scored!"); 
  	Camera.main.SendMessage("flashOut");
	  gameObject.SendMessage ("IncrementScore", 10);
	  if (audio)
	  	{
	  	audio.Play();
	  	}
	  }
	  yield WaitForSeconds(.2);
  	Camera.main.SendMessage("flashUp");

}



			
@script AddComponentMenu("Scripts/FallingPlayer")