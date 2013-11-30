#pragma strict

// Capture frames as a screenshot sequence. Images are
// stored as PNG files in a folder - these can be combined into
// a movie using image utility software (eg, QuickTime Pro).
// The folder to contain our screenshots.
// If the folder exists we will append numbers to create an empty folder.
var folder = "ScreenshotFolder";
var frameRate = 30;
var sequenceName = "mySequence";
 
function Start () {
    // Set the playback framerate (real time will not relate to game time after this).
    Time.captureFramerate = frameRate;
 
    // Create the folder
    System.IO.Directory.CreateDirectory(folder);
}
 
function Update () {
    // Append filename to folder name (format is '0005 shot.png"')
    var name = String.Format("{0}/{1:D04} shot.png", folder, Time.frameCount );
 
	// When superSize parameter is larger than 1, a larger resolution screenshot will be produced. 
	// For example, passing 4 will make the screenshot be 4x4 larger than it normally would. 
	// This is useful to produce screenshots for printing.

    // Capture the screenshot to the specified file.
    Application.CaptureScreenshot(name, 2);
}
