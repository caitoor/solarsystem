import * as THREE from 'three';

export function createLights(scene, sunMesh) {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.08);
    scene.add(ambientLight);

    const sunLight = new THREE.PointLight(0xffffff, 5000, 25000);
    // Setze die Position auf die Weltposition der Sonne
    sunLight.position.copy(sunMesh.position);
    scene.add(sunLight);
}
