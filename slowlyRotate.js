#pragma strict

var dir:float = 1;
var shouldRotate : boolean = false;
private var myTransform : Transform = null;

function Start () 
	myTransform = transform;
}

function FixedUpdate () {
	//if (shouldRotate == true) {myTransform.Rotate(Vector3.up * (dir*3) * Time.deltaTime, Space.World);}
	if (shouldRotate == true) {myTransform.Rotate(Vector3.up * (dir/20), Space.World);}
}

// toggles rotation based on object visibility
function OnBecameVisible() {shouldRotate = true;}
function OnBecameInvisible() {shouldRotate = false;}