#pragma strict
var solidDistance: float = 5.0; // max distance to be 100% solid
var other : Transform;

function Start () {

}

function Update () {

var dist = Vector3.Distance(transform.position, other.position);
if (dist < solidDistance) dist = solidDistance;
renderer.material.color.a = solidDistance / dist;
}