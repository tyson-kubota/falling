#pragma strict
public var flashTextureObject : GameObject;

public var flashTexture : Texture2D;
public var fadeSpeed = 1;
var mainCamera : GameObject;

function Start(){
mainCamera = gameObject.Find("Camera");
}

function flashUp(){
// 	   	GUI.DrawTexture(Rect(0, 0, Screen.width, Screen.height), flashTexture);
//		iTween.ColorTo(mainCamera,{"a":0.0f,"time":fadeSpeed});
	    iTween.FadeTo(flashTextureObject,{"alpha":1,"time":1,"transition":"linear"});
		yield WaitForSeconds(.25);
}

