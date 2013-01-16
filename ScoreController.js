#pragma strict

var customscore : GUIStyle;
//var myscore = visibleScore.ToString();

// Keep track of the players main score
static var currentScore : float = 20f;
static var maxScore = 25f;

// Keep track of the currently visible score
static var visibleScore : float = 20f;

function Start() {
	currentScore = 20;
//	ResetScoreNow(0);
}

// Animate score changes using iTween's ValueTo
function AnimateVisibleScore () {

    iTween.ValueTo ( gameObject,
        {
            "from" : visibleScore,
            "to" : currentScore,
            "onupdate" : "ChangeVisibleScore",
            "time" : 1
        }
    );

}

function AnimateVisibleScoreNow () {

    iTween.ValueTo ( gameObject,
        {
            "from" : currentScore,
            "to" : visibleScore,
            "onupdate" : "ChangeCurrentScore",
            "time" : 0.25
        }
    );

}

// Change the currently visible score. Called every time iTween changes my
// visibleScore variable
function ChangeVisibleScore ( i : float ) {
    visibleScore = i;
}
function ChangeCurrentScore ( i : float ) {
    currentScore = i;
}

function LerpVisibleScore (){
	visibleScore = Mathf.Lerp(visibleScore, currentScore, 1);
}

function LerpVisibleScoreNow (){
	visibleScore = Mathf.Lerp(visibleScore, currentScore, .25);
}

// Increment Score
function IncrementScore ( i : float ) {
    currentScore += i;
    if (currentScore > maxScore) {
    	currentScore = maxScore;
    	}
	AnimateVisibleScore ();
}

// Increment Score immediately
function IncrementScoreNow ( i : float ) {
    visibleScore = (currentScore + i);
    if (currentScore > maxScore) {
    	currentScore = maxScore;
 	   	}    
	AnimateVisibleScoreNow ();
}

// Decrement Score
function DecrementScore ( i : float ) {
    currentScore -= i;
//	AnimateVisibleScore ();
	LerpVisibleScore ();
}

// Decrement Score immediately
function DecrementScoreNow ( i : float ) {
    currentScore -= i;
//	AnimateVisibleScoreNow ();
	LerpVisibleScoreNow ();
}

function ZeroScore ( i : float ) {
    currentScore = 0;
//        currentScore = (currentScore - visibleScore);
	AnimateVisibleScore ();
}

function ResetScore ( i : float ) {
    currentScore = 20;
//        currentScore = (currentScore - visibleScore);
//	AnimateVisibleScore ();
}

function ResetScoreNow ( i : float ) {
    currentScore = 20;
//        currentScore = (currentScore - visibleScore);
//	AnimateVisibleScoreNow ();
}