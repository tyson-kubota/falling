#pragma strict 

 public var force:float = 1.0;
 var dir : Vector3 = Vector3.zero;
 public var touchingSomething:boolean = false;

private var isLoading = false;
var levelToLoad : String = "scene-helix";
var levelToLoad2 : String = "scene-bluesky";
var levelToLoad3 : String = "falling-column-space";
var levelToLoad4 : String = "scene-bluesky";

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
	GetComponent.<Collider>().attachedRigidbody.transform.Translate(respawnPosition);
	// Relocate the player. We need to do this or the camera will keep trying to focus on the (invisible) player where he's standing on top of the FalloutDeath box collider.
	transform.position = respawnPosition; // + Vector3.up;
	  	  	Camera.main.SendMessage("fadeIn");
 }
	   	
function Awake () {
    // Make the game run as fast as possible in the web player
//    Application.targetFrameRate = 60;
    Time.timeScale = 1.0;
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
	  gameObject.SendMessage ("IncrementScore", 10);
//	  if (audio)
//	  	{
//	  	audio.Play();
//	  	}
	  }

  if (other.gameObject.CompareTag ("CloudLevelSelect")){
  	isLoading = true;
    Camera.main.SendMessage("fadeOut");
  	  	  	yield WaitForSeconds(1);

  	Application.LoadLevel(levelToLoad);
	}

  if (other.gameObject.CompareTag ("SunsetLevelSelect")){
        isLoading = true;
  	  	Camera.main.SendMessage("fadeOut"); 
  	  	  	yield WaitForSeconds(1);

  	Application.LoadLevel(levelToLoad2);
  }

  if (other.gameObject.CompareTag ("SpaceLevelSelect")){
        isLoading = true;
        Camera.main.SendMessage("fadeOut"); 
            yield WaitForSeconds(1);

    Application.LoadLevel(levelToLoad3);
  }

  if (other.gameObject.CompareTag ("SkyLevelSelect")){
        isLoading = true;
        Camera.main.SendMessage("fadeOut"); 
            yield WaitForSeconds(1);

    Application.LoadLevel(levelToLoad4);
  }
  
}

function OnGUI() {
if (isLoading) {
GUI.Label ( Rect( (Screen.width/2)-110, (Screen.height / 2) - 60, 400, 70), "Loading...", "mainMenuTitle"); }
}

@script AddComponentMenu("Scripts/FallingPlayerStart")