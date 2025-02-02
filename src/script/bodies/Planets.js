import * as THREE from 'three';
import planetsData from '../../data/planets.json';
import { SCALING_FACTORS } from '../../config/constants.js';

export function createPlanets(scene) {
    const textureLoader = new THREE.TextureLoader();
    const planetMeshes = [];

    planetsData.forEach((planet) => {
        // Determine visual size (adjust scaling as desired)
        const radius = Math.sqrt(planet.meanRadius / SCALING_FACTORS.bodySize);
        const geometry = new THREE.SphereGeometry(radius, 32, 32);
        // Load texture based on englishName in lowercase
        const texture = textureLoader.load(`/assets/textures/${planet.englishName.toLocaleLowerCase()}.jpg`);
        const material = new THREE.MeshStandardMaterial({ map: texture });
        const mesh = new THREE.Mesh(geometry, material);

        // Set orbital parameters.
        // Here, 'distance' is derived from semimajorAxis.
        // We also use planet.eccentricity, planet.inclination (in degrees),
        // and add an extra orbital orientation parameter:
        const argument = planet.argPeriapsis || 0; // in degrees
        mesh.userData = {
            angle: Math.random() * Math.PI * 2,
            speed: 1 / planet.sideralOrbit,
            distance: Math.sqrt(planet.semimajorAxis / SCALING_FACTORS.orbits),
            eccentricity: planet.eccentricity || 0,
            rotationSpeed: 1 / planet.sideralRotation,
            inclination: planet.inclination || 0, // degrees
            argument: argument // orbital rotation in the orbital plane (degrees)
        };

        // Compute ellipse parameters for the orbit:
        const a = mesh.userData.distance;            // semimajor axis
        const e = mesh.userData.eccentricity;          // eccentricity
        const b = a * Math.sqrt(1 - e * e);            // semiminor axis
        const centerX = -a * e;                        // offset so that focus is at (0,0)
        const t = mesh.userData.angle;                 // current orbital parameter

        // Compute unrotated (uninclined, un-oriented) position in the x-z plane:
        const x_un = centerX + a * Math.cos(t);
        const z_un = b * Math.sin(t);

        // Apply the orbital orientation (argument of periapsis)
        const phi = THREE.MathUtils.degToRad(mesh.userData.argument);
        const x_oriented = x_un * Math.cos(phi) - z_un * Math.sin(phi);
        const z_oriented = x_un * Math.sin(phi) + z_un * Math.cos(phi);

        // Apply the orbit inclination (rotation about x-axis)
        const inc = THREE.MathUtils.degToRad(mesh.userData.inclination);
        mesh.position.x = x_oriented;
        mesh.position.y = z_oriented * Math.sin(inc);
        mesh.position.z = z_oriented * Math.cos(inc);

        scene.add(mesh);
        planetMeshes.push(mesh);
    });

    return planetMeshes;
}
