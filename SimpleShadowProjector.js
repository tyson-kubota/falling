//This script controls the shadows of enemies....

#pragma strict
#pragma implicit
#pragma downcast

var Shadow:GameObject;
private var ShadowObject:GameObject;
var target:Transform;
var mask : LayerMask = -1;


private var General_Manager:GameObject;

 /*
function Awake(){
General_Manager = GameObject.Find("_2_General_Manager");
}
*/

function Start(){

ShadowObject=Instantiate(Shadow, transform.position, transform.rotation);
ShadowObject.transform.parent=gameObject.transform;
var ShadowObj : GameObject;
ShadowObj = new GameObject ("ShadowObj");
ShadowObj.transform.parent= transform.parent;
target=ShadowObj.transform;

}

function Update(){
ShadowObject.transform.rotation=gameObject.transform.rotation;
    var hit:RaycastHit;
    if (Physics.Linecast (transform.position, target.position, hit, mask.value))
    {
            ShadowObject.GetComponent(MeshRenderer).enabled=true;
            ShadowObject.transform.position = hit.point + Vector3(0,0,1);
    }

    if (!Physics.Linecast (transform.position, target.position, hit, mask.value))
    {
    ShadowObject.GetComponent(MeshRenderer).enabled=false;
    }
}