#pragma strict

var customscore : GUIStyle;
//var myscore = visibleScore.ToString();

// Keep track of the players main score
static var currentScore : float = 20f;
static var maxScore = 25f;

// Keep track of the currently visible score
static var visibleScore : float = 20f;

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
            "from" : visibleScore,
            "to" : currentScore,
            "onupdate" : "ChangeVisibleScore",
            "time" : 0.25
        }
    );

}

// Change the currently visible score. Called every time iTween changes my
// visibleScore variable
function ChangeVisibleScore ( i : float ) {
    visibleScore = i;
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
    currentScore += i;
    if (currentScore > maxScore) {
    	currentScore = maxScore;
 	   	}    
	AnimateVisibleScoreNow ();
}

// Decrement Score
function DecrementScore ( i : float ) {
    currentScore -= i;
	AnimateVisibleScore ();
}

// Decrement Score immediately
function DecrementScoreNow ( i : float ) {
    currentScore -= i;
	AnimateVisibleScoreNow ();
}

function ZeroScore ( i : float ) {
    currentScore = 0;
//        currentScore = (currentScore - visibleScore);
	AnimateVisibleScore ();
}

function ResetScore ( i : float ) {
    currentScore = 20;
//        currentScore = (currentScore - visibleScore);
	AnimateVisibleScore ();
}