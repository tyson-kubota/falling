#pragma strict

var removeTime : float = 10.0;

function Start () {
	Destroy(gameObject, removeTime);
}

// this is so fireballs that hit the player don't interfere with newly-spawned ones in the scene.
function OnCollisionEnter (collision : Collision) {
  if (collision.gameObject.CompareTag ("Player")) {
	Destroy(gameObject, 1);
  }
}