#pragma strict

var PlayerController : controllerITween2;
var ScoreController : ScoreController;
var LifeController : lifeCountdown;

var UIscriptName : GameObject;
var UIscriptComponent : fallingUITest;

//var outroShards : GameObject;
var outroCompletedOrb : GameObject;
var outroCompletionPoint : GameObject;

function Start () {
	PlayerController = GetComponent("controllerITween2");
	ScoreController = GetComponent("ScoreController");
	LifeController = GetComponent("lifeCountdown");
	UIscriptComponent = UIscriptName.GetComponent("fallingUITest");
}

function BeginOutro () {
	ScoreController.enabled = false;
	LifeController.enabled = false;	
		
	PlayerController.lerpSlowdown(1);
	yield WaitForSeconds (1);
	PlayerController.enabled = false;
	UIscriptComponent.BeginOutroUI();
    ScoreController.IncrementScore(35);
    LerpTowardsDiamond(12);
	yield WaitForSeconds (12);
}

function CompletedOrb () {
	outroCompletedOrb.active = true;	
//	outroShards.active = false;
	UIscriptComponent.GameCompleteUI();
}

function LerpTowardsDiamond (timer : float) {
	var diamondLookTarget = outroCompletedOrb.transform; 
    var start = gameObject.transform.position;
    var end = outroCompletionPoint.transform.position;
    var i = 0.0;
    var step = 1.0/timer;
	var rotation:Quaternion;
	var direction:Vector3 = diamondLookTarget.position - start;
//	rotation = Quaternion.LookRotation(direction);
//	Debug.Log('direction is ' + diamondLookTarget.position);
	 		
    while (i <= 1.0) {
//      transform.LookAt(diamondLookTarget);    
        i += step * Time.deltaTime;
        transform.position = Vector3.Lerp(start, end, i);
// 		transform.rotation = Quaternion.Slerp(transform.rotation, rotation, i);

        yield;
    }
}
