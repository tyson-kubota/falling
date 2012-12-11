#pragma strict

function Start () {

}

function Update () {

}


var native_width : float = 960;
var native_height : float = 640;

function OnGUI ()
{
    //set up scaling
    var rx : float = Screen.width / native_width;
    var ry : float = Screen.height / native_height;
    GUI.matrix = Matrix4x4.TRS (Vector3(0, 0, 0), Quaternion.identity, Vector3 (rx, ry, 1)); 

    //now create your GUI normally, as if you were in your native resolution
    //The GUI.matrix will scale everything automatically.

    //example
//    GUI.Box(  Rect(640, 380, 600, 300)  , "Hello World!");

if (GUI.Button (Rect (180,0,600,160), "Home")) {
		Application.LoadLevel (0);
	}

	// Make the second button.
	if (GUI.Button (Rect (180,160,600,160), "Twilight Helix")) {
		Application.LoadLevel (1);
	}

	if (GUI.Button (Rect (180,320,600,160), "Sunset Column")) {
		Application.LoadLevel (2);
	}

	if (GUI.Button (Rect (180,480,600,160), "Space Nebula")) {
		Application.LoadLevel (3);
	}
	
	
}