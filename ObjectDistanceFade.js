#pragma strict
var solidDistance: float = 5.0; // max distance to be 100% solid
var other : Transform = null;
var isEnabled : boolean = false;
private var myTransform : Transform = null;
private var myRendererMatl : Material;
private var dist : Vector3;
private var sqrLen : float;
private var sqrRtLen : float;

function Start () {
	myTransform = transform;
	myRendererMatl = GetComponent.<Renderer>().material;
}

function OnBecameVisible() {
	isEnabled = true;
}

function OnBecameInvisible() {
	isEnabled = false;
}

function Update () {
	if (isEnabled == true) {
		//var dist = Vector3.Distance(myTransform.position, other.position);
		dist = myTransform.position - other.position;
		sqrLen = dist.sqrMagnitude;
		sqrRtLen = Mathf.Sqrt(sqrLen);
		if (sqrLen < solidDistance*solidDistance) {sqrRtLen = solidDistance;}
		myRendererMatl.color.a = solidDistance / sqrRtLen;
	}
}