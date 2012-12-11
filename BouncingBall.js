
#pragma strict
var firstTimeVelocitySave = false;
var savedVelocity : Vector3;
var myRigidbody : Rigidbody;
var BounceRate:float =1.5;

function OnCollisionEnter(col : Collision) {
//print("Collision! " + rigidbody.velocity);
if (! firstTimeVelocitySave) {
savedVelocity = rigidbody.velocity;
firstTimeVelocitySave = true;
}
myRigidbody.velocity.y = savedVelocity.y;
savedVelocity.y=savedVelocity.y/BounceRate;
}