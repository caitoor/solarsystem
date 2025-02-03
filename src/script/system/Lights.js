import * as THREE from 'three';

export function createLights(scene, sun) {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.88);
    scene.add(ambientLight);

    const sunLight = new THREE.PointLight(0xffffff, 10000, 250000);
    // Setze die Position auf die Weltposition der Sonne
    sunLight.position.copy(sun.position);
    scene.add(sunLight);
}
