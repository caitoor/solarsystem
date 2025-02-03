import * as THREE from 'three';
import { LIGHT_SETTINGS } from '../../config/constants';

export function createLights(scene, sun) {
    const ambientLight = new THREE.AmbientLight(
        LIGHT_SETTINGS.ambientDefault.color,
        LIGHT_SETTINGS.ambientDefault.intensity
    );
    scene.add(ambientLight);

    const sunLight = new THREE.PointLight(
        LIGHT_SETTINGS.sunlightDefault.color,
        LIGHT_SETTINGS.sunlightDefault.intensity,
        LIGHT_SETTINGS.sunlightDefault.distance,
    );
    sunLight.position.copy(sun.position);
    sunLight.shadow.mapSize.width = 4096;
    sunLight.shadow.mapSize.height = 4096;
    sunLight.shadow.camera.near = 2;
    sunLight.shadow.camera.far = 50;
    sunLight.castShadow = true;
    sunLight.shadow.radius = 5;
    scene.add(sunLight);
}
