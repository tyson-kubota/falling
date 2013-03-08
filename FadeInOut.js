// FadeInOut
//
//--------------------------------------------------------------------
//                        Public parameters
//--------------------------------------------------------------------

public var fadeOutTexture : Texture2D;
public var fadeSpeed = 0.3;
//var canFade : boolean = false;
var drawDepth = -1000;

//--------------------------------------------------------------------
//                       Private variables
//--------------------------------------------------------------------

private var alpha = 0.0; 

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
    
    GUI.DrawTexture(Rect(0, 0, Screen.width, Screen.height), fadeOutTexture);
}

//--------------------------------------------------------------------

function fadeIn(){
    fadeDir = -1;   
}

//--------------------------------------------------------------------

function fadeOut(){
    fadeDir = 1;    
}

function Start(){
    alpha=1;
    fadeIn();
}

function fadeOutHalf(){
	fadeDir = .5;
}