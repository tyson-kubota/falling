#pragma strict

var removeTime : float = 10.0;
var growAtLaunch : boolean = false;
var growTime : float = 7.0;
var ProjectileName : String = "Generic";

function Start () {
	Destroy(gameObject, removeTime);
	if (growAtLaunch == true) {growProjectile (growTime);}
}

// this is so fireballs that hit the player don't interfere with newly-spawned ones in the scene.
function OnCollisionEnter (collision : Collision) {
  if (collision.gameObject.CompareTag ("Player")) {
    
    // throw an analytics event!
    GameAnalyticsSDK.GameAnalytics.NewDesignEvent (
        "Projectile:Collision:" + ProjectileName,
        FallingLaunch.secondsAlive
    );

  	gameObject.GetComponent.<Rigidbody>().isKinematic = true;
  	
    Destroy(gameObject, 1);
  }
  
// but if one fireball hits another, destroy immediately.
  if (this.gameObject.layer == 17 && collision.gameObject.CompareTag ("Death")) {
	Destroy(gameObject, 0);
  }
}

function growProjectile (timer : float) {

//	transform.localScale += Vector3(0,0,0);

    var start = Vector3(0,0,0);
    var end = transform.localScale;
    var i = 0.0;
    var step = 1.0/timer;

    while (i <= 1.0) {
        i += step * Time.deltaTime;
        transform.localScale = Vector3.Lerp(start, end, i);
        yield;
    }
}
