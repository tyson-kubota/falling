var script : ScoreController;

var LifeFlashTexture : GameObject;
static var LifeFlashTextureScript : GUITextureLaunch;
LifeFlashTextureScript = LifeFlashTexture.GetComponent("GUITextureLaunch");
static var inOutro : boolean = false;

static var isAlive : int = 0;
var UIscriptName : GameObject;

function Awake () {
	   	script = GetComponent("ScoreController");
}

function Start () {
   	isAlive = 1;
   	Loop ();
   	Loop2 ();
   	ScoreLerpLoop ();
}
	   	
function Loop () {
    while (true && inOutro == false) {
        yield TickingAway(.25);
//        Debug.Log("Your visible score is + " + script.visibleScore);
//        Debug.Log("Your current score is + " + script.currentScore);
    }
}

function Loop2 () {
    while (true && inOutro == false) {
		yield LifeFlashCheck(.2, 5);
    }
}

function ScoreLerpLoop () {
    while (true && inOutro == false) {
		script.ScoreUpdate(.25);
		yield WaitForSeconds(.25);
	}
}
	   
	   	
function TickingAway (delay : float) {
	if (script.currentScore > 0) {
		if (MoveController.Slowdown > 17999) {
			script.DecrementScore(delay);
	   		yield WaitForSeconds((delay/4));
		}
		
		else if (MoveController.Slowdown < 18000) {
			script.DecrementScore(delay);
	   		yield WaitForSeconds(delay);
	   	}
	}
	
	else {
		   	isAlive = 0;
		   	FallingPlayer.isPausable = false;
		   	LifeFlashTextureScript.FadeFlash (1, FadeDir.Out);
		   	FallingLaunch.secondsAlive = (Time.time - FallingPlayer.lifeStartTime);
		   	GA.API.Design.NewEvent("Death:Drained:"+Application.loadedLevelName + ":" + FallingLaunch.thisLevelArea, FallingLaunch.secondsAlive, transform.position);
		   	//Debug.Log("You died!");
		   	//GA.API.Design.NewEvent("Death:Drained:", FallingLaunch.secondsAlive, transform.position);
		   	
		   	//var deathDrainEvent : GAEvent = new GAEvent("Death", "Drained", FallingLaunch.thisLevelArea, FallingLaunch.secondsAlive);
		   	//GoogleAnalytics.instance.Add(deathDrainEvent);
		   	//GoogleAnalytics.instance.Dispatch();
		   	
		   	yield GetComponent(FallingPlayer).DeathRespawn ();

			// GameAnalytics syntax: GA.API.Design.NewEvent(String eventName, float eventValue, Vector3 trackPosition); 

		}
}


function LifeFlashCheck (delay : float, score : int) {

	if (script.currentScore < score && inOutro == false) {
	    //Camera.main.SendMessage("lifeFlashOut");
		LifeFlashTextureScript.FadeFlash (delay, FadeDir.In);
		yield WaitForSeconds(delay);
//		Camera.main.SendMessage("lifeFlashUp");
		LifeFlashTextureScript.FadeFlash (delay, FadeDir.Out);
		yield WaitForSeconds((delay*3));		
	}
}

// not being used currently, due to more versatile LifeFlashCheck in a separate coroutine.
function LifeFlash (delay : float, score : int) {

	if (script.currentScore < score) {
	    Camera.main.SendMessage("lifeFlashOut");
		yield WaitForSeconds(delay);
		Camera.main.SendMessage("lifeFlashUp");
	}
}
