#pragma strict

var removeTime : float = 10.0;

function Start () {
	Destroy(gameObject, removeTime);
}

// this is so fireballs that hit the player don't interfere with newly-spawned ones in the scene.
function OnCollisionEnter (collision : Collision) {
  if (collision.gameObject.CompareTag ("Player")) {
	rigidbody.isKinematic = true;
	Destroy(gameObject, 1);
  }
  
// but if one fireball hits another, destroy immediately.
  if (collision.gameObject.CompareTag ("Death")) {
	Destroy(gameObject, 0);
  }
}