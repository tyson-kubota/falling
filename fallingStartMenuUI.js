#pragma strict

var player : GameObject;
var value : float = 0.5f;
var bgSprite : UISprite;
var bgSpriteStart : UISprite;
var pauseButton : UIButton;
var rightArrow : UIButton;
var leftArrow : UIButton;
var loadNewLevelButton : UIButton;
var loadLevelOne : UIButton;
var loadLevelTwo : UIButton;
var loadLevelThree : UIButton;
var loadLevelFour : UIButton;

var loadingLabel : UIButton;
var BackToPauseMenuButton : UIButton;
var tiltWarning : UIButton;

var buttonScaleFactor : float;
var ScreenH : float = Screen.height;
var ScreenW : float = Screen.width;
var screenAspectRatio : float = ScreenH / ScreenW;
var scriptName : GameObject;
var initialRespawn : Respawn;

var angledTiltLabel : UIButton;
var flatTiltLabel : UIButton;
var verticalTiltLabel : UIButton;

var angledTiltChooser : UIButton;
var flatTiltChooser : UIButton;
var verticalTiltChooser : UIButton;
var TogglingTiltNeutral : boolean = false;

var levelToLoad : String = "";

static var level1 : String = "Falling-scene-tutorial";
static var level2 : String = "Falling-scene2";
static var level3 : String = "Falling-scene3";
static var level4 : String = "Falling-scene4";

var level2Unlocked : boolean = false;
var level3Unlocked : boolean = false;
var level4Unlocked : boolean = false;

var helpIcon1: UISprite;
var helpIcon2: UISprite;
var helpIcon3: UISprite;

var aboutButtonStart : UIButton;
var howToButton : UIButton;

var boldText : UIText;
var thinText : UIText;
var text1 : UITextInstance;
var text2 : UITextInstance;
var text3 : UITextInstance;

var appStoreButtonText : UITextInstance;
var appStoreButtonBg : UIButton;

var appStoreButtonHomeText : UITextInstance;
var appStoreButtonHomeBg : UIButton;

var tiltText1 : UITextInstance;
var tiltText2 : UITextInstance;
var invertHorizAxisText : UITextInstance;
var invertVertAxisText : UITextInstance;
var invertHorizAxisTextYes : UIButton;
var invertHorizAxisTextNo : UIButton;
var invertVertAxisTextYes : UIButton;
var invertVertAxisTextNo : UIButton;

var optionsButton : UIButton;
var isSaving : boolean = false;

var openSiteButtonText : UIButton;

var vrModeButton : UIButton;

var vrModeLaunchButton : UIButton;
var vrExplanatoryText : UITextInstance;

private var savedTimeScale:float;

var canShowStart : boolean;
var aboutToLoad : boolean = false;
var sceneAudio : AudioListener;
var fadeTime : float = 1.0;

var bgCamera : Camera;

var bgColor1 : Color;
var bgColor2 : Color = Color.red;

private var fallingLaunch : GameObject;
private var fallingLaunchComponent : FallingLaunch;

function Awake () {
	//Input.compensateSensors = true;
	fallingLaunch = GameObject.Find("LaunchGameObject");
	fallingLaunchComponent = fallingLaunch.GetComponent.<FallingLaunch>();

	if (Debug.isDebugBuild) {
		Debug.Log("My screen orientation is " + Screen.orientation);

		Debug.Log("My Input.deviceOrientation orientation is " + Input.deviceOrientation);
		Debug.Log("Cached FallingLaunch Input.deviceOrientation is " + FallingLaunch.initialInputDeviceOrientation);
	}

	ScreenH = Screen.height;
	ScreenW = Screen.width;
	screenAspectRatio = (ScreenH / ScreenW);
}


