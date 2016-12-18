#pragma strict
var dirLocal:float = 1;
var dirGlobal:float = 1;

//enum RotDir { up, right, forward }
//var rotationDir : RotDir;

//var dir : Vector3 = Vector3.zero;
//new Transform transform;

//enum RotVector { 0, 1 }

//var rotationDir : RotVector;

//var x : RotVector;
//var y : RotVector;
//var z : RotVector;

var myRenderer : Renderer;

function Start () {
//	Loop ();
	myRenderer = GetComponent.<Renderer>();
}

function Loop () {
    while (true) {
        yield RotateNow(2);
    }
}

function RotateNow (delay : float) {
if (myRenderer.isVisible) {
    iTween.RotateUpdate(gameObject, transform.eulerAngles, 2);
    yield WaitForSeconds(delay);
    }
}
    
//function FixedUpdate () {transform.Rotate(Vector3(x, y, z) * (dir*3) * Time.deltaTime, Space.World);}

function FixedUpdate() {
if (myRenderer.isVisible) {
	transform.Rotate(Vector3.right * (dirLocal*3) * Time.deltaTime);
	transform.Rotate(Vector3.up * (dirGlobal*3) * Time.deltaTime, Space.World);
	}
}