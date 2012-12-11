var Button1 : Texture2D;
var Button2 : Texture2D;
var Leveltoload : String;
var isquit = false;
var Sound : AudioClip;

function OnMouseEnter()
{
	guiTexture.texture = Button2;
	audio.PlayOneShot(Sound);
}

function OnMouseExit()
{
	guiTexture.texture = Button1;
}

function OnMouseUp()
{
	if (isquit)
	{
		Application.Quit();
	}
	else
	{
		Application.LoadLevel(Leveltoload);
	}
}