function Start () {
	// // Just to be safe, exclude portrait modes from potential autorotation:
	// BUG: Causes crash if device actually is in portrait or portrait upside-down.
	// Screen.autorotateToPortrait = false;
	// Screen.autorotateToPortraitUpsideDown = false;

	// We have to use autoRotation here, due to crashes on force-changing Screen.orientation
	// in conjunction with permitted-via-settings autoRotation
	// (if app launches mid-screen-rotation?).
	// Source: https://forum.unity.com/threads/unitydefaultviewcontroller-should-be-used-only-if-unity-is-set-to-autorotate.314542/#post-2833628
	Screen.orientation = ScreenOrientation.AutoRotation;

	// on iPhones, we could probably assume input to be landscape-left most of the time,
	// unless the device is known to be in landscape-right
	// (the edge cases are iPads lying on a flat surface, which could have either screen orientation):

	// This function waits an [arbitrary] second for iOS's autorotation to settle, then locks it.
	// It's not yielded, so it doesn't delay execution of the below.
	if (!FallingLaunch.isVRMode) {
		fallingLaunchComponent.LockDeviceOrientation(1.0);
	}

	if (Debug.isDebugBuild) {
		Debug.Log("My final screen orientation is " + Screen.orientation);
	}


	// resets all prefs on launch to simplify debugging:
	// PlayerPrefs.DeleteAll();
	if (PlayerPrefs.HasKey("HighestLevel") == false) {
		 FallingLaunch.levelAchieved = Application.loadedLevel + 1;
		 PlayerPrefs.SetInt("HighestLevel", FallingLaunch.levelAchieved);
	}

	FallingLaunch.levelAchieved = PlayerPrefs.GetInt("HighestLevel");

	// every return to the Start menu means re-entering VR mode
	// should show the in-level intro UI:
	FallingLaunch.shouldShowVRIntroUI = true;

//	  Testing to see if disabling this hard coded screen.orientation will allow auto detection of landscape
//	  right or left mode on startup.
//    Screen.orientation = ScreenOrientation.LandscapeLeft;

//    if (iPhoneInput.orientation == iPhoneOrientation.LandscapeRight) {
//	Screen.orientation = ScreenOrientation.LandscapeRight;}
//	else {Screen.orientation = ScreenOrientation.LandscapeLeft;}
	Camera.main.SendMessage("fadeIn");

	bgColor1 = bgCamera.backgroundColor;

	if (FallingLaunch.levelAchieved == 5) {
		//loadLevelTwo.alphaTo(0.01f, 0.0f, Easing.Sinusoidal.easeOut);
		level2Unlocked = true;
		level3Unlocked = true;
		level4Unlocked = true;
	}
	else if (FallingLaunch.levelAchieved == 4) {
		level2Unlocked = true;
		level3Unlocked = true;
	}
	else if (FallingLaunch.levelAchieved == 3) {
		level2Unlocked = true;
	}

	if (FallingLaunch.debugMode) {
		level2Unlocked = true;
		level3Unlocked = true;
		level4Unlocked = true;
	}

    bgSpriteStart = UIT.firstToolkit.addSprite( "menuBackground.png", 0, 0, 2 );
	bgSpriteStart.positionCenter();
	bgSpriteStart.scaleTo( 0.0001f, new Vector3( (Screen.width * 6), (Screen.height * 6), 1 ), Easing.Sinusoidal.easeOut);
	bgSpriteStart.alphaTo( 0.0001f, 0.1f, Easing.Sinusoidal.easeOut);

	bgSprite = UIT.firstToolkit.addSprite( "menuBackground.png", 0, 0, 2 );
	bgSprite.positionCenter();
	bgSprite.scaleTo( 0.01f, new Vector3( (Screen.width * 6), (Screen.height * 6), 1 ), Easing.Sinusoidal.easeOut);
	bgSprite.alphaTo( 0.01f, 0.94f, Easing.Sinusoidal.easeOut);
	bgSprite.hidden = true;

	pauseButton = UIButton.create("pauseWhite.png","pauseGray.png", 0, 0);
	pauseButton.pixelsFromTopRight( 5, 5 );
	pauseButton.highlightedTouchOffsets = new UIEdgeOffsets(30);
	pauseButton.onTouchUpInside += PauseGameCheck;

	pauseButton.hidden = true;

	if (UIT.isHD == true) {
		buttonScaleFactor = (((Screen.height / 2.0) - 100.0) / Screen.height);
	}
	else {
		buttonScaleFactor = (((Screen.height / 2.0) - 50.0) / Screen.height);
	}

	boldText = new UIText( "font-bold", "font-bold.png" );
	thinText = new UIText( "font-thin", "font-thin.png" );

	boldText.alignMode = UITextAlignMode.Center;
	boldText.verticalAlignMode = UITextVerticalAlignMode.Middle;
    boldText.wrapMode = UITextLineWrapMode.MinimumLength;

	thinText.alignMode = UITextAlignMode.Center;
	thinText.verticalAlignMode = UITextVerticalAlignMode.Middle;
    thinText.wrapMode = UITextLineWrapMode.None;

	text1 = thinText.addTextInstance( "CREATED BY TYSON KUBOTA", 0, 0 );
    text1.pixelsFromCenter( -55, 0 );

	text2 = boldText.addTextInstance( "tysonkubota.net/skydrift", 0, 0);
    text2.pixelsFromCenter( -30, 0 );

	text3 = thinText.addTextInstance( "MUSIC BY EVAN KUBOTA\n\nSOUND EFFECTS: freesound.org", 0, 0);
    text3.pixelsFromCenter( 45, 0 );

	openSiteButtonText = UIButton.create("tutorialBackground.png","tutorialBackground.png", 40, 40);
	openSiteButtonText.positionFromCenter(0,0);
	openSiteButtonText.onTouchUpInside += OpenFallingSite;
	openSiteButtonText.scaleTo( 0.1f, new Vector3( (Screen.width), 3, 1 ), Easing.Sinusoidal.easeOut);
	openSiteButtonText.alphaFromTo(0.1f, 0.0f, 0.0f, Easing.Sinusoidal.easeOut);

	appStoreButtonText = boldText.addTextInstance( "WRITE A REVIEW...", 0, 0);
    appStoreButtonText.positionFromBottom(.05);

    // A transparent tappable background; chosen for its width:
	appStoreButtonBg = UIButton.create("spheresText.png", "spheresText.png", 0,0);
	appStoreButtonBg.positionFromBottom(.05);
	appStoreButtonBg.onTouchUpInside += OpenAppStorePage;
	appStoreButtonBg.alphaFromTo(0.1f, 0.0f, 0.0f, Easing.Sinusoidal.easeOut);

	appStoreButtonHomeText = boldText.addTextInstance( "WRITE A REVIEW...", 0, 0);
    appStoreButtonHomeText.positionFromTop(.05);

    // A transparent tappable background; chosen for its width:
	appStoreButtonHomeBg = UIButton.create("spheresText.png", "spheresText.png", 0,0);
	appStoreButtonHomeBg.positionFromTop(.05);
	appStoreButtonHomeBg.onTouchUpInside += OpenAppStorePage;
	appStoreButtonHomeBg.alphaFromTo(0.1f, 0.0f, 0.0f, Easing.Sinusoidal.easeOut);


	text1.hidden = true;
	text2.hidden = true;
	text3.hidden = true;
	openSiteButtonText.hidden = true;
	appStoreButtonText.hidden = true;
	appStoreButtonHomeText.hidden	= true;
	appStoreButtonBg.hidden = true;
	appStoreButtonHomeBg.hidden	= true;
	
    // TODO: Use real VR Mode icon and button sprite here.
    // HACK: reusing existing button sprite as a transparent background
    // for the "VR Mode" text label (which is not clickable):

    // When this toggle is based on rendered pixels, only the larger iPhones should pass,
    // e.g. the "Plus" lineup (6/7/8+) and iPhone X (https://developer.apple.com/library/content/documentation/DeviceInformation/Reference/iOSDeviceCompatibility/Displays/Displays.html):
	var vrModeButtonSpriteString : String = Screen.width > 1700 ? "vrModeLarge.png" : "vrMode.png";
	vrModeButton = UIButton.create(vrModeButtonSpriteString, vrModeButtonSpriteString, 0,0);
	
	// bottom-left corner:
	// vrModeButton.positionFromBottomLeft ( .05, (.05 * screenAspectRatio) );
	
	// to center:
	vrModeButton.positionFromBottom(.05);
	
	vrModeButton.normalTouchOffsets = new UIEdgeOffsets( 40 );
	vrModeButton.highlightedTouchOffsets = new UIEdgeOffsets( 40 );
	vrModeButton.onTouchUpInside += OpenVRModeMenu;

	vrModeLaunchButton = UIButton.create("startDown.png","startDown.png", 0, 0);
	vrModeLaunchButton.positionFromCenter(.1, 0);

	vrModeLaunchButton.onTouchUpInside += LaunchVRMode;
	vrModeLaunchButton.onTouchDown += fadeInVRLaunchButton;
	vrModeLaunchButton.onTouchUp += fadeOutVRLaunchButton;

	var vrExplanatoryString : String =
		"VR MODE REQUIRES GOOGLE CARDBOARD.\n\nPRESS PLAY BELOW, THEN PLACE IN HEADSET.";

	vrExplanatoryText =
		thinText.addTextInstance( vrExplanatoryString, 0, 0);
    vrExplanatoryText.positionFromCenter(-.2, 0);

	vrModeButton.hidden = true;
	vrModeLaunchButton.hidden = true;
	vrExplanatoryText.hidden = true;

	optionsButton = UIButton.create("options.png", "options.png", 0,0);

	//optionsButton.positionFromBottomRight( .05f, .05f );
	//optionsButton.pixelsFromBottomRight ( 14, 14 );
	optionsButton.positionFromBottomRight ( .05f, (.05f * screenAspectRatio) );
	optionsButton.normalTouchOffsets = new UIEdgeOffsets( 40 );
	optionsButton.highlightedTouchOffsets = new UIEdgeOffsets( 40 );
	optionsButton.onTouchUpInside += ShowOptions;
	optionsButton.hidden = true;


	tiltText2 = thinText.addTextInstance( "NEUTRAL TILT ANGLE", 0, 0 );
    tiltText2.verticalAlignMode = UITextVerticalAlignMode.Bottom;
    tiltText2.positionFromRight( -.16f, .52f );
	tiltText2.hidden = true;
	//public UITextInstance addTextInstance( string text, float xPos, float yPos,
	//float scale, int depth, Color color, UITextAlignMode alignMode, UITextVerticalAlignMode verticalAlignMode )
	invertHorizAxisText = thinText.addTextInstance( "HORIZONTAL AXIS", 0, 0 );
	invertHorizAxisText.verticalAlignMode = UITextVerticalAlignMode.Bottom;
    invertHorizAxisText.positionFromRight( .00f, .52f );
	invertHorizAxisText.hidden = true;

	invertVertAxisText = thinText.addTextInstance( "VERTICAL AXIS", 0, 0 );
	invertVertAxisText.verticalAlignMode = UITextVerticalAlignMode.Bottom;
    invertVertAxisText.positionFromRight( .16f, .52f );
	invertVertAxisText.hidden = true;

	invertHorizAxisTextYes = UIButton.create("axisInverted.png","axisInverted.png", 0, 0 );
    invertHorizAxisTextYes.positionFromLeft( .00f, .52f );
	invertHorizAxisTextYes.hidden = true;
	invertHorizAxisTextYes.alphaTo(0.01f, 0.75f, Easing.Sinusoidal.easeOut);

	invertHorizAxisTextNo = UIButton.create("axisNormal.png","axisNormal.png", 0, 0 );
    invertHorizAxisTextNo.positionFromLeft( .00f, .52f );
	invertHorizAxisTextNo.hidden = true;
	invertHorizAxisTextNo.alphaTo(0.01f, 0.4f, Easing.Sinusoidal.easeOut);

	invertVertAxisTextYes = UIButton.create("axisInverted.png","axisInverted.png", 0, 0 );
    invertVertAxisTextYes.positionFromLeft( .16f, .52f );
	invertVertAxisTextYes.hidden = true;
	invertVertAxisTextYes.alphaTo(0.01f, 0.75f, Easing.Sinusoidal.easeOut);

	invertVertAxisTextNo = UIButton.create("axisNormal.png","axisNormal.png", 0, 0 );
    invertVertAxisTextNo.positionFromLeft( .16f, .52f );
	invertVertAxisTextNo.hidden = true;
	invertVertAxisTextNo.alphaTo(0.01f, 0.4f, Easing.Sinusoidal.easeOut);

	invertVertAxisTextNo.onTouchUpInside += DoInvertedVertAxis;
	invertVertAxisTextYes.onTouchUpInside += UndoInvertedVertAxis;
	invertHorizAxisTextNo.onTouchUpInside += DoInvertedHorizAxis;
	invertHorizAxisTextYes.onTouchUpInside += UndoInvertedHorizAxis;


	invertVertAxisTextNo.highlightedTouchOffsets = new UIEdgeOffsets( 20 );
	invertVertAxisTextYes.highlightedTouchOffsets = new UIEdgeOffsets( 20 );
	invertHorizAxisTextNo.highlightedTouchOffsets = new UIEdgeOffsets( 20 );
	invertHorizAxisTextYes.highlightedTouchOffsets = new UIEdgeOffsets( 20 );
	invertVertAxisTextNo.normalTouchOffsets = new UIEdgeOffsets( 20 );
	invertVertAxisTextYes.normalTouchOffsets = new UIEdgeOffsets( 20 );
	invertHorizAxisTextNo.normalTouchOffsets = new UIEdgeOffsets( 20 );
	invertHorizAxisTextYes.normalTouchOffsets = new UIEdgeOffsets( 20 );

	if (PlayerPrefs.GetInt("invertHorizAxis", 0) == 1) {FallingLaunch.invertHorizAxisVal = -1;}
	else {FallingLaunch.invertHorizAxisVal = 1;}
	if (PlayerPrefs.GetInt("invertVertAxis", 0) == 1) {FallingLaunch.invertVertAxisVal = -1;}
	else {FallingLaunch.invertVertAxisVal = 1;}

	tiltText1 = thinText.addTextInstance( "CHOOSE A NEUTRAL TILT ANGLE", 0, 0 );
    tiltText1.pixelsFromCenter( -40, 0 );
	tiltText1.hidden = true;

	angledTiltLabel = UIButton.create("neutralAngle45.png","neutralAngle45.png", 0, 0 );
	angledTiltLabel.normalTouchOffsets = new UIEdgeOffsets( 30 );
	angledTiltLabel.highlightedTouchOffsets = new UIEdgeOffsets( 30 );
	// angledTiltLabel.pixelsFromCenter( 0, 0 );
	angledTiltLabel.pixelsFromCenter( 0, 90 );
	angledTiltLabel.onTouchUpInside += AngledTiltNeutral;
	angledTiltLabel.hidden = true;

	flatTiltLabel = UIButton.create("neutralAngleFlat.png","neutralAngleFlat.png", 0, 0 );
	flatTiltLabel.normalTouchOffsets = new UIEdgeOffsets( 30 );
	flatTiltLabel.highlightedTouchOffsets = new UIEdgeOffsets( 30 );
	// flatTiltLabel.pixelsFromCenter( 0, -120 );
	flatTiltLabel.pixelsFromCenter( 0, -90 );
	flatTiltLabel.onTouchUpInside += FlatTiltNeutral;
	flatTiltLabel.hidden = true;

	verticalTiltLabel = UIButton.create("neutralAngleVertical.png","neutralAngleVertical.png", 0, 0 );
	verticalTiltLabel.normalTouchOffsets = new UIEdgeOffsets( 30 );
	verticalTiltLabel.highlightedTouchOffsets = new UIEdgeOffsets( 30 );
	// verticalTiltLabel.pixelsFromCenter( 0, 120 );
	// verticalTiltLabel.onTouchUpInside += VerticalTiltNeutral;
	verticalTiltLabel.hidden = true;


	angledTiltChooser = UIButton.create("neutralAngle45.png","neutralAngle45.png", 0, 0 );
	angledTiltChooser.normalTouchOffsets = new UIEdgeOffsets( 20 );
	angledTiltChooser.highlightedTouchOffsets = new UIEdgeOffsets( 20 );
	//angledTiltChooser.positionFromBottomRight(.05f, .05f);
	angledTiltChooser.positionFromLeft( -.16f, .52f );
	angledTiltChooser.onTouchUpInside += ToggleTiltNeutral;
	angledTiltChooser.hidden = true;

	flatTiltChooser = UIButton.create("neutralAngleFlat.png","neutralAngleFlat.png", 0, 0 );
	flatTiltChooser.normalTouchOffsets = new UIEdgeOffsets( 20 );
	flatTiltChooser.highlightedTouchOffsets = new UIEdgeOffsets( 20 );
	//flatTiltChooser.positionFromBottomRight(.05f, .05f);
	flatTiltChooser.positionFromLeft( -.16f, .52f );
	flatTiltChooser.onTouchUpInside += ToggleTiltNeutral;
	flatTiltChooser.hidden = true;

	verticalTiltChooser = UIButton.create("neutralAngleVertical.png","neutralAngleVertical.png", 0, 0 );
	verticalTiltChooser.normalTouchOffsets = new UIEdgeOffsets( 20 );
	verticalTiltChooser.highlightedTouchOffsets = new UIEdgeOffsets( 20 );
	verticalTiltChooser.positionFromLeft( -.16f, .52f );
	verticalTiltChooser.onTouchUpInside += ToggleTiltNeutral;
	verticalTiltChooser.hidden = true;

	tiltWarning = UIButton.create("tiltwarning.png","tiltwarning.png", 0, 0);
	tiltWarning.positionFromTop(buttonScaleFactor);

	rightArrow = UIButton.create("startDown.png","startDown.png", 0, 0);
	rightArrow.positionFromTopRight(buttonScaleFactor,0.2f);
	rightArrow.onTouchUpInside += ResumeGame;
	rightArrow.onTouchDown += fadeInRightArrow;
	rightArrow.onTouchUp += fadeOutRightArrow;

	BackToPauseMenuButton = UIButton.create("back.png","back.png", 40, 40);
	//BackToPauseMenuButton.pixelsFromBottomLeft ( 14, 14 );
	BackToPauseMenuButton.positionFromBottomLeft ( .05f, (.05f * screenAspectRatio) );
	//Debug.Log ("your screen aspect ratio is " + screenAspectRatio);
	BackToPauseMenuButton.normalTouchOffsets = new UIEdgeOffsets( 30 );
	BackToPauseMenuButton.highlightedTouchOffsets = new UIEdgeOffsets( 30 );

	loadLevelOne = UIButton.create("level1.png","level1.png", 0, 0);
	loadLevelOne.positionFromTopLeft(buttonScaleFactor,0.05f);
	loadLevelOne.onTouchUpInside += LoadLevel1ViaStart;
	loadLevelOne.onTouchUp += upLevel1;
	loadLevelOne.onTouchDown += downLevel1;

	var calculatedMiddleIconRatio : float = 0.0f;

	if (ScreenW > 2200) {
		calculatedMiddleIconRatio = 0.36f;
	} else if (ScreenW > 1600) {
		calculatedMiddleIconRatio = 0.33f;
	} else if (ScreenW > 1200) {
		calculatedMiddleIconRatio = 0.32f;
	} else if (ScreenW > 1000) {
		calculatedMiddleIconRatio = 0.31f;
	} else {
		calculatedMiddleIconRatio = 0.3f;
	}

	var middleIconAdjustRatio : float = UIT.isHD ? calculatedMiddleIconRatio : 0.3f;

	// Debug.Log("buttonScaleFactor: " + buttonScaleFactor);
	// Debug.Log("ScreenW: " + ScreenW);
	// Debug.Log("calculatedMiddleIconRatio: " + calculatedMiddleIconRatio);
	// Debug.Log("middleIconAdjustRatio: " + middleIconAdjustRatio);

	loadLevelTwo = UIButton.create("level2.png","level2.png", 0, 0);

	loadLevelTwo.positionFromTopLeft(buttonScaleFactor, middleIconAdjustRatio);

	if (level2Unlocked) {
		loadLevelTwo.onTouchUpInside += LoadLevel2ViaStart;
		loadLevelTwo.onTouchUp += upLevel2;
		loadLevelTwo.onTouchDown += downLevel2;
	}
	else {loadLevelTwo.onTouchUpInside += DoNothing;}

	loadLevelThree = UIButton.create("level3.png","level3.png", 0, 0);

	// var level3Space : float = (ScreenW * 0.9f) / 3.0;

	loadLevelThree.positionFromTopRight(buttonScaleFactor, middleIconAdjustRatio);

	if (level3Unlocked) {
		loadLevelThree.onTouchUpInside += LoadLevel3ViaStart;
		loadLevelThree.onTouchUp += upLevel3;
		loadLevelThree.onTouchDown += downLevel3;
	}
	else {loadLevelThree.onTouchUpInside += DoNothing;}

	loadLevelFour = UIButton.create("level4.png","level4.png", 0, 0);
	loadLevelFour.positionFromTopRight(buttonScaleFactor,0.05f);
	if (level4Unlocked) {
		loadLevelFour.onTouchUpInside += LoadLevel4ViaStart;
		loadLevelFour.onTouchUp += upLevel4;
		loadLevelFour.onTouchDown += downLevel4;
	}
	else {loadLevelFour.onTouchUpInside += DoNothing;}

	loadLevelOne.hidden = true;
	loadLevelTwo.hidden = true;
	loadLevelThree.hidden = true;
	loadLevelFour.hidden = true;

	leftArrow = UIButton.create("chooselevelDown.png","chooselevelDown.png", 0, 0);
	leftArrow.positionFromTopLeft(buttonScaleFactor,0.2f);
	leftArrow.hidden = true;

	if (level2Unlocked == true) {
		leftArrow.onTouchUpInside += LevelSelect;
		leftArrow.onTouchDown += fadeInLeftArrow;
		leftArrow.onTouchUp += fadeOutLeftArrow;
	}
	else {
		leftArrow.hidden = true;
		leftArrow.alphaTo(.01f, 0.0f, Easing.Sinusoidal.easeOut);
		rightArrow.positionFromCenter(0f,0f);
	}

	tiltWarning.hidden = true;
	rightArrow.hidden = true;

	BackToPauseMenuButton.onTouchUpInside += BackToPauseMenu;
	BackToPauseMenuButton.hidden = true;

	loadingLabel = UIButton.create("loading.png","loading.png", 20, 20);
	loadingLabel.positionFromCenter(0f, 0f);
	loadingLabel.hidden = true;

	loadNewLevelButton = UIButton.create("newlevel.png","newlevel.png", 40, 40);
	loadNewLevelButton.positionFromBottomLeft(.05f, .05f);
	loadNewLevelButton.normalTouchOffsets = new UIEdgeOffsets( 30 );
	loadNewLevelButton.highlightedTouchOffsets = new UIEdgeOffsets( 30 );
	loadNewLevelButton.onTouchUpInside += LevelSelect;
	loadNewLevelButton.hidden = true;

	aboutButtonStart = UIButton.create("aboutDots.png","aboutDots.png", 40, 40);
	aboutButtonStart.normalTouchOffsets = new UIEdgeOffsets( 30 );
	aboutButtonStart.highlightedTouchOffsets = new UIEdgeOffsets( 30 );
	aboutButtonStart.centerize();
	//aboutButtonStart.pixelsFromTopRight ( 14, 14 );
	aboutButtonStart.positionFromTopRight ( .05f, (.05f * screenAspectRatio) );
	aboutButtonStart.onTouchUpInside += OpenAbout;
// 	aboutButtonStart.onTouchUp += fadeOutAbout;
// 	aboutButtonStart.onTouchDown += fadeInAbout;
	aboutButtonStart.hidden = true;

	howToButton = UIButton.create("howToPlay.png","howToPlay.png", 40, 40);
	howToButton.normalTouchOffsets = new UIEdgeOffsets( 30 );
	howToButton.highlightedTouchOffsets = new UIEdgeOffsets( 30 );
	howToButton.centerize();
	//howToButton.pixelsFromTopLeft ( 14, 14 );
	howToButton.positionFromTopLeft ( .05f, (.05f * screenAspectRatio) );
	howToButton.onTouchUpInside += OpenHowTo;
	howToButton.hidden = true;

	helpIcon1 = UIT.firstToolkit.addSprite( "tiltText.png", 0, 0, 0 );
	helpIcon2 = UIT.firstToolkit.addSprite( "spheresText.png", 0, 0, 0 );
	helpIcon3 = UIT.firstToolkit.addSprite( "boostText.png", 0, 0, 0 );
	helpIcon1.positionFromTop(.3f);
	helpIcon2.positionCenter();
	helpIcon3.positionFromBottom(.3f);
	helpIcon1.hidden = true;
	helpIcon2.hidden = true;
	helpIcon3.hidden = true;

 	yield WaitForSeconds (4);
	bgSpriteStart.alphaTo( 3.0f, 0.85f, Easing.Sinusoidal.easeOut);
	yield WaitForSeconds (1);
	canShowStart = true;
//	ShowStart();
}

