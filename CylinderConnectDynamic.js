var cylinderPrefab : GameObject; //assumed to be 1m x 1m x 2m default unity cylinder to make calculations easy
var startobject : GameObject;
var endobject : GameObject;
var	width : float;
var cylinderParent : GameObject; 
var cylinder : GameObject;	

//added the start function for testing purposes
function Start()
{
//    CreateCylinderBetweenPoints(Vector3.zero, new Vector3(10, 10, 10), 0.5);
    CreateCylinderBetweenPoints(startobject.transform.position, endobject.transform.position, width);
}

function Update () {
   	UpdateCylinderBetweenPoints(startobject.transform.position, endobject.transform.position, width);
}

function CreateCylinderBetweenPoints(start : Vector3, end : Vector3, width)
{
    var offset = end - start;
    var scale = new Vector3(width, offset.magnitude / 2.0, width);
    var position = start + (offset / 2.0);

    cylinder = Instantiate(cylinderPrefab, position, Quaternion.identity);
    cylinder.transform.parent = cylinderParent.transform;
    cylinder.transform.up = offset;
    cylinder.transform.localScale = scale;
}

function UpdateCylinderBetweenPoints(start : Vector3, end : Vector3, width)
{
    var offset = end - start;
    var scale = new Vector3(width, offset.magnitude / 2.0, width);
    var position = start + (offset / 2.0);

    cylinder.transform.up = offset;
    cylinder.transform.position = position;
    cylinder.transform.localScale = scale;
}