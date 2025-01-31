import * as THREE from 'three';

export function createOrbits(scene, planets) {
    planets.forEach(planet => {
        const distance = planet.userData.distance;
        const orbitGeometry = new THREE.RingGeometry(distance - 0.1, distance + 0.1, 64);
        const orbitMaterial = new THREE.MeshBasicMaterial({ color: 0x222222, side: THREE.DoubleSide });
        const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
        orbit.rotation.x = Math.PI / 2;
        scene.add(orbit);
    });
}