function ShowStart() {
	tiltWarning.hidden = true;

	if (PlayerPrefs.HasKey("LatestLevel")) {
		optionsButton.hidden = false;
		optionsButton.alphaFromTo(2.0f, 0.0f, 1.0f, Easing.Sinusoidal.easeIn);
	}
	if (level2Unlocked) {leftArrow.hidden = false;}

	rightArrow.hidden = false;
	aboutButtonStart.hidden = false;
	howToButton.hidden = false;
	
	if (!FallingLaunch.isTablet) {
		vrModeButton.hidden = false;
		vrModeButton.alphaFromTo( 2.0f, 0.0f, 1.0f, Easing.Sinusoidal.easeIn);
	}

	if (FallingLaunch.NewGamePlus) {
		appStoreButtonHomeBg.hidden = false;
		appStoreButtonHomeText.hidden = false;
		appStoreButtonHomeText.alphaFromTo( 3.0f, 0.0f, 1.0f, Easing.Sinusoidal.easeIn);
	}

	rightArrow.alphaFromTo( 2.0f, 0.0f, 0.4f, Easing.Sinusoidal.easeIn);
	leftArrow.alphaFromTo( 2.0f, 0.0f, 0.4f, Easing.Sinusoidal.easeIn);
	aboutButtonStart.alphaFromTo( 2.0f, 0.0f, 1.0f, Easing.Sinusoidal.easeIn);
	howToButton.alphaFromTo( 2.0f, 0.0f, 1.0f, Easing.Sinusoidal.easeIn);

	canShowStart = false;
	//yield FixWrongInitialScreenOrientation();
}


