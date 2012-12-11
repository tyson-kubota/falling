static var Counter : int = 0;

function OnTriggerEnter (other : Collider) {
     if (other.gameObject.CompareTag ("Score"))
   {
      Debug.Log("You scored!");
      Counter++;
         }
}