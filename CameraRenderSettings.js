/*
 This script lets you change all render settings per camera.

*/

// Public variables -- set these in the inspector
var fog = RenderSettings.fog;
var fogColor = RenderSettings.fogColor;
var fogDensity = RenderSettings.fogDensity;
var ambientLight = RenderSettings.ambientLight;
var haloStrength = RenderSettings.haloStrength;
var flareStrength = RenderSettings.flareStrength;

// Private variables -- used to reset the render settings after the current camera has been rendered
private var _global_fog = RenderSettings.fog;
private var _global_fogColor = RenderSettings.fogColor;
private var _global_fogDensity = RenderSettings.fogDensity;
private var _global_ambientLight = RenderSettings.ambientLight;
private var _global_haloStrength = RenderSettings.haloStrength;
private var _global_flareStrength = RenderSettings.flareStrength;

private var dirty = false; // Used to flag that the render settings have been overridden and need a restore

function OnPreRender () {
    if (! enabled ) return; // If the component is disabled, use the global render settings

    // Save global render state:
    _global_fog = RenderSettings.fog;
    _global_fogColor = RenderSettings.fogColor;
    _global_fogDensity = RenderSettings.fogDensity;
    _global_ambientLight = RenderSettings.ambientLight;
    _global_haloStrength = RenderSettings.haloStrength;
    _global_flareStrength = RenderSettings.flareStrength;


    // Set local settings:
    RenderSettings.fog = fog;
    RenderSettings.fogColor = fogColor;
    RenderSettings.fogDensity = fogDensity;
    RenderSettings.ambientLight = ambientLight;
    RenderSettings.haloStrength = haloStrength;
    RenderSettings.flareStrength = flareStrength;

    dirty=true;
}

function OnPostRender () {
    if (! dirty ) return; // If the component was disabled in OnPreRender, then don't restore

    // Restore global settings:
    RenderSettings.fog = _global_fog;
    RenderSettings.fogColor = _global_fogColor;
    RenderSettings.fogDensity = _global_fogDensity;
    RenderSettings.ambientLight = _global_ambientLight;
    RenderSettings.haloStrength = _global_haloStrength;
    RenderSettings.flareStrength = _global_flareStrength;

    dirty=false;
}

// Reset the component to revert to the current global settings
function Reset () {
    fog = RenderSettings.fog;
    fogColor = RenderSettings.fogColor;
    fogDensity = RenderSettings.fogDensity;
    ambientLight = RenderSettings.ambientLight;
    haloStrength = RenderSettings.haloStrength;
    flareStrength = RenderSettings.flareStrength;
}


@script AddComponentMenu ("Rendering/Per Camera Render Settings")
@script RequireComponent (Camera)