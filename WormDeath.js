#pragma strict

function Start () {

}

function Update () {
    var hit : RaycastHit;
    if (Physics.Raycast (transform.position, Vector3.up, hit, 100)) {
        //Debug.Log(hit.distance);
        if (hit.rigidbody != null && FallingPlayer.isAlive == 1) { 
        Debug.Log(hit.distance);
        FallingPlayer.isAlive = 0; 
        GetComponent(FallingPlayer).DeathRespawn (); 
        }
    }
}