function DisplayTiltChooser () {

		if (PlayerPrefs.GetInt("TiltNeutral", 0) == 1) {
			angledTiltChooser.hidden = false;
			flatTiltChooser.hidden = true;
			verticalTiltChooser.hidden = true;

			angledTiltChooser.alphaFromTo(1.0f, 0.0f, 1.0f, Easing.Sinusoidal.easeIn);
		}
		else if (PlayerPrefs.GetInt("TiltNeutral", 0) == 2) {
			angledTiltChooser.hidden = true;
			flatTiltChooser.hidden = true;
			verticalTiltChooser.hidden = false;

			verticalTiltChooser.alphaFromTo(1.0f, 0.0f, 1.0f, Easing.Sinusoidal.easeIn);
		}
		else {
			angledTiltChooser.hidden = true;
			flatTiltChooser.hidden = false;
			verticalTiltChooser.hidden = true;

			flatTiltChooser.alphaFromTo(1.0f, 0.0f, 1.0f, Easing.Sinusoidal.easeIn);
		}
		tiltText2.alphaFromTo(1.0f, 0.0f, 1.0f, Easing.Sinusoidal.easeIn);
}


function CheckTiltAngle() {
	canShowStart = false;

	yield WaitForSeconds (.75);
	if ((Mathf.Abs(Input.acceleration.x) < .75) && (Mathf.Abs(Input.acceleration.y) < .75)) {
		ShowStart();}
	else {canShowStart = true;}
}

