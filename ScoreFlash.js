// ScoreFlash
//
//--------------------------------------------------------------------
//                        Public parameters
//--------------------------------------------------------------------

public var flashTexture : Texture2D;
public var fadeSpeed = 0.3;

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
    
    GUI.DrawTexture(Rect(0, 0, Screen.width, Screen.height), flashTexture);
}

//--------------------------------------------------------------------

function flashUp(){
    fadeDir = -1;   
}

//--------------------------------------------------------------------

function flashOut(){
    fadeDir = 1;    
}

function Start(){
    alpha=1;
    flashUp();
}

function flashOutHalf(){
	fadeDir = .5;
}