#pragma strict

var touch : Touch;
var fingerCount = 0;

private var myTransform : Transform;
private var startTime : float;

static var Slowdown : float = 0.0;
static var maxSlowdown : float = 18000.0;
private var maxSlowdownThreshold : float = maxSlowdown - 1;

private var lateralSpeedBoost : float = 0.0;
private var maxLateralSpeed : float = 0.5;

var forceComponent : ConstantForce;

private var extraForceRaw = Vector3.zero;
var extraForce = Vector3.zero;
private var clampedModifierVR : float;

private var dir = Vector3.zero;
private var speed : float = 2.4;

static var speedingUp : int = 1;

static var controlMultiplier : float = 1.0;
private var controlModifierTotal : float;

var mainCameraObj : GameObject;
private var mainCamera : Camera;

private var myHead : GvrHead;
var GvrViewerMainObject : GameObject; // In each scene, manually add the GvrViewerMain obj via Inspector

var script : ScoreController;

var SpeedLinesMesh : GameObject;
static var SpeedLinesMeshScript : SpeedLines;

var audioSource : AudioSource;

var changingPitch : boolean = false;

// this is on for all levels but lvl1/tutorial, which has music baked
// into the background wind sound, and thus shouldn't get pitch-shifted:
var shouldChangePitch : boolean = true;

var maxDuckedVolume : float = 1.0;

static var pauseButtonArea : Rect;

function Awake() {
    myTransform = transform;
    script = GetComponent("ScoreController");
    SpeedLinesMeshScript = SpeedLinesMesh.GetComponent("SpeedLines");
    forceComponent = GetComponent.<ConstantForce>();
}


function Start() {
    // Screen.sleepTimeout = 0.0f;
    // deprecated, now should use NeverSleep
    Screen.sleepTimeout = SleepTimeout.NeverSleep;
    startTime = Time.time;
    Slowdown = FallingLaunch.levelEndSlowdown;

    if (mainCameraObj) {
        mainCamera = mainCameraObj.GetComponent.<Camera>();
    }
    else { // if it wasn't set already via the Inspector UI...
        mainCameraObj = GameObject.FindWithTag("MainCamera");
        mainCamera = Camera.main;
    }

    audioSource = mainCamera.GetComponent.<AudioSource>();

    //Calibrate();

    lerpSlowdown(.5);
    
    // resetting controlMultiplier in case it was zeroed from the previous level
    // (since as a global/static var, it's cached across level loads);
    // Also, since it was probably lerped down to zero at previous levelEnd, initialize it here, except in the case where .
    if (FallingLaunch.shouldShowVRIntroUI && FallingLaunch.isVRMode) {
        MoveController.controlMultiplier = 0.0;
    } else {
        MoveController.controlMultiplier = 1.0;
    }

    if (!FallingLaunch.isVRMode) {
        lerpControlIn(3.0);
    }

    //pauseButtonArea = Rect(0, 0, Screen.width / 2, Screen.height / 2);
    pauseButtonArea = Rect(Screen.width * .9, Screen.height * .8, Screen.width * .1, Screen.height * .2);

}

function FixedUpdate () {
    dir = Vector3.zero;

    // Address any x/z movement due to device tilts or VR head gaze positon:
    if (FallingPlayer.isAlive == 1 && FallingLaunch.tiltable == true) {
        // In VR mode, use Cardboard gaze direction (e.g. as applied to head object)
        // to determine any movement that's not downwards/gravity-driven:
        if (FallingLaunch.isVRMode && GvrViewerMainObject) {
            if (myHead) { MovePlayerVR(); }
        } else {
            // if not in VR mode, call movePlayer and honor the playerPrefs axis settings:
            MovePlayer(FallingLaunch.invertHorizAxisVal, FallingLaunch.invertVertAxisVal);
        }
    } else {
        dir = Vector3.zero;
    }

    // Address any speedups due to screen presses in FixedUpdate, not here!
    // FallingSpeed();
}

