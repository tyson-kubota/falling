 var dir : Vector3 = Vector3.zero;


function OnCollisionEnter (collision : Collision) {
 Debug.Log("Hit something!" + collision.contacts[0].normal + dir.x + dir.z + Input.acceleration.x);
 Screen.sleepTimeout = 0.0f;
//    collider.attachedRigidbody.velocity.y *= damping;
    
    
// collider.attachedRigidbody.AddForce(dir * force);
 
// iPhoneUtils.Vibrate ();
// var relativeStartingPosition = transform.InverseTransformPoint(0, -500, 0);
 
// if (collision.gameObject.name == deadlyObjectName){
  if (collision.gameObject.CompareTag ("Death")){
  //collider.attachedRigidbody.transform.Translate(relativeStartingPosition, Space.World);
  
  	var respawnPosition = Respawn.currentRespawn.transform.position;
  	  	Camera.main.SendMessage("fadeOut");
  	yield WaitForSeconds(1);
	  gameObject.SendMessage ("ZeroScore", 1);
//	  gameObject.SendMessage ("DecrementScore");


//	Camera.main.transform.position = respawnPosition - (transform.forward * 4) + Vector3.up;	// reset camera too
	collider.attachedRigidbody.transform.Translate(respawnPosition);
	// Relocate the player. We need to do this or the camera will keep trying to focus on the (invisible) player where he's standing on top of the FalloutDeath box collider.
	transform.position = respawnPosition; // + Vector3.up;
	  	  	Camera.main.SendMessage("fadeIn");


 }
 }