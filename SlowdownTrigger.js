  // Applies an upwards force to all rigidbodies that enter the trigger.


function OnTriggerStay (other : Collider) {
    if (other.attachedRigidbody) {
//        other.attachedRigidbody.AddForce(Vector3.up * 30);
var speed = other.attachedRigidbody.gameObject.transform.rigidbody.velocity.magnitude;
other.attachedRigidbody.AddForce(Vector3.up * (speed/4));
   //    var speed = rigidbody.velocity.magnitude;
//Debug.Log (other.attachedRigidbody.gameObject.transform.rigidbody.velocity.magnitude);
//Debug.Log (speed);
    }
}


function OnTriggerExit (other : Collider) {
Debug.Log ("you are out");
}