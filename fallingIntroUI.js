#pragma strict

var scriptName : GameObject;
static var currentIcon : UISprite;
private var tutorialObjVR : GameObject;
private var iconVRMatl : Material;
private var iconVRRenderer : Renderer;

function Start () {
	tutorialObjVR = gameObject.Find("tutorial-vr-ui-group");
}

function ShowIcon(icon : UISprite, timer : float, bgIcon : UISprite) {
//	tutorialSpritePosition(timer);
	
	if (currentIcon) {
		currentIcon.hidden = true;
		bgIcon.hidden = true;
	}
	currentIcon = icon;		
	icon.hidden = false;
	bgIcon.hidden = false;
	icon.alphaFromTo( 1.0f, 0.0f, 1.0f, Easing.Sinusoidal.easeIn);
	if (FallingPlayer.isAlive == 0) {icon.hidden = true; bgIcon.hidden = true; return;}
	yield WaitForSeconds (timer/2);
	if (FallingPlayer.isAlive == 0) {icon.hidden = true; bgIcon.hidden = true; return;}
	yield WaitForSeconds (timer/2);
	if (FallingPlayer.isAlive == 0) {icon.hidden = true; bgIcon.hidden = true; return;}
	icon.alphaTo( 2.0f, 0.0f, Easing.Sinusoidal.easeOut);
	yield WaitForSeconds (2);
	icon.hidden = true;
}

function ShowIconVR(iconName : String, timer : float) {
	// TODO: Improve perf by grabbing and caching these in Start?
	// find corresponding gameObject in children:
	// Debug.Log("Showing " + iconName);
	var thisIcon : GameObject = tutorialObjVR.transform.Find(iconName).gameObject;

	if (thisIcon) {
		thisIcon.SetActive(true);
	    iconVRRenderer = thisIcon.GetComponent.<Renderer>();
	    iconVRMatl = iconVRRenderer.material;
	    // iconVRMatl.color.a = 1;
		FadeIconVR(timer/4, FadeDir.In);

	    yield WaitForSeconds (timer/2);
	    if (FallingPlayer.isAlive == 0) {
	    	iconVRMatl.color.a = 0; thisIcon.SetActive(false); return;
	    }
	    yield WaitForSeconds (timer/4);

	    FadeIconVR(timer/4, FadeDir.Out);

	    yield WaitForSeconds (timer/4);
	    // iconVRMatl.color.a = 0;
	    thisIcon.SetActive(false);
	}
}

function FadeIconVR (timer : float, fadeType : FadeDir) {

    var start = fadeType == FadeDir.In ? 0.0 : 0.8;
    var end = fadeType == FadeDir.In ? 0.8 : 0.0;
    var i = 0.0;
    var step = 1.0/timer;

    while (i <= 1.0) {
        i += step * Time.deltaTime;
        iconVRMatl.color.a = Mathf.Lerp(start, end, i);
        yield;
        if (FallingPlayer.isAlive == 0) {iconVRMatl.color.a = 0.0; break;}
    }
}