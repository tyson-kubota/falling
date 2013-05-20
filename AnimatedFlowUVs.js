#pragma strict

var speed:float = 1;
var shouldAnimate : boolean = false;

function Start () {}

function Update () {
	if (shouldAnimate == true) {
		var offset = Time.time * speed;
		renderer.sharedMaterial.mainTextureOffset = Vector2(0,offset);
	}
}

// toggles rotation based on object visibility
function OnBecameVisible() {shouldAnimate = true;}
function OnBecameInvisible() {shouldAnimate = false;}