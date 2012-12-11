#pragma strict

var objectOne : GameObject;
var objectTwo : GameObject;
var lineRenderer : LineRenderer;
var lineMaterial : Material;

function Start () {
lineRenderer = gameObject.AddComponent(LineRenderer);
lineRenderer.SetPosition(0, new Vector3(objectOne.transform.position.x,objectOne.transform.position.y,objectOne.transform.position.z ));
lineRenderer.SetPosition(1, new Vector3(objectTwo.transform.position.x,objectTwo.transform.position.y,objectTwo.transform.position.z ));
lineRenderer.material = lineMaterial;
lineRenderer.SetWidth(30,30);
}

function Update () {

	
}