function MovePlayerVR () {
    // Using TransformDirection so it's in world space, not local.
    controlModifierTotal = FallingPlayer.isAlive * controlMultiplier * FallingLaunch.flipMultiplier;
    dir.x = 3 * transform.TransformDirection(myHead.Gaze.direction).x * controlModifierTotal;
    dir.z = 3 * transform.TransformDirection(myHead.Gaze.direction).z * controlModifierTotal;

    // Debug.Log('head direction: ' + myHead.Gaze.direction);
    // Debug.Log('dir x pre-clamping ' + dir.x);
    // Debug.Log('dir z pre-clamping ' + dir.z);

    // Only using X and Z: no y-traversal in world axis,
    // since scene gravity handles the Y dimension.
    dir.x = Mathf.Clamp(dir.x, -2.0, 2.0);
    dir.z = Mathf.Clamp(dir.z, -2.0, 2.0);

    // Debug.Log('dir x final ' + dir.x);
    // Debug.Log('dir z final ' + dir.z);

    var speedRatio : float = Slowdown / maxSlowdown;

    // Cap the lateral speed (it should be translation, not a force,
    // so you don't keep moving after you lift the trigger).
    // Distinguish between two categories of movement:
    // while in boost mode and just afterwards (speedRatio > .25; value range is 1.25-2.4),
    // vs. regular (speedRatio < .25) movement.
    // The latter is more constrained (possible value range 1-1.5).
    lateralSpeedBoost = speedRatio > .25 ?
        Mathf.Max(1.25, speedRatio * speed) : 1.0 + (speedRatio * maxLateralSpeed);

    // Debug.Log('lateralSpeedBoost: ' + lateralSpeedBoost);
    // Debug.Log('controlMultiplier: ' + controlMultiplier);
    
    // Dir is clamped to +/-2 units/frame (and avoiding direct use of the speed multiplier)
    // to obtain more 'realistic' 1:1 movement, with just a little amplification,
    // and with lateralSpeedBoost as the extra if you're touching the screen.
    // myTransform.Translate (dir * (1.0 + lateralSpeedBoost), Space.World);
    // myTransform.Translate (dir * lateralSpeedBoost, Space.World);
    myTransform.Translate (dir * lateralSpeedBoost * controlMultiplier, Space.World);
}

function MovePlayer(horizAxisInversionVal: int, vertAxisInversionVal: int) {
    FallingLaunch.hasSetAccel = true;
    FallingLaunch.accelerator = FallingLaunch.calibrationRotation * Input.acceleration;

    // Debug.Log("MoveController FallingLaunch.calibrationRotation: " + FallingLaunch.calibrationRotation);
    // Debug.Log("Input.acceleration: " + Input.acceleration);
    // Debug.Log( "MoveController FallingLaunch.flipMultiplier: " + FallingLaunch.flipMultiplier );

    // Debug.Log("MoveController FallingLaunch.accelerator: " + FallingLaunch.accelerator);

    dir.x = 4 * FallingPlayer.isAlive * controlMultiplier * FallingLaunch.flipMultiplier * -((FallingLaunch.accelerator.y) * Mathf.Abs(FallingLaunch.accelerator.y));
    dir.z = 3 * FallingPlayer.isAlive * controlMultiplier * FallingLaunch.flipMultiplier * ((FallingLaunch.accelerator.x) * Mathf.Abs(FallingLaunch.accelerator.x));

    dir.x = horizAxisInversionVal * Mathf.Clamp(dir.x, -2.0, 2.0);
    dir.z = vertAxisInversionVal * Mathf.Clamp(dir.z, -2.0, 2.0);
    // Debug.Log("dir.x final: " + dir.x);
    // Debug.Log("dir.z final: " + dir.z);

    myTransform.Translate (dir * speed, Space.World);
}

function ChangeSpeed ( i : int ) {
    Slowdown = i;
    //  Debug.Log("Your current speed score is " + ScoreController.visibleScore);
}

