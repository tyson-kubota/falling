#pragma strict

// Keep track of the player's main score
static var currentScore : float = 20f;
static var maxScore = 25f;

// Keep track of the currently visible score
static var visibleScore : float = 20f;

function Start() {
	currentScore = 20;
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
function ChangeVisibleScore ( i : float ) {visibleScore = i;}
function ChangeCurrentScore ( i : float ) {currentScore = i;}

function LerpVisibleScore (start : float, end : float, timer : float) {

    var i = 0.0;
    var step = 1.0/timer;

    while (i < 1.0) {
        i += step * Time.deltaTime;
        visibleScore = Mathf.Lerp(start, end, i);
        yield;
    }
}

//function IncrementScore ( i : float ) {
//    currentScore += i;
//    if (currentScore > maxScore) {currentScore = maxScore;}
//	AnimateVisibleScore ();}

function IncrementScore ( i : float ) {
	currentScore = (currentScore + i);
    if (currentScore > maxScore) {currentScore = maxScore;}
}

function DecrementScore ( i : float ) {
    currentScore -= i;
	LerpVisibleScore(visibleScore, currentScore, i);
}

function ZeroScore ( i : float ) {
    currentScore = 0;
	AnimateVisibleScore ();
}

function ResetScore ( i : float ) {currentScore = 20;}