function ShowTiltWarning() {
	canShowStart = false;

	tiltWarning.hidden = false;
	tiltWarning.alphaFromTo( 0.25f, 0.0f, 1.0f, Easing.Sinusoidal.easeIn);
	yield WaitForSeconds (.75);
	tiltWarning.alphaFromTo( 0.25f, 1.0f, 0.0f, Easing.Sinusoidal.easeOut);
	yield WaitForSeconds (.5);
	canShowStart = true;
}

function Update () {
	//Debug.Log( "Your normalized accel is " + Vector3.Dot(Input.acceleration.normalized, Vector3(1,0,0)) );
	if ((canShowStart == true) && (Mathf.Abs(Input.acceleration.x) < .7) && (Mathf.Abs(Input.acceleration.y) < .7)) {
		CheckTiltAngle();
		bgCamera.backgroundColor = bgColor1;
	} else if (canShowStart) {

		// Only show tilt warning and lerp to red if it's presumed to be the player's
		// first-ish session (Application.loadedLevel == 2 connotes the tutorial level,
		// so levelAchieved < 3 means they haven't completed that level):
		// TODO: Would it be less annoying to only show this on the first-ever app launch?
		if (FallingLaunch.levelAchieved < 3) {
			ShowTiltWarning();
	        bgCamera.backgroundColor = Color.Lerp (bgColor1, bgColor2, 1.0);
		} else {
			// just show the start menu immediately if the player has made enough progress:
			ShowStart();
		}

		// var duration = 1.0;
		// var t : float = Mathf.Repeat (Time.time, duration) / duration;
		// var t : float = Mathf.PingPong (Time.time, duration) / duration;
		// bgCamera.backgroundColor = Color.Lerp (bgColor1, bgColor2, t);

	}
//	Debug.Log ("your input accel y is " + Input.acceleration.y + " and input accel x is " + Input.acceleration.x);
}

function PauseGame() {
	if (FallingPlayer.isPausable == true) {
		FallingPlayer.isPausable = false;
		rightArrow.hidden = false;
		if (level2Unlocked) {leftArrow.hidden = false;}
		loadNewLevelButton.hidden = false;
		bgSprite.hidden = false;

	    savedTimeScale = Time.timeScale;
//		scriptName.GetComponent(FallingPlayer).FadeAudio (.09, FadeDir.Out);
	    yield WaitForSeconds (.1);
	    Time.timeScale = 0;
	    AudioListener.pause = true;
	    FallingPlayer.isPausable = true;
    }
}

function UnPauseGame(resume : boolean) {
	FallingPlayer.isPausable = false;
    Time.timeScale = savedTimeScale;
    AudioListener.pause = false;
//	scriptName.GetComponent(FallingPlayer).FadeAudio (1.0, FadeDir.In);

	bgSprite.hidden = true;
	rightArrow.hidden = true;
	leftArrow.hidden = true;
	loadNewLevelButton.hidden = true;
	FallingPlayer.isPausable = resume;
    }

function IsGamePaused() {
    return Time.timeScale==0;
}

function PauseGameCheck() {
	if (FallingPlayer.isPausable == true) {
		if (Time.timeScale == 0) {
	//	if (AudioListener.pause == true) {
			UnPauseGame(true);
		}
		else {
			PauseGame();
		}
	}
}

function LevelSelect() {

	loadLevelOne.hidden = false;
	loadLevelTwo.hidden = false;
	loadLevelThree.hidden = false;
	loadLevelFour.hidden = false;

	HideStartMenuElements();
	ShowBackButton();

	fadeInLoadNewLevels();

	loadNewLevelButton.hidden = true;
}

function BackToPauseMenu() {
	if (level2Unlocked) {leftArrow.hidden = false;}
	rightArrow.hidden = false;
	aboutButtonStart.hidden = false;
	howToButton.hidden = false;

	aboutButtonStart.alphaFromTo( 1.0f, 0.0f, 1.0f, Easing.Sinusoidal.easeIn);
	howToButton.alphaFromTo( 1.0f, 0.0f, 1.0f, Easing.Sinusoidal.easeIn);

	if (!FallingLaunch.isTablet) {
		vrModeLaunchButton.hidden = true;
		vrExplanatoryText.hidden = true;
		vrModeButton.hidden = false;
	}

	fadeInPauseMenu();

	loadLevelOne.hidden = true;
	loadLevelTwo.hidden = true;
	loadLevelThree.hidden = true;
	loadLevelFour.hidden = true;

	helpIcon1.hidden = true;
	helpIcon2.hidden = true;
	helpIcon3.hidden = true;

	text1.hidden = true;
	text2.hidden = true;
	text3.hidden = true;
	openSiteButtonText.hidden = true;

	appStoreButtonBg.hidden = true;
	appStoreButtonText.hidden = true;

	if (FallingLaunch.NewGamePlus) {
		appStoreButtonHomeBg.hidden = false;
		appStoreButtonHomeText.hidden = false;
	}

	HideOptions();

	// if (PlayerPrefs.HasKey("LatestLevel")) {
	// 	DisplayTilt();
	// }

//	loadNewLevelButton.hidden = false;
	BackToPauseMenuButton.hidden = true;
}