function Update () {
    // TODO: make coroutine instead? http://answers.unity3d.com/answers/1281517/view.html
    // Find head for VR (can't live in Start because the GVR plugin takes > 1 frame to set up):
    if (FallingLaunch.isVRMode && GvrViewerMainObject && !myHead) {
        if (mainCameraObj.GetComponent.<StereoController>()) {
            myHead = mainCameraObj.GetComponent.<StereoController>().Head;
        }
    }

    FallingSpeed();
    // Debug.Log("Slowdown = " + Slowdown);
}

// Old perf note (moved fallingSpeed to fixedUpdate on 1/7/2017):
// I also tried moving fallingSpeed function to fixedUpdate, but it actually made the game slower,
// since iOS is usually 30fps and fixedUpdate needs to run at 50fps (0.02 fixed timestep) for
// decent collision detection.

function FallingSpeed () {
    // Debug.Log("FallingPlayer.isAlive: " + FallingPlayer.isAlive);
    // Debug.Log('controlMultiplier: ' + controlMultiplier);
    // Debug.Log("FallingPlayer.isPausable: " + FallingPlayer.isPausable);
    fingerCount = 0;

    if (FallingPlayer.isAlive == 1 && FallingPlayer.isPausable == true) {
        //for (touch in Input.touches) {
        //  if (touch.phase != TouchPhase.Ended && touch.phase != TouchPhase.Canceled) {
        for (var i = 0; i < Input.touchCount; ++i) {
            if (Input.GetTouch(i).phase != TouchPhase.Ended && Input.GetTouch(i).phase != TouchPhase.Canceled) {
                fingerCount++;

                if (pauseButtonArea.Contains(Input.GetTouch(i).position)) {
                    // Debug.Log("Returning!");
                    return;
                }

                // if (pauseButtonArea.Contains(touch.position)) {
                //  Debug.Log("Touching pause area!");
                // }
                // else {
                //  Debug.Log("Not in pause area.");
                // }
            }
        }


        if (fingerCount > 0) {
            if (Slowdown < 1) {
                Slowdown = maxSlowdown;
                speedingUp = 2;
                speedsUp();
                // GameAnalyticsSDK.GameAnalytics.NewDesignEvent (
                //     "Control:SpeedBoost:Start:" + Application.loadedLevelName + ":" + FallingLaunch.thisLevelArea,
                //     FallingLaunch.secondsAlive
                // );
            }
        } else if (fingerCount < 1) {
            // rounding Slowdown, since as lerp approaches zero, floating-point errors creep in
            if (Mathf.Round(Slowdown) > 0) {
                speedingUp = 0; speedsUp(); lerpSlowdown(.5);
            } else {
                audioSource.volume = maxDuckedVolume;
            }
        }
    }

    else {
        Slowdown = 0;
        speedingUp = 1;
        SpeedLinesMeshScript.LinesOff();
        if (shouldChangePitch && !changingPitch) {lerpPitchDown(.5, 1, 1);}
        dir = Vector3.zero;
        if (!FallingLaunch.isVRMode && FallingPlayer.isPausable) {
            FallingPlayer.UIscriptComponent.hideThreatBar(0.1);
        }
    }

    // Debug.Log("Slowdown = " + Slowdown + ", speedingUp = " + speedingUp );
    // Debug.Log("You have " + fingerCount + " fingers touching the screen." );

    // In non-VR mode, relativeForce assumes the Player GameObject transform is tilted
    // (by the device accelerometer) in space; it relies on device tilt
    // to provide some worldspace lateral speedup to the local (relative) down vector.

    // In VR, the head's gaze direction supplies our y vector, which is attenuated
    // based on the gaze x/z (clampedModifierVR).
    // That vector is multiplied by Slowdown to get a final downwards force.

    // Any x/z movement during a speed boost is handled in MovePlayerVR, since applying
    // sideways forces pushes the player too far away from the main level.
    if (myHead) {
        extraForceRaw = myHead.Gaze.direction;
        // Debug.Log('extraForceRaw: ' + extraForceRaw);
        // Debug.Log('myHead.Gaze.direction: ' + myHead.Gaze.direction);

        clampedModifierVR =
            Mathf.Max(Mathf.Abs(myHead.Gaze.direction.x), Mathf.Abs(myHead.Gaze.direction.z));
        extraForce = Vector3.ClampMagnitude(extraForceRaw, (1.0 - clampedModifierVR));
        // Debug.Log('clampedModifierVR: ' + clampedModifierVR);

        // If you wanted to directly set the downward vector,
        // you could use set extraForce.y to be myHead.Gaze.direction.y below...
        // but the attenuated version is easier on the neck to control!

        // Mutate into a downwards vector that insists on negative y values
        // (so you can't fly upwards).
        extraForce = Vector3(0, Mathf.Min(extraForce.y, 0.0) * Slowdown, 0);
    }
    else {
        extraForce = Vector3.down * Slowdown;
    }

    // Debug.Log('extraForce: ' + extraForce);
    forceComponent.relativeForce = extraForce;
}

