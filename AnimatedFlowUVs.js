#pragma strict

var speed:float = 1;
var shouldAnimate : boolean = false;
private var offset : float = 0;
private var offsetStartTime : float;
private var offsetTimer : float = 0;
private var resetTime : float;
private var thisRenderer : Material;

function Start () {
	thisRenderer = renderer.material;
	thisRenderer.mainTextureOffset = Vector2(0,0);
	resetTime = Mathf.Abs(1/speed);
}

function Update () {
	if (shouldAnimate == true) {
		offset = offsetTimer * speed;
		if (offsetTimer >= resetTime) {
			offsetStartTime = Time.time;
		}
		
		offsetTimer = (Time.time - offsetStartTime);
	
//		Debug.Log("Your offset Timer is " + offsetTimer + 
//		" and resetTimer is " + resetTime);
		thisRenderer.mainTextureOffset = Vector2(0,offset);
	}
}

// toggles offset changes based on object visibility
function OnBecameVisible() {shouldAnimate = true; offsetStartTime = Time.time;}
function OnBecameInvisible() {shouldAnimate = false;}