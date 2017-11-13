#pragma strict
var solidDistance: float = 5.0; // max distance to be 100% solid
var other : Transform = null;
var isEnabled : boolean = false;
private var myTransform : Transform = null;
private var myRendererMatl : Material;
private var dist : Vector3;
private var sqrLen : float;
private var lenToObj : float;

function Start () {
	myTransform = transform;
	myRendererMatl = GetComponent.<Renderer>().material;
}

function OnBecameVisible() {
	isEnabled = true;
}

function OnBecameInvisible() {
	if (myRendererMatl) {myRendererMatl.color.a = 0.0;}
	isEnabled = false;
}

function Update () {
	if (isEnabled) {
		dist = myTransform.position - other.position;
		sqrLen = dist.sqrMagnitude;
		lenToObj = Mathf.Sqrt(sqrLen);
		
		if (sqrLen < solidDistance*solidDistance) {
			lenToObj = solidDistance;
		}
		
		myRendererMatl.color.a = solidDistance / lenToObj;
	}
}