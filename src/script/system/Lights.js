import * as THREE from 'three';

export function createLights(scene) {
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 2); // Weiches Umgebungslicht
    scene.add(ambientLight);

    const sunLight = new THREE.PointLight(0xffffff, 1.5, 500);
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);
}