function FadeAudio (timer : float) {

    var start = 1.0;
    var end = 0.0;
    var i = 0.0;
    var step = 1.0/timer;

    while (i <= 1.0) {
        i += step * Time.deltaTime;
        sceneAudio.volume = Mathf.Lerp(start, end, i);
        yield;
    }
}

function ResumeGame() {
	// This means we just beat the game, and are now continuing via menu:
	if (FallingLaunch.NewGamePlus && PlayerPrefs.GetString("LatestLevel") == level4) {
		StartLevelLoad(level1);
	}
	if (PlayerPrefs.HasKey("LatestLevel")) {
		StartLevelLoad(PlayerPrefs.GetString("LatestLevel"));
	} else if (FallingLaunch.isVRMode) {
		StartLevelLoad(level1);
	} else {
		// Only show tilt options if if's the player's
		// first session and they're not in VR mode:
		ShowTiltNeutralOptions();
	}
}

function ToggleTiltNeutral () {
	if (TogglingTiltNeutral == false) {

		TogglingTiltNeutral = true;

		if (PlayerPrefs.GetInt("TiltNeutral", 0) == 1) {
			fallingLaunchComponent.ChangeTilt(2);
			flatTiltChooser.hidden = true;
			angledTiltChooser.hidden = true;
			verticalTiltChooser.hidden = false;
		}
		else if (PlayerPrefs.GetInt("TiltNeutral", 0) == 2) {
			fallingLaunchComponent.ChangeTilt(0);
			flatTiltChooser.hidden = false;
			angledTiltChooser.hidden = true;
			verticalTiltChooser.hidden = true;
		}
		else {
			fallingLaunchComponent.ChangeTilt(1);
			flatTiltChooser.hidden = true;
			angledTiltChooser.hidden = false;
			verticalTiltChooser.hidden = true;
		}

		TogglingTiltNeutral = false;

	}
}

function FlatTiltNeutral () {
	if (TogglingTiltNeutral == false) {

		TogglingTiltNeutral = true;

		fallingLaunchComponent.ChangeTilt(0);
		flatTiltLabel.hidden = false;
		angledTiltLabel.hidden = true;
		verticalTiltLabel.hidden = true;

		TogglingTiltNeutral = false;

		fadeAndLoad(0);
	}
}

function AngledTiltNeutral () {
	if (TogglingTiltNeutral == false) {

		TogglingTiltNeutral = true;

		fallingLaunchComponent.ChangeTilt(1);
		angledTiltLabel.hidden = false;
		flatTiltLabel.hidden = true;
		verticalTiltLabel.hidden = true;

		TogglingTiltNeutral = false;

		fadeAndLoad(1);
	}
}

function VerticalTiltNeutral () {
	if (TogglingTiltNeutral == false) {

		TogglingTiltNeutral = true;

		fallingLaunchComponent.ChangeTilt(2);
		angledTiltLabel.hidden = true;
		flatTiltLabel.hidden = true;
		verticalTiltLabel.hidden = false;

		TogglingTiltNeutral = false;

		fadeAndLoad(2);
	}
}

function fadeAndLoad (flatNeutral : int) {
	//StartLevelLoad(level1);
	tiltText1.alphaTo(1.0f, 0.0f, Easing.Sinusoidal.easeOut);

	if (flatNeutral == 0) {
		flatTiltLabel.alphaTo(1.0f, 0.0f, Easing.Sinusoidal.easeIn);
		// angledTiltLabel.hidden = true;
	}
	else if (flatNeutral == 1) {
		angledTiltLabel.alphaTo(1.0f, 0.0f, Easing.Sinusoidal.easeIn);
		// flatTiltLabel.hidden = true;
	}
	else {
		verticalTiltLabel.alphaTo(1.0f, 0.0f, Easing.Sinusoidal.easeIn);
		// verticalTiltLabel.hidden = true;
	}

	yield WaitForSeconds (1.0f);

	StartLevelLoad(level1);

	//below logic unnecessary for one-time fade and load check
	// if (PlayerPrefs.HasKey("LatestLevel")) {
	// 	 StartLevelLoad(PlayerPrefs.GetString("LatestLevel"));
	// }
	// else {
	// 	StartLevelLoad(level1);
	// }
}

function ShowTiltNeutralOptions () {
	// yield FadeOutLevelButtons (fadeTime/2);
	yield FadeOutAllStartMenuElements(fadeTime/2);
	// yield WaitForSeconds(fadeTime/2)
	HideStartMenuElements();

	flatTiltLabel.hidden = false;
	angledTiltLabel.hidden = false;
	// verticalTiltLabel.hidden = false;
	tiltText1.hidden = false;


	tiltText1.alphaFromTo(1.0f, 0.0f, 0.8f, Easing.Sinusoidal.easeOut);
	flatTiltLabel.alphaFromTo(1.0f, 0.0f, 1.0f, Easing.Sinusoidal.easeOut);
	angledTiltLabel.alphaFromTo(1.0f, 0.0f, 1.0f, Easing.Sinusoidal.easeOut);
	// verticalTiltLabel.alphaFromTo(1.0f, 0.0f, 1.0f, Easing.Sinusoidal.easeOut);

}

function StartLevelLoad(levelName: String) {
	//yield StopCompensatingSensors();
	fallingLaunchComponent.Calibrate();

	if (aboutToLoad == false) {
		aboutToLoad = true;
		FadeAudio (fadeTime);

		yield FadeOutLevelButtons (fadeTime/2);
		yield WaitForSeconds(fadeTime);

		FallingLaunch.hasSetAccel = false;
		Application.LoadLevel(levelName);
	}
}

function FadeOutLevelButtons(timer : float) {

	BackToPauseMenuButton.hidden = true;
	yield FadeOutAllStartMenuElements(timer);
	// yield WaitForSeconds(timer);

	loadLevelOne.hidden = true;
	loadLevelTwo.hidden = true;
	loadLevelThree.hidden = true;
	loadLevelFour.hidden = true;

	HideStartMenuElements();

	loadingLabel.hidden = false;
	loadingLabel.alphaFromTo(.5, 0.0f, 1.0f, Easing.Quartic.easeIn);
	yield WaitForSeconds(.5);

}

