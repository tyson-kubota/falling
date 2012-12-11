var bounce : float = 1.0;
var Player : Transform;
 var dir : Vector3 = Vector3.zero;

function OnCollisionEnter (other : Collision) {
    bounce = 1.0;
    if(other.gameObject.tag == "Ground")
        //bounce = 190.0;
        bounce = Mathf.Abs((Input.acceleration.y)*100000);
         //Debug.Log("Hit something!" + other.contacts[0].normal + bounce);
         
          // + dir.x + dir.z + Input.acceleration.x);

    if(other.gameObject.tag == "Rubber")
        bounce = 5.0;
    if(other.gameObject.tag == "Spike")
        bounce = 0.0;// player is dead
}


function Update ()
{
    if(bounce>1.0)
        Player.rigidbody.velocity.y = bounce;
    bounce = 1.0;
}

