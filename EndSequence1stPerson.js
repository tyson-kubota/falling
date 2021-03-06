#pragma strict

var Player : GameObject;
private var FallingPlayerScript : FallingPlayer;
var PlayerController : MoveController;
var ScoreController : ScoreController;
var LifeController : lifeCountdown;
var EndTriggerName : GameObject;
var EndTriggerComponent : EndSequenceTrigger;
var EndMenuLogoObjectVR : GameObject;
var EndMenuLogoObject : GameObject;
var EndMenuLogoCamera : GameObject;
var OutroMusic : AudioSource;
var OutroMusicBedObject : GameObject;
var OutroMusicBed : AudioSource;
var MusicBedInterpolated : AudioVolumeInterpolate;

var UIscriptEndMenuName : GameObject;
var UIscriptEndMenuComponent : FallingEndMenuUI;
var reticleVRUIScript : VRLifeMeter;

//var outroShards : GameObject;
var outroCompletedOrb : GameObject;
var outroCompletionPoint : GameObject;

function Start () {
    FallingPlayerScript = GetComponent("FallingPlayer");
	PlayerController = GetComponent("MoveController");
	ScoreController = GetComponent("ScoreController");
	LifeController = GetComponent("lifeCountdown");
	MusicBedInterpolated = OutroMusicBedObject.GetComponent("AudioVolumeInterpolate");
	UIscriptEndMenuComponent = UIscriptEndMenuName.GetComponent("FallingEndMenuUI");
	EndTriggerComponent = EndTriggerName.GetComponent("EndSequenceTrigger");
    
    // Look up manually if not added in inspector:
    if (!reticleVRUIScript) {
        Debug.Log("Did you forget to select a reticleVRUIScript in the Unity Inspector?");
        reticleVRUIScript = GameObject.Find("vr-radial-life-meter").GetComponent.<VRLifeMeter>();
    }
    // Skip to the outro for testing. 
    // Make sure to disable EndSequenceTrigger's PlayOutro call so they don't compete:
    // PlayOutro();
}

function PlayOutro () {
	// GameAnalytics events for beating the game
    var isNewGamePlus : String = (FallingLaunch.NewGamePlus) ? "new_game_plus" : "first_game";

	FallingLaunch.secondsInLevel = (Time.time - FallingPlayer.levelStartTime);
    FallingLaunch.Analytics.Event(
        "GameComplete:" + FallingLaunch.vrModeAnalyticsString + isNewGamePlus,
        FallingLaunch.secondsInLevel
    );

	// TestFlightUnity.TestFlight.PassCheckpoint( "LevelComplete:" + Application.loadedLevelName );
	// TestFlightUnity.TestFlight.PassCheckpoint( "GameComplete");

	FallingPlayer.isPausable = false;
	ScoreController.enabled = false;
	LifeController.enabled = false;
	FallingPlayer.isTiltable = false;

	PlayerController.lerpSlowdown(1);
	OutroMusic.Play();
	//PlayerController.SpeedLinesOff(1);
	yield WaitForSeconds (1);
	PlayerController.enabled = false;
    
    FallingPlayer.isPausable = false;
    Player.transform.GetComponent.<Rigidbody>().isKinematic = true;

    if (FallingLaunch.isVRMode) {
        reticleVRUIScript.FadeReticleOut(0.5);
    } else {
        FallingPlayer.UIscriptComponent.BeginOutroUI();
    }

    ScoreController.IncrementScore(35);
    
    LerpTowardsDiamond(10);
    RotateTowardsDiamond(10);
	yield WaitForSeconds (10);

	// LerpIntoDiamond(14);
	MusicBedInterpolated.falsifyCheckDistance();
	FadeMusic(8, OutroMusicBed);

    // Only using iTween for path movement. 
    // Rotation is handled via FinalRotation's Slerp.
    iTween.MoveTo(gameObject, 
    iTween.Hash("path",iTweenPath.GetPath("player-end-path"), 
        "orienttopath", false, 
        // "looktarget", EndTriggerComponent.getDiamondCenter(),
        // "axis", "y",
        "time", 13, 
        "easetype", "easeOutSine"
    ));
    
    // start rotating player camera to end at the same time as the above tween path traveling.
    FinalRotation(13);

	EndTriggerComponent.AddDiamondCore(5);
	yield WaitForSeconds (1);
	EndTriggerComponent.AddDiamond3DCore(6);
	yield WaitForSeconds (1);
	EndTriggerComponent.FadeDiamond(8);
    yield WaitForSeconds (6);
	
	ScoreController.enabled = true;
	LifeController.enabled = true;
	lifeCountdown.inOutro = false;
	if (!FallingLaunch.isVRMode) {
        FallingPlayer.UIscriptComponent.GameCompleteUI();
        UIscriptEndMenuComponent.ShowEndGameUI();
    }
	FadeAudioListener (4);
	yield WaitForSeconds(1);

    if (FallingLaunch.isVRMode) {
        FadeEndMenuLogoVR(3.0);
        FallingPlayerScript.WhiteFadeVREndGame(5.0);
    } else {
	   FadeEndMenuLogo(3.0);
    }

	FallingLaunch.NewGamePlus = true;
}

