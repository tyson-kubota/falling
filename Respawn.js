/*
Respawn: Allows players to respawn to this point in the level, effectively saving their progress.

The Respawn object has three main states and one interim state: Inactive, Active and Respawn, plus Triggered.

- Inactive: Player hasn't reached this point and the player will not respawn here.

- Active: Player has touched this respawn point, so the player will respawn here.

- Respawn: Player is respawning at this respawn point.

Each state has its own visual effect(s).

Respawn objects also require a simple collider, so the player can activate them. The collider is set as a trigger.

*/

var initialRespawn : Respawn;	// set this to the initial respawn point for the level.

var RespawnState = 0;

// Sound effects:
var SFXPlayerRespawn: AudioClip;
var SFXRespawnActivate: AudioClip;
var SFXRespawnActiveLoop: AudioClip;

var SFXVolume: float;	// volume for one-shot sounds.

// references for the various particle emitters...
private var emitterActive: ParticleEmitter;
private var emitterInactive: ParticleEmitter;
private var emitterRespawn1: ParticleEmitter;
private var emitterRespawn2: ParticleEmitter;
private var emitterRespawn3: ParticleEmitter;

// ...and for the light:
private var respawnLight: Light;


// The currently active respawn point. Static, so all instances of this script will share this variable.
static var currentRespawn : Respawn;

var myCheckpoint : String;
var mainRespawnScript : boolean = false;

private var audioSource: AudioSource;

function Start()
{
	// Get some of the objects we need later.
	// This is often done in a script's Start function. That way, we've got all our initialization code in one place,
	// And can simply count on the code being fine.

	RespawnState = 0;

	// set up the looping "RespawnActive" sound, but leave it switched off for now:
	if (SFXRespawnActiveLoop)
	{
		audioSource = GetComponent.<AudioSource>();
		audioSource.clip = SFXRespawnActiveLoop;
		audioSource.loop = true;
		audioSource.playOnAwake = false;
	}

	// Assign the respawn point to be this one - Since the player is positioned on top of a respawn point, it will come in and overwrite it.
	// This is just to make sure that we always have a respawn point.

	// mainRespawnScript boolean is to keep multiple instances of Respawn from all trying to write
	// to PlayerPrefs within a single Update call.
	if (mainRespawnScript) {
		if (PlayerPrefs.HasKey("LatestLevel") && PlayerPrefs.GetString("LatestLevel") == Application.loadedLevelName)
		{
			myCheckpoint = PlayerPrefs.GetString("LatestCheckpoint");
			currentRespawn = myCheckpoint ? GameObject.Find(myCheckpoint).GetComponent(Respawn) : initialRespawn;
			var tempPlayer : GameObject = GameObject.Find("Player");
			var tempPlayerComponent : FallingPlayer = tempPlayer.GetComponent("FallingPlayer");
			var IntroScriptComponent : IntroSequence1stPerson = tempPlayer.GetComponent("IntroSequence1stPerson");
			var LifeControllerComponent : lifeCountdown = tempPlayer.GetComponent("lifeCountdown");

			if (IntroScriptComponent) {
				IntroScriptComponent.EndIntro(false);
				LifeControllerComponent.enabled = true;
			}
			FallingLaunch.LoadedLatestLevel = true;
			tempPlayerComponent.introNow();
		}
		else {
			currentRespawn = initialRespawn;
		}
	}

	SaveCheckpoint();
}

function OnTriggerEnter(other : Collider)
{
  if (other.gameObject.CompareTag ("Player")){
		if (currentRespawn != this)		// make sure we're not respawning or re-activating an already active pad!
		{
			// turn the old respawn point off
			//currentRespawn.SetInactive ();

			// play the "Activated" one-shot sound effect if one has been supplied:
			if (SFXRespawnActivate)
				AudioSource.PlayClipAtPoint(SFXRespawnActivate, transform.position, SFXVolume);

			// Set the current respawn point to be us and make it visible.
			currentRespawn = this;
		}
	}
}

function OnApplicationPause(pauseStatus: boolean) {
    if (pauseStatus) {
		SaveCheckpoint();
    }
}

// NB: We currently only persistently save checkpoints on pause
// (including app-to-background auto-pausing) and level loading.
// Writing to PlayerPrefs can be slow and introduce visual stutter, so we do NOT
// save in prefs when you pass a checkpoint during gameplay, although we do update the global
// currentRespawn var, so respawn works.
function SaveCheckpoint() {
	if (mainRespawnScript) {
    	myCheckpoint = currentRespawn.transform.name;
    	PlayerPrefs.SetString("LatestCheckpoint", myCheckpoint);
    	PlayerPrefs.SetString("LatestLevel", Application.loadedLevelName);
    	PlayerPrefs.Save();
    }
}

