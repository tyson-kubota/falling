#pragma strict

var dir:float = 1;

function Start () {
}

function Update () {
    transform.Rotate(Vector3.up * (dir*3) * Time.deltaTime, Space.World);
}
