#pragma strict
var custompause : GUIStyle;
var custompausebg : GUIStyle;
var custompausebtn: GUIStyle;

var skin:GUISkin;

private var gldepth = -0.5;
private var startTime = 0.1;

var mat:Material;

private var tris = 0;
private var verts = 0;
private var savedTimeScale:float;
private var pauseFilter;


var lowFPSColor = Color.red;
var highFPSColor = Color.green;

var lowFPS = 30;
var highFPS = 50;

var start:GameObject;

var url = "unity.html";

var statColor:Color = Color.yellow;

var credits:String[]=[
    "A Fugu Games Production",
    "Programming by Phil Chu",
    "Fugu logo by Shane Nakamura Designs",
    "Copyright (c) 2007-2008 Technicat, LLC"] ;
var crediticons:Texture[];

enum Page {
    None,Main,Options,Credits
}

private var currentPage:Page;

private var fpsarray:int[];
private var fps:float;

function Start() {
    fpsarray = new int[Screen.width];
    Time.timeScale = 1.0;
    pauseFilter = Camera.main.GetComponent(SepiaToneEffect);
//    PauseGame();
}


function ScrollFPS() {
    for (var x=1; x<fpsarray.length; ++x) {
        fpsarray[x-1]=fpsarray[x];
    }
    if (fps < 1000) {
        fpsarray[fpsarray.length-1]=fps;
    }
}

static function IsDashboard() {
    return Application.platform == RuntimePlatform.OSXDashboardPlayer;
}

static function IsBrowser() {
    return (Application.platform == RuntimePlatform.WindowsWebPlayer ||
        Application.platform == RuntimePlatform.OSXWebPlayer);
}


//tap screen to pause
//function LateUpdate () {
//        for (var touch : Touch in Input.touches) {
//           if (touch.phase == TouchPhase.Began && !IsGamePaused()) 
//           PauseGame();
//           	} 
//    }


var native_width : float = 960;
var native_height : float = 640;

function OnGUI () {

var rx : float = Screen.width / native_width;
var ry : float = Screen.height / native_height;
GUI.matrix = Matrix4x4.TRS (Vector3(0, 0, 0), Quaternion.identity, Vector3 (rx, ry, 1)); 

    if (skin != null) {
        GUI.skin = skin;
    }
    if (IsGamePaused()) {
        GUI.color = statColor;
        switch (currentPage) {
            case Page.Main: PauseMenu(); break;
            case Page.Credits: ShowCredits(); break;
        }
    }  
    
      if (!IsGamePaused()) {if (GUI.Button(Rect(60,560,120,120)," ", custompausebtn)) {
        PauseGame();
    }}
}


function ShowCredits() {
    BeginPage(300,300);
    for (var credit in credits) {
        GUILayout.Label(credit);
    }
    for (var credit in crediticons) {
        GUILayout.Label(credit);
    }
    EndPage();
}

//function ShowBackButton() {
//    if (GUI.Button(Rect(20,Screen.height-50,50,20),"Back")) {
//        currentPage = Page.Main;
//    }
//}


function ShowDevice() {
    GUILayout.Label ("Unity player version "+Application.unityVersion);
    GUILayout.Label("Graphics: "+SystemInfo.graphicsDeviceName+" "+
    SystemInfo.graphicsMemorySize+"MB\n"+
    SystemInfo.graphicsDeviceVersion+"\n"+
    SystemInfo.graphicsDeviceVendor);
    GUILayout.Label("Shadows: "+SystemInfo.supportsShadows);
    GUILayout.Label("Image Effects: "+SystemInfo.supportsImageEffects);
    GUILayout.Label("Render Textures: "+SystemInfo.supportsRenderTextures);
}

function Qualities() {
        GUILayout.Label(QualitySettings.names[QualitySettings.GetQualityLevel()]);
}

function QualityControl() {
    GUILayout.BeginHorizontal();
    if (GUILayout.Button("Decrease")) {
        QualitySettings.DecreaseLevel();
    }
    if (GUILayout.Button("Increase")) {
        QualitySettings.IncreaseLevel();
    }
    GUILayout.EndHorizontal();
}


function BeginPage(width : int, height : int ) {
    GUILayout.BeginArea(Rect((Screen.width - width)/2,(Screen.height - height)/2,width,height));
}

function EndPage() {
    GUILayout.EndArea();
    if (currentPage != Page.Main) {
//        ShowBackButton();
    }
}

function IsBeginning() {
    return Time.time < startTime;
}


function PauseMenu() {
//    BeginPage(200,200);
//    if (GUILayout.Button (IsBeginning() ? "Play" : "Continue")) {
//        UnPauseGame();

//    }
//    if (GUILayout.Button ("Options")) {
//        currentPage = Page.Options;
//    }
//    if (GUILayout.Button ("Credits")) {
//        currentPage = Page.Credits;
//    }
//    if (IsBrowser() && !IsBeginning() && GUILayout.Button ("Restart")) {
//        Application.OpenURL(url);
//    }
    GUILayout.BeginArea (Rect (0,0,960,640), custompausebg);
    
//    if (GUI.Button (Rect (330,340,300,120), "Continue", custompause)) {
//		UnPauseGame();
//	}    
//    if (GUI.Button (Rect (330,200,300,120), "Home", custompause)) {
//		Application.LoadLevel (0);
//	}
//	if (GUI.Button(Rect(60,560,120,120),"Resume",custompausebtn)) {
//        UnPauseGame();
//     }

    if (GUI.Button (Rect (60,20,900,300), "      ", custompause)) {
		Application.LoadLevel (0);
	}
	
	if (GUI.Button (Rect (60,340,900,300), "      ", custompause)) {
		UnPauseGame();
	}    

	if (GUI.Button(Rect(60,560,120,120),"      ",custompausebtn)) {
        UnPauseGame();
     }
     
    GUILayout.EndArea ();
	
//    EndPage();
}

function PauseGame() {
//        Camera.main.SendMessage("fadeOutHalf");
//        yield WaitForSeconds(1);
    savedTimeScale = Time.timeScale;
    Time.timeScale = 0;
    AudioListener.pause = true;
    currentPage = Page.Main;
}

function UnPauseGame() {
    Time.timeScale = savedTimeScale;
    AudioListener.pause = false;
    if (IsBeginning() && start != null) {
        start.active = true;
    yield WaitForSeconds(1);
    }
}

function IsGamePaused() {
    return Time.timeScale==0;
}

function OnApplicationPause(pause:boolean) {
    if (IsGamePaused()) {
        AudioListener.pause = true;
    }
}