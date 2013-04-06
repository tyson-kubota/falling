#pragma strict

var projectilePrefab : Rigidbody;
var launchInterval : float = 10.0;
private var isLaunched : boolean = false;

// Starting in 2 seconds.
// a projectile will be launched every 5 seconds

// You can control whether projectile collides with world objects
// via Unity's physics collision matrix (put projectile on its own layer).

function OnBecameVisible () {
// only launch invokeRepeating once
	if (isLaunched == false) {
		isLaunched = true;
		InvokeRepeating("LaunchProjectile", 0, launchInterval);
	}
}

function LaunchProjectile () {
    var instance : Rigidbody = Instantiate(projectilePrefab, transform.position, transform.rotation);
//    instance.velocity = Random.insideUnitSphere * 5;
}