function FadeOutAllStartMenuElements(timer: float) {
	loadLevelOne.alphaTo(timer, 0.0f, Easing.Sinusoidal.easeOut);
	loadLevelTwo.alphaTo(timer, 0.0f, Easing.Sinusoidal.easeOut);
	loadLevelThree.alphaTo(timer, 0.0f, Easing.Sinusoidal.easeOut);
	loadLevelFour.alphaTo(timer, 0.0f, Easing.Sinusoidal.easeOut);
	rightArrow.alphaTo(timer, 0.0f, Easing.Sinusoidal.easeOut);
	leftArrow.alphaTo(timer, 0.0f, Easing.Sinusoidal.easeOut);
	angledTiltChooser.alphaTo(timer, 0.0f, Easing.Sinusoidal.easeOut);
	flatTiltChooser.alphaTo(timer, 0.0f, Easing.Sinusoidal.easeOut);
	verticalTiltChooser.alphaTo(timer, 0.0f, Easing.Sinusoidal.easeOut);
	aboutButtonStart.alphaTo(timer, 0.0f, Easing.Sinusoidal.easeOut);
	howToButton.alphaTo(timer, 0.0f, Easing.Sinusoidal.easeOut);
	optionsButton.alphaTo(timer, 0.0f, Easing.Sinusoidal.easeOut);

	if (FallingLaunch.NewGamePlus) {
		appStoreButtonHomeText.alphaTo(timer, 0.0, Easing.Sinusoidal.easeOut);
	}

	if (!FallingLaunch.isTablet) {
		vrModeButton.alphaTo(timer, 0.0f, Easing.Sinusoidal.easeOut);
		vrModeLaunchButton.alphaTo(timer, 0.0, Easing.Sinusoidal.easeOut);
		vrExplanatoryText.alphaTo(timer, 0.0, Easing.Sinusoidal.easeOut);
	}

	yield;
}


function OpenHowTo() {

	HideStartMenuElements();
	ShowBackButton();

	helpIcon1.hidden = false;
	helpIcon2.hidden = false;
	helpIcon3.hidden = false;
	helpIcon1.alphaFromTo(.5f, 0.0f, 0.9f, Easing.Sinusoidal.easeOut);
	helpIcon2.alphaFromTo(.75f, 0.0f, 0.9f, Easing.Sinusoidal.easeInOut);
	helpIcon3.alphaFromTo(1.5f, 0.0f, 0.9f, Easing.Sinusoidal.easeInOut);
}

function OpenAbout() {

	HideStartMenuElements();
	ShowBackButton();
	
	appStoreButtonBg.hidden = false;
	appStoreButtonText.hidden = false;

	openSiteButtonText.hidden = false;
	text1.hidden = false;
	text2.hidden = false;
	text3.hidden = false;
	text1.alphaFromTo(1.0, 0.0, 0.8, Easing.Sinusoidal.easeOut);
	text2.alphaFromTo(1.0, 0.0, 1.0, Easing.Sinusoidal.easeOut);
	text3.alphaFromTo(1.5, 0.0, 0.6, Easing.Sinusoidal.easeInOut);
	appStoreButtonText.alphaFromTo(3.5, 0.0, 1.0, Easing.Sinusoidal.easeInOut);
}

function OpenVRModeMenu() {
	// This user shouldn't be able to trigger this OpenVRModeMenu
	// function on a tablet, but just to be safe...
	if (!FallingLaunch.isTablet) {
	    FallingLaunch.Analytics.Event(
	        "VRModeMenuOpen:" + FallingLaunch.vrModeAnalyticsString +
	        Screen.orientation,
	        FallingLaunch.levelAchieved
	    );

		HideStartMenuElements();
		ShowBackButton();

		vrExplanatoryText.hidden = false;
		vrModeLaunchButton.hidden = false;
		vrExplanatoryText.alphaFromTo(1.0f, 0.0f, 0.8f, Easing.Sinusoidal.easeOut);
		vrModeLaunchButton.alphaFromTo( 1.0f, 0.0f, 0.4f, Easing.Sinusoidal.easeInOut);
	} else {
		return;
	}
}

function LaunchVRMode() {
	fallingLaunchComponent.EnableVRMode();

    FallingLaunch.Analytics.Event(
        "VRModeEnter:" + FallingLaunch.vrModeAnalyticsString +
        Screen.orientation,
        FallingLaunch.levelAchieved
    );

	// NB: If your phone is tilted a little beyond flat (away from you) on level load,
	// then all other game objects will be behind you when you look up: 180deg wrong
	// in the Z direction (e.g. 90 vs -90 (aka 270) degrees). May need to apply an inverse
	// quaternion in some cases based on Head gaze direction/ gameObj position,
	// or in the menu UI, ensure the phone orientation is not flat before
	// letting the user load the scene.

	// HACK: But as a temporary workaround, force landscape left orientation
	// in VR for Cardboard compatibility (Google's SDK also enforces this mode
	// with 'tilt your phone' UI when device is in landscape right):
	fallingLaunchComponent.LockLandscapeLeftOrientation(FallingLaunch.isVRMode);
	ResumeGame();
}

function ShowOptions() {
	fadeInOptions();
	DisplayTiltChooser();
	HideStartMenuElements();
	ShowBackButton();
}

function HideOptions() {
	tiltText2.hidden = true;
	invertHorizAxisText.hidden = true;
	invertVertAxisText.hidden = true;

	invertHorizAxisTextYes.hidden = true;
	invertHorizAxisTextNo.hidden = true;
	invertVertAxisTextYes.hidden = true;
	invertVertAxisTextNo.hidden = true;

	angledTiltChooser.hidden = true;
	flatTiltChooser.hidden = true;
	verticalTiltChooser.hidden = true;

	if (PlayerPrefs.HasKey("LatestLevel")) {
		optionsButton.hidden = false;
		optionsButton.alphaFromTo(1.0f, 0.0f, 1.0f, Easing.Sinusoidal.easeOut);
	}

}


function fadeInOptions() {
	optionsButton.hidden = true;
	tiltText2.hidden = false;
	invertHorizAxisText.hidden = false;
	invertVertAxisText.hidden = false;

	invertHorizAxisText.alphaFromTo(1.0f, 0.0f, 1.0f, Easing.Sinusoidal.easeIn);
	invertVertAxisText.alphaFromTo(1.0f, 0.0f, 1.0f, Easing.Sinusoidal.easeIn);

	if (FallingLaunch.invertVertAxisVal == -1) {
		invertVertAxisTextNo.hidden = true;
		invertVertAxisTextYes.hidden = false;
		invertVertAxisTextYes.alphaFromTo(1.0f, 0.0f, 0.75f, Easing.Sinusoidal.easeIn);
	}
	else {
		invertVertAxisTextNo.hidden = false;
		invertVertAxisTextYes.hidden = true;
		invertVertAxisTextNo.alphaFromTo(1.0f, 0.0f, 0.4f, Easing.Sinusoidal.easeIn);
	}

	if (FallingLaunch.invertHorizAxisVal == -1) {
		invertHorizAxisTextNo.hidden = true;
		invertHorizAxisTextYes.hidden = false;
		invertHorizAxisTextYes.alphaFromTo(1.0f, 0.0f, 0.75f, Easing.Sinusoidal.easeIn);
	}
	else {
		invertHorizAxisTextNo.hidden = false;
		invertHorizAxisTextYes.hidden = true;
		invertHorizAxisTextNo.alphaFromTo(1.0f, 0.0f, 0.4f, Easing.Sinusoidal.easeIn);
	}

}

function SaveAxesPrefs( invert : int) {
	if (isSaving == false) {
		isSaving = true;
		if (invert == 1) {
			FallingLaunch.invertVertAxisVal = -1;
			PlayerPrefs.SetInt("invertVertAxis", 1);
		}
		if (invert == 2) {
			FallingLaunch.invertVertAxisVal = 1;
			PlayerPrefs.SetInt("invertVertAxis", -1);
		}
		if (invert == 3) {
			FallingLaunch.invertHorizAxisVal = -1;
			PlayerPrefs.SetInt("invertHorizAxis", 1);
		}
		if (invert == 4) {
			FallingLaunch.invertHorizAxisVal = 1;
			PlayerPrefs.SetInt("invertHorizAxis", -1);
		}

		isSaving = false;
	}
}

