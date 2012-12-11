var speed = 5.0;
function Update () {
var x = Input.GetAxis("Horizontal") * Time.deltaTime * speed;
var z = Input.GetAxis("Vertical") * Time.deltaTime * speed;
transform.Translate(x, 0, z);
}