// src/bodies/Moons.js
import * as THREE from 'three';
import { DATA_FILTERS, SCALING_FACTORS } from '../../config/constants.js';
import moonsData from '../../data/moons.json';

/**
 * Creates moon meshes and adds them directly to the scene.
 * Each moon stores a reference to its parent planet for position updates.
 *
 * @param {THREE.Scene} scene - The scene to which the moons will be added.
 * @param {Array} planets - Array of planet meshes (each with userData.id set to the planet's ID).
 * @returns {Array} moonMeshes - Array of the created moon meshes.
 */
export function createMoons(scene, planets) {
    const moonMeshes = [];
    let skippedMoons = 0;

    moonsData.forEach(moon => {
        // Filter out moons below a minimum radius (if applicable)
        if (moon.meanRadius < DATA_FILTERS.minRadius) {
            skippedMoons++;
            return;
        }
        // Determine the parent planet from the moon's aroundPlanet field
        const parentPlanetId = moon.aroundPlanet ? moon.aroundPlanet.planet : null;
        if (!parentPlanetId) return;

        // Find the parent planet in the provided planets array (using userData.id)
        const parentPlanet = planets.find(p => p.userData.id === parentPlanetId);
        if (!parentPlanet) return;

        // Create the moon geometry using the meanRadius from the data and a scaling factor
        const moonRadius = Math.sqrt(moon.meanRadius / (SCALING_FACTORS.moons || SCALING_FACTORS.default));
        const geometry = new THREE.SphereGeometry(moonRadius, 16, 16);

        // Create a basic material (gray color for the moon)
        const material = new THREE.MeshStandardMaterial({ color: 0x888888 });
        const moonMesh = new THREE.Mesh(geometry, material);

        // Calculate the orbit distance from the moon's semimajorAxis (scaled appropriately)
        const orbitDistance = Math.sqrt(moon.semimajorAxis / (SCALING_FACTORS.moonOrbits || SCALING_FACTORS.orbits || SCALING_FACTORS.default));

        // Set up the moon's orbital parameters.
        // Note: orbitalSpeed is in radians per simulation day.
        moonMesh.userData = {
            id: moon.id,
            angle: Math.random() * Math.PI * 2,  // random starting angle
            orbitalSpeed: (2 * Math.PI) / moon.sideralOrbit,
            orbitDistance: orbitDistance,
            // Store a reference to the parent planet for later updates.
            parentPlanet: parentPlanet
        };

        // Set the initial local offset position relative to the parent planet.
        // This is the orbital position in the parent's local coordinate system.
        moonMesh.position.set(
            orbitDistance * Math.cos(moonMesh.userData.angle),
            0,
            orbitDistance * Math.sin(moonMesh.userData.angle)
        );

        // Add the moon directly to the scene (not as a child of the planet).
        // This prevents the parent's rotation from automatically affecting the moon.
        scene.add(moonMesh);
        moonMeshes.push(moonMesh);
    });

    console.log(`${moonMeshes.length} moons created.`);
    console.log(`${skippedMoons} moons skipped due to minRadius filter.`);
    return moonMeshes;
}