function DoInvertedVertAxis() {
		SaveAxesPrefs(1);
		invertVertAxisTextYes.hidden = false;
		invertVertAxisTextNo.hidden = true;
}


function UndoInvertedVertAxis() {
		SaveAxesPrefs(2);
		invertVertAxisTextYes.hidden = true;
		invertVertAxisTextNo.hidden = false;
}

function DoInvertedHorizAxis() {
		SaveAxesPrefs(3);
		invertHorizAxisTextYes.hidden = false;
		invertHorizAxisTextNo.hidden = true;
}

function UndoInvertedHorizAxis() {
		SaveAxesPrefs(4);
		invertHorizAxisTextYes.hidden = true;
		invertHorizAxisTextNo.hidden = false;
}


function HideStartMenuElements() {
	rightArrow.hidden = true;
	leftArrow.hidden = true;
	aboutButtonStart.hidden = true;
	howToButton.hidden = true;
	optionsButton.hidden = true;

	vrModeButton.hidden = true;

	appStoreButtonHomeBg.hidden = true;
	appStoreButtonHomeText.hidden = true;
	//angledTiltChooser.hidden = true;
	//flatTiltChooser.hidden = true;
}

function ShowBackButton() {
	BackToPauseMenuButton.hidden = false;
	BackToPauseMenuButton.alphaFromTo(1.0f, 0.0f, 1.0f, Easing.Sinusoidal.easeIn);
}

function DoNothing() {
	return;
}

function LoadLevel1ViaStart() {
	StartLevelLoad(level1);
}

function LoadLevel2ViaStart() {
	StartLevelLoad(level2);
}

function LoadLevel3ViaStart() {
	StartLevelLoad(level3);
}

function LoadLevel4ViaStart() {
	StartLevelLoad(level4);
}

function OpenFallingSite() {
	var urlToOpen : String = "http://tysonkubota.net/skydrift?utm_source=skydrift-game&utm_medium=ios&utm_campaign=skydrift-gui";
	// use a float instead of an int, as required by the GameAnalytics SDK:
	FallingLaunch.Analytics.Event("OpenURL:FallingSite", FallingLaunch.levelAchieved*1.0);
	Application.OpenURL(urlToOpen);
}

function OpenAppStorePage() {
	var urlToOpen : String = "https://itunes.apple.com/us/app/skydrift/id728636851?action=write-review&mt=8";
	// use a float instead of an int, as required by the GameAnalytics SDK:
	FallingLaunch.Analytics.Event("OpenURL:AppStorePage", FallingLaunch.levelAchieved*1.0);
	Application.OpenURL(urlToOpen);
}

function HideGUI() {
	pauseButton.hidden = true;
}

function UnhideGUI() {
	pauseButton.hidden = true;
	pauseButton.alphaFromTo( 1.0f, 0.0f, 1.0f, Easing.Quartic.easeIn);
}

function fadeInRightArrow() {
	rightArrow.alphaTo(.05f, 1.0f, Easing.Sinusoidal.easeOut);
}

function fadeInLeftArrow() {
	leftArrow.alphaTo(.05f, 1.0f, Easing.Sinusoidal.easeOut);
}

function fadeOutRightArrow() {
	rightArrow.alphaTo(.25f, 0.4f, Easing.Sinusoidal.easeOut);
}

function fadeOutLeftArrow() {
	leftArrow.alphaTo(.25f, 0.4f, Easing.Sinusoidal.easeOut);
}

function fadeInVRLaunchButton() {
	vrModeLaunchButton.alphaTo(.05f, 1.0f, Easing.Sinusoidal.easeOut);
}

function fadeOutVRLaunchButton() {
	vrModeLaunchButton.alphaTo(.25f, 0.4f, Easing.Sinusoidal.easeOut);
}

function fadeInLoadNewLevels() {
	loadLevelOne.alphaFromTo(.5f, 0.0f, 0.4f, Easing.Sinusoidal.easeOut);

	if (level2Unlocked) {loadLevelTwo.alphaFromTo(.5f, 0.0f, 0.4f, Easing.Sinusoidal.easeOut);}
	else {loadLevelTwo.alphaFromTo(.25f, 0.0f, 0.05f, Easing.Sinusoidal.easeOut);}

	if (level3Unlocked)	{loadLevelThree.alphaFromTo(.5f, 0.0f, 0.4f, Easing.Sinusoidal.easeOut);}
	else {loadLevelThree.alphaFromTo(.25f, 0.0f, 0.05f, Easing.Sinusoidal.easeOut);}

	if (level4Unlocked) {loadLevelFour.alphaFromTo(.5f, 0.0f, 0.4f, Easing.Sinusoidal.easeOut);}
	else {loadLevelFour.alphaFromTo(.25f, 0.0f, 0.05f, Easing.Sinusoidal.easeOut);}
}

function fadeInPauseMenu() {
	rightArrow.alphaFromTo( 0.5, 0.0, 0.4, Easing.Sinusoidal.easeInOut);
	leftArrow.alphaFromTo( 0.5, 0.0, 0.4, Easing.Sinusoidal.easeInOut);
	aboutButtonStart.alphaFromTo( 0.5, 0.0, 1.0, Easing.Sinusoidal.easeIn);
	howToButton.alphaFromTo( 0.5, 0.0, 1.0, Easing.Sinusoidal.easeIn);
	
	if (!FallingLaunch.isTablet) {
		vrModeButton.alphaFromTo( 0.5, 0.0, 1.0, Easing.Sinusoidal.easeIn);
	}

	if (FallingLaunch.NewGamePlus) {
		appStoreButtonHomeText.alphaFromTo( 1.0, 0.0, 1.0, Easing.Sinusoidal.easeIn);
	}
}

function downLevel1() {
	if (aboutToLoad == false) {
		loadLevelOne.alphaTo(.05f, 1.0f, Easing.Sinusoidal.easeOut);
	}
}

function downLevel2() {
	if (aboutToLoad == false) {
		loadLevelTwo.alphaTo(.05f, 1.0f, Easing.Sinusoidal.easeOut);
	}
}

function downLevel3() {
	if (aboutToLoad == false) {
		loadLevelThree.alphaTo(.05f, 1.0f, Easing.Sinusoidal.easeOut);
	}
}

function downLevel4() {
	if (aboutToLoad == false) {
		loadLevelFour.alphaTo(.05f, 1.0f, Easing.Sinusoidal.easeOut);
	}
}

function upLevel1() {
	if (aboutToLoad == false) {
		loadLevelOne.alphaTo(.25f, 0.8f, Easing.Sinusoidal.easeOut);
	}
}

function upLevel2() {
	if (aboutToLoad == false) {
		loadLevelTwo.alphaTo(.25f, 0.8f, Easing.Sinusoidal.easeOut);
	}
}

function upLevel3() {
	if (aboutToLoad == false) {
		loadLevelThree.alphaTo(.25f, 0.8f, Easing.Sinusoidal.easeOut);
	}
}

function upLevel4() {
	if (aboutToLoad == false) {
		loadLevelFour.alphaTo(.25f, 0.8f, Easing.Sinusoidal.easeOut);
	}
}
