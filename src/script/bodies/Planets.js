import * as THREE from 'three';
import planetsData from '../../data/planets.json';

export function createPlanets(scene) {
    const textureLoader = new THREE.TextureLoader();
    const planetMeshes = [];

    planetsData.forEach((planet) => {
        const geometry = new THREE.SphereGeometry(Math.sqrt(planet.meanRadius / 20000), 32, 32);
        const texture = textureLoader.load(`/assets/textures/${planet.englishName.toLocaleLowerCase()}.jpg`);
        const material = new THREE.MeshStandardMaterial({ map: texture });
        const mesh = new THREE.Mesh(geometry, material);

        mesh.userData = {
            angle: Math.random() * Math.PI * 2,
            speed: 1 / planet.sideralOrbit,
            distance: Math.sqrt(planet.semimajorAxis / 500000),
            rotationSpeed: 1 / planet.sideralRotation
        };
        // Position the planet along its orbit (initially on the x-axis)
        mesh.position.x = planet.distance;
        scene.add(mesh);
        planetMeshes.push(mesh);
    });

    return planetMeshes;
}
