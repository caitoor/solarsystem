// src/bodies/Moons.js
import * as THREE from 'three';
import { DATA_FILTERS, SCALING_FACTORS } from '../../config/constants.js';
import moonsData from '../../data/moons.json';
import moonTextures from '../../config/moonTextures.json';

export function createMoons(scene, planets) {
  const moonMeshes = [];
  let skippedMoons = 0;
  const textureLoader = new THREE.TextureLoader();

  moonsData.forEach(moon => {
    // Filter out moons below the minimum radius, if applicable.
    if (moon.meanRadius < DATA_FILTERS.minRadius) {
      skippedMoons++;
      return;
    }
    // Determine the parent planet from the moon's aroundPlanet field.
    const parentPlanetId = moon.aroundPlanet ? moon.aroundPlanet.planet : null;
    if (!parentPlanetId) return;

    // Find the parent planet in the provided planets array (using userData.id).
    const parentPlanet = planets.find(p => p.userData.id.toLowerCase() === parentPlanetId.toLowerCase());
    if (!parentPlanet) return;

    // Create the moon geometry using the meanRadius from the data and a scaling factor.
    const moonRadius = Math.sqrt(moon.meanRadius / (SCALING_FACTORS.moons || SCALING_FACTORS.default));
    const geometry = new THREE.SphereGeometry(moonRadius, 16, 16);

    // Determine the texture configuration for this moon.
    // We'll check if the moon appears in the "bodies" section; if not, use "default".
    let textureConfig = moonTextures.default;
    if (Array.isArray(moonTextures.bodies)) {
      const found = moonTextures.bodies.find(item =>
        (item.id && item.id.toLowerCase() === moon.id.toLowerCase()) ||
        (item.englishName && item.englishName.toLowerCase() === moon.englishName.toLowerCase())
      );
      if (found) {
        textureConfig = found;
      }
    }

    // Create the material: if a texture filename is provided, load the texture,
    // otherwise use the fallback color.
    let material;
    if (textureConfig.texture) {
      const texture = textureLoader.load(`/textures/${textureConfig.texture}`);
      material = new THREE.MeshStandardMaterial({ map: texture });
    } else {
      material = new THREE.MeshStandardMaterial({ color: textureConfig.fallbackColor });
    }

    const moonMesh = new THREE.Mesh(geometry, material);
    moonMesh.castShadow = true;
    moonMesh.receiveShadow = true;

    // Calculate the orbit distance from the moon's semimajorAxis (scaled appropriately).
    const orbitDistance = Math.sqrt(moon.semimajorAxis / (SCALING_FACTORS.moonOrbits || SCALING_FACTORS.orbits || SCALING_FACTORS.default));

    // Set up the moon's orbital parameters.
    // orbitalSpeed is in radians per simulation day.
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

    // Add the moon directly to the scene (not as a child of the planet),
    // so that the parent's rotation does not affect the moon.
    scene.add(moonMesh);
    moonMeshes.push(moonMesh);
  });

  console.log(`${moonMeshes.length} moons created.`);
  console.log(`${skippedMoons} moons skipped due to minRadius filter.`);
  return moonMeshes;
}
