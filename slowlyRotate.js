#pragma strict

var dir:float = 1;
var shouldRotate : boolean = false;

function Start () {}

function Update () {
	if (shouldRotate == true) {transform.Rotate(Vector3.up * (dir*3) * Time.deltaTime, Space.World);}
}

// toggles rotation based on object visibility
function OnBecameVisible() {shouldRotate = true;}
function OnBecameInvisible() {shouldRotate = false;}