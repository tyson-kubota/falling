// ScoreFlash
//
//--------------------------------------------------------------------
//                        Public parameters
//--------------------------------------------------------------------

public var speedLinesTexture : Texture2D;
public var fadeSpeed = 1;

var drawDepth = -1000;

//--------------------------------------------------------------------
//                       Private variables
//--------------------------------------------------------------------

private var alpha = 1.0; 

private var fadeDir = -1;
//private var fadeDirHalf = .5;

//--------------------------------------------------------------------
//                       Runtime functions
//--------------------------------------------------------------------

//--------------------------------------------------------------------

function OnGUI(){
    
    alpha += fadeDir * fadeSpeed * Time.deltaTime;  
    alpha = Mathf.Clamp01(alpha);   
    
    GUI.color.a = alpha;
    
    GUI.depth = drawDepth;
    
    GUI.DrawTexture(Rect(0, 0, Screen.width, Screen.height), speedLinesTexture);
}

//--------------------------------------------------------------------

function speedLinesDown(){
    fadeDir = -1;   
}

//--------------------------------------------------------------------

function speedLinesUp(){
    fadeDir = 1;    
}

function Start(){
    alpha=1;
    speedLinesDown();
}

function speedLinesUpHalf(){
	fadeDir = .5;
}