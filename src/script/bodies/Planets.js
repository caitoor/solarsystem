import * as THREE from 'three';

export function createPlanets(scene) {
    const planets = [
        { name: 'Mercury', color: 0xaaaaaa, distance: 10, size: 0.5, speed: 0.02 },
        { name: 'Venus', color: 0xffcc00, distance: 15, size: 1.2, speed: 0.015 },
        { name: 'Earth', color: 0x0033ff, distance: 20, size: 1.3, speed: 0.01 },
        { name: 'Mars', color: 0xff3300, distance: 25, size: 0.7, speed: 0.008 },
        { name: 'Jupiter', color: 0xff8800, distance: 35, size: 4.0, speed: 0.005 },
        { name: 'Saturn', color: 0xffddaa, distance: 45, size: 3.5, speed: 0.004 },
        { name: 'Uranus', color: 0x66aaff, distance: 55, size: 2.8, speed: 0.003 },
        { name: 'Neptune', color: 0x3366ff, distance: 65, size: 2.6, speed: 0.002 }
    ];

    const planetMeshes = [];

    planets.forEach((planet, index) => {
        const geometry = new THREE.SphereGeometry(planet.size, 32, 32);
        const material = new THREE.MeshStandardMaterial({ color: planet.color });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.userData = { angle: Math.random() * Math.PI * 2, speed: planet.speed, distance: planet.distance };
        scene.add(mesh);
        planetMeshes.push(mesh);
    });

    return planetMeshes;
}