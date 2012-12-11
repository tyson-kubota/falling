#pragma strict

var startobject : GameObject;
var endobject : GameObject;
var	width : float;
var cylinderParent : GameObject; 

function Start () {

}

function Update () {
    UpdateCylinderBetweenPoints(transform.position, transform.position, width);
}


function UpdateCylinderBetweenPoints(start : Vector3, end : Vector3, width)
{
	transform.position = Vector3(0, 0, 0);
}