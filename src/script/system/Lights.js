import * as THREE from 'three';

export function createLights(scene, sunMesh) {
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    // Erhöhe Intensity und Distance
    const sunLight = new THREE.PointLight(0xffffff, 3.0, 1000);
    sunLight.position.set(0, 0, 0);
    // Als Test: Hänge das Licht direkt an die Szene, um zu prüfen, ob die Planeten beleuchtet werden
    // scene.add(sunLight);
    // Wenn das funktioniert, kann man es wieder an die Sonne anhängen:
    //sunMesh.add(sunLight);
}