function speedsUp () {
    if (speedingUp == 2) {
        speedingUp = 1;
        SpeedLinesMeshScript.LinesFlash (0.25, FadeDir.In);
        if (!FallingLaunch.isVRMode) {
            FallingPlayer.UIscriptComponent.showThreatBar(1);
        }
        if (audioSource && shouldChangePitch) {
            // a bit of randomness to vary the end wind-noise pitch;
            // generally, we want a value near 2:
            lerpPitchUp(.5, Random.Range(1.85, 2.25), .3);
        }
    } else {
        SpeedLinesMeshScript.LinesFlashOut (0.5, FadeDir.In);
        if (!FallingLaunch.isVRMode) {
            FallingPlayer.UIscriptComponent.hideThreatBar(.5);
        }
        if (audioSource && shouldChangePitch && !changingPitch) {
            lerpPitchDown(1, 1, 1);
        }
    }
}

function getMaxDuckedVolume() {
    return maxDuckedVolume;
}

function setMaxDuckedVolume(maxVol : float) {
    maxDuckedVolume = maxVol;
}

function lerpSlowdown (timer : float) {
    var start = Slowdown;
    var end = 0.0;
    var i = 0.0;
    var step = 1.0/timer;

    while (i <= 1.0) {
        i += step * Time.deltaTime;
        Slowdown = Mathf.Lerp(start, end, i);
        yield;

        if (Slowdown > maxSlowdownThreshold) {break;}
        }
    yield WaitForSeconds (timer);

}

function lerpPitchUp (timer : float, endPitch : float, endVolume : float) {

    var startVol = audioSource.volume;
    var endVol = endVolume;

    var start = audioSource.pitch;
    var end = endPitch;
    var i = 0.0;
    var step = 1.0/timer;


    while (i <= 1.0) {
        i += step * Time.deltaTime;
        audioSource.pitch = Mathf.Lerp(start, end, i);
        audioSource.volume = Mathf.SmoothStep(startVol, endVol * maxDuckedVolume, i);
        yield;

        if (Slowdown < 1) {break;}
    }
    yield WaitForSeconds (timer);
}

function lerpPitchDown (timer : float, endPitch : float, endVolume : float) {

    changingPitch = true;

    var startVol = audioSource.volume;
    var endVol = endVolume;

    var start = audioSource.pitch;
    var end = endPitch;
    var i = 0.0;
    var step = 1.0/timer;

    while (i <= 1.0) {
        i += step * Time.deltaTime;
        audioSource.pitch = Mathf.Lerp(start, end, i);
        audioSource.volume = Mathf.SmoothStep(startVol, endVol * maxDuckedVolume, i);
        yield;

        if (Slowdown > maxSlowdownThreshold) {changingPitch = false; break;}
    }

    yield WaitForSeconds (timer);
    changingPitch = false;
}

function lerpControlIn(timer : float) {

    var i : float = 0.0;
    var step = 1.0/timer;

    while (i <= 1.0) {
        i += step * Time.deltaTime;
        controlMultiplier = Mathf.Lerp(0.0, 1.0, i);
        yield;
        // Debug.Log("My controlMultiplier is " + controlMultiplier);
        // Debug.Log("My flipmultiplier is " + FallingLaunch.flipMultiplier + " and my end is " + end);
        }
    yield WaitForSeconds (timer);
}
