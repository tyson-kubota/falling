#pragma strict

var speed:float = 1;
var shouldAnimate : boolean = false;
private var offset : float = 0;
private var offsetStartTime : float;
private var offsetTimer : float = 0;

function Start () {
	renderer.sharedMaterial.mainTextureOffset = Vector2(0,0);
}

function Update () {
	if (shouldAnimate == true) {
		offset = offsetTimer * speed;
		
		if ((offsetTimer*speed) >= 1) {
			offsetStartTime = Time.time;
		}
		
		offsetTimer = (Time.time - offsetStartTime);
	
		Debug.Log(offsetTimer);
		renderer.sharedMaterial.mainTextureOffset = Vector2(0,offset);
	}
}

// toggles offset changes based on object visibility
function OnBecameVisible() {shouldAnimate = true; offsetStartTime = Time.time;}
function OnBecameInvisible() {shouldAnimate = false;}