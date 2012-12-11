var customscore : GUIStyle;
var myscore = visibleScore.ToString();

// Keep track of the players main score
static var currentScore : int = 10;
static var startingScore = 10f;

// Keep track of the currently visible score
var visibleScore : int = 10;

var native_width : float = 960;
var native_height : float = 640;

// Draw the score to the screen using Unity's GUI methods
function OnGUI () {
var rx : float = Screen.width / native_width;
var ry : float = Screen.height / native_height;
GUI.matrix = Matrix4x4.TRS (Vector3(0, 0, 0), Quaternion.identity, Vector3 (rx, ry, 1)); 

    GUILayout.BeginArea ( Rect ( 40, 40, 120, 120 ) );


//   GUILayout.BeginArea ( Rect ( 20, 20, Screen.width / 4, Screen.height / 4 ) );
    GUILayout.Box ( visibleScore.ToString (), customscore);
    GUILayout.EndArea ();

}


// Animate score changes using iTween's ValueTo
function AnimateVisibleScore () {

    iTween.ValueTo ( gameObject,
        {
            "from" : visibleScore,
            "to" : currentScore,
            "onupdate" : "ChangeVisibleScore",
            "time" : 0.2
        }
    );

}

// Change the currently visible score. Called every time iTween changes my
// visibleScore variable
function ChangeVisibleScore ( i : int ) {
    visibleScore = i;
}

// Increment Score
function IncrementScore ( i : int ) {
    currentScore += i;
    AnimateVisibleScore ();
}

// Decrement Score
function DecrementScore ( i : int ) {
    currentScore -= i;
    AnimateVisibleScore ();
}

function ZeroScore ( i : int ) {
    currentScore = 0;
//        currentScore = (currentScore - visibleScore);

    AnimateVisibleScore ();
}

function ResetScore ( i : int ) {
    currentScore = 10;
//        currentScore = (currentScore - visibleScore);

    AnimateVisibleScore ();
}