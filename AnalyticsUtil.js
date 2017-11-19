#pragma strict

function Event (eventString: String, eventArg: float) {
    // Debug.Log("Received event " + eventString + " with arg: " + eventArg);
    GameAnalyticsSDK.GameAnalytics.NewDesignEvent(eventString, eventArg);
}