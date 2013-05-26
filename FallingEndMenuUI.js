#pragma strict

var endGameSprite : UISprite;

var theEndLabel : UISprite;
var aboutButton : UIButton;
var homeButton : UIButton;
var newGameButton : UIButton;

var textHeight : int;

var homeLevel : String = "Falling-scene-menu";

function Start () {

	textHeight = (UI.isHD == true) ? 18 : 18;

	theEndLabel = UI.firstToolkit.addSprite( "theend.png", 0, 0, 0 );
	theEndLabel.positionCenter();
	theEndLabel.hidden = true;
	
	endGameSprite = UI.firstToolkit.addSprite( "tutorialBackground.png", 0, 0, 2 );
	endGameSprite.hidden = true;
	endGameSprite.scaleTo( 0.1f, new Vector3( (Screen.width), 3, 1 ), Easing.Sinusoidal.easeOut);
	
	aboutButton = UIButton.create("about.png","about.png", 40, 40);
	aboutButton.pixelsFromBottomLeft(textHeight, textHeight);
	aboutButton.normalTouchOffsets = new UIEdgeOffsets( 30 );
	aboutButton.highlightedTouchOffsets = new UIEdgeOffsets( 30 );
//	aboutButton.onTouchUpInside += OpenAbout;
	aboutButton.hidden = true;
	
	newGameButton = UIButton.create("newgame.png","newgame.png", 40, 40);
	newGameButton.pixelsFromBottomRight(textHeight, textHeight);	
	newGameButton.normalTouchOffsets = new UIEdgeOffsets( 30 );
	newGameButton.highlightedTouchOffsets = new UIEdgeOffsets( 30 );
//	newGameButton.onTouchUpInside += NewLevel;
	newGameButton.hidden = true;

	homeButton = UIButton.create("home.png","home.png", 40, 40);
	homeButton.centerize();
//	homeButton.pixelsFromBottom (- fallingUITest.spriteEdgeSize * 3);
	homeButton.pixelsFromBottom(textHeight);
	homeButton.onTouchUpInside += LoadHome;
	homeButton.hidden = true;

}

function ShowEndGameUI() {
	endGameSprite.centerize();
	endGameSprite.pixelsFromBottom (- fallingUITest.spriteEdgeSize * 3);
	
	yield WaitForSeconds(1);
	
	theEndLabel.hidden = false;
	theEndLabel.alphaFromTo( 3.0f, 0f, 1.0f, Easing.Sinusoidal.easeIn);

	yield WaitForSeconds(3);
	aboutButton.hidden = false;
	newGameButton.hidden = false;
	homeButton.hidden = false;
	endGameSprite.hidden = false;

	aboutButton.alphaFromTo( 2.5f, 0.0f, 1.0f, Easing.Sinusoidal.easeIn);
	newGameButton.alphaFromTo( 2.5f, 0.0f, 1.0f, Easing.Sinusoidal.easeIn);
	homeButton.alphaFromTo( 2.5f, 0.0f, 1.0f, Easing.Sinusoidal.easeIn);
	endGameSprite.alphaFromTo( 2.0f, 0f, 0.25f, Easing.Sinusoidal.easeIn);
	
	// add anything else that requires main uitoolkit instance
}


function LoadHome() {

//	var delay : float = 2;

//	aboutButton.alphaTo( 2, 0, Easing.Sinusoidal.easeOut);
//	newGameButton.alphaTo( 2, 0, Easing.Sinusoidal.easeOut);
//	homeButton.alphaTo( 2, 0, Easing.Sinusoidal.easeOut);
//	endGameSprite.alphaTo( 2, 0, Easing.Sinusoidal.easeOut);
//	theEndLabel.alphaTo( 2, 0, Easing.Sinusoidal.easeOut);

//	yield WaitForSeconds(2);

	theEndLabel.hidden = true;
	
	aboutButton.hidden = true;
	newGameButton.hidden = true;
	homeButton.hidden = true;
	endGameSprite.hidden = true;
	
//	fallingUITest.loadingLabel.hidden = false;
	
	Application.LoadLevel(homeLevel);
//	Time.timeScale = savedTimeScale;
}