function LerpTowardsDiamond (timer : float) {
	var diamondLookTarget = outroCompletedOrb.transform; 
    var start = gameObject.transform.position;
    var end = outroCompletionPoint.transform.position;
    var i = 0.0;
    var step = 1.0/timer;
	var startRotation = transform.rotation;
	var endRotation = Quaternion.Euler(-54,96,-2.3);
//	var zeroRotation = Quaternion.Euler(0,0,0);
//	var direction:Vector3 = diamondLookTarget.position - start;
//	rotation = Quaternion.LookRotation(direction);
//	Debug.Log('direction is ' + diamondLookTarget.position);
	 		
    while (i <= 1.0) {
//      transform.LookAt(diamondLookTarget);    
        i += step * Time.deltaTime;
        var t : float = i*i*i * (i * (6f*i - 15f) + 10f); // smootherstep lerp
        transform.position = Vector3.Slerp(start, end, t);
 		//transform.rotation = Quaternion.Slerp(startRotation, endRotation, i);

        yield;
    }

	EndTriggerComponent.SwapDiamonds(4);
}

function FinalRotation (timer : float) {
    var i = 0.0;
    var step = 1.0/timer;
    var startRotation = transform.rotation;
    var endRotation = Quaternion.Euler(-23.9,101.74,-2.52);
            
    while (i <= 1.0) {
        i += step * Time.deltaTime;
        var t : float = i*i*i * (i * (6f*i - 15f) + 10f); // smootherstep lerp
        transform.rotation = Quaternion.Slerp(startRotation, endRotation, t);

        yield;
    }
}

function RotateTowardsDiamond (timer : float) {
    var i = 0.0;
    var step = 1.0/timer;
	var startRotation = transform.rotation;
	var endRotation = Quaternion.Euler(-54,96,-2.3);

    var myCameraParent = transform.Find("Player-cameras");
    var parentRotation = myCameraParent ? myCameraParent.localRotation : Quaternion.identity;

    while (i <= 1.0) {
        i += step * Time.deltaTime;
        var t : float = i*i * (3f - 2f*i); // smoothstep lerp
 		transform.rotation = Quaternion.Slerp(startRotation, endRotation, t);
        // myCameraParent needs rotating too, because otherwise the local container object 
        // (tilted via FallingPlayer.playerTilt) will not be aligned to 0,0,0 local rotation,
        // so the diamond target won't be centered in view. VR mode is unaffected by this, 
        // since the VR eye cameras aren't children of myCameraParent.
        if (myCameraParent) {
            myCameraParent.localRotation = Quaternion.Slerp(parentRotation, Quaternion.identity, t);
        }
        yield;
    }
}

// function LerpIntoDiamond (timer : float) {
// 	var end = outroCompletedOrb.transform.position; 
//     var start = gameObject.transform.position;
// 	var startRotation = transform.rotation;
// 	var endRotation = Quaternion.Euler(-79,97,-2.3);    
//     var i = 0.0;
//     var step = 1.0/timer;
	
//     while (i <= 1.0) {
//         i += step * Time.deltaTime;
//         transform.position = Vector3.Slerp(start, end, i);
//  		transform.rotation = Quaternion.Slerp(startRotation, endRotation, i);
        
//         yield;
//     }

// }

function FadeEndMenuLogoVR(timer:float){

    EndMenuLogoObjectVR.GetComponent.<Renderer>().enabled = true;
    var start = 0;
    var end = 1.0;
    var i = 0.0;
    var step = 1.0/timer;
 
    while (i <= 1.0) { 
        i += step * Time.deltaTime;
        EndMenuLogoObjectVR.GetComponent.<Renderer>().material.color.a = Mathf.Lerp(start, end, i);
        yield;
    }
        
    yield WaitForSeconds (timer);
}


function FadeEndMenuLogo(timer:float){

	EndMenuLogoCamera.GetComponent(Camera).enabled = true;
	EndMenuLogoObject.GetComponent.<Renderer>().enabled = true;
    var start = 0;
    var end = 1.0;
    var i = 0.0;
    var step = 1.0/timer;
 
    while (i <= 1.0) { 
        i += step * Time.deltaTime;
        EndMenuLogoObject.GetComponent.<Renderer>().material.color.a = Mathf.Lerp(start, end, i);
        yield;
    }
    	
    yield WaitForSeconds (timer);
}


function FadeMusic (timer : float, source : AudioSource) {

    var audioStart = source.volume;
    var audioEnd = 0.0;
    var i = 0.0;
    var step = 1.0/timer;

    while (i <= 1.0) {
        i += step * Time.deltaTime;
        source.volume = Mathf.Lerp(audioStart, audioEnd, i);        
        yield;
    }
}


function FadeAudioListener(timer : float) {
    var start = AudioListener.volume;
    var end = 0.0;
    var i = 0.0;
    var step = 1.0/timer;
    
    while (i <= 1.0) {
        i += step * Time.deltaTime;
        AudioListener.volume = Mathf.Lerp(start, end, i);
        yield;
    }
}