import * as THREE from 'three';
import planetsData from '../../data/planets.json';
import { SCALING_FACTORS } from '../../config/constants.js';

export function createPlanets(scene) {
  const textureLoader = new THREE.TextureLoader();
  const planetGroups = [];

  planetsData.forEach((planet) => {
    // Berechne die visuelle Größe des Planeten
    const radius = Math.sqrt(planet.meanRadius / (SCALING_FACTORS.planets || SCALING_FACTORS.default));
    const geometry = new THREE.SphereGeometry(radius, 32, 32);
    const texture = textureLoader.load(`./textures/${planet.englishName.toLocaleLowerCase()}.jpg`);
    const material = new THREE.MeshStandardMaterial({ map: texture });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    // Erstelle eine Gruppe als Pivot für diesen Planeten.
    // In dieser Gruppe wird die Achsenneigung (axialTilt) festgelegt.
    const planetGroup = new THREE.Group();
    // Füge den Planeten als Kind der Gruppe hinzu.
    planetGroup.add(mesh);
    // Stelle sicher, dass der Planet zentriert im Group ist.
    mesh.position.set(0, 0, 0);

    // Speichere orbitale und rotationsspezifische Parameter in der Gruppe.
    // Diese betreffen den Orbit um die Sonne.
    const argument = planet.argPeriapsis || 0; // in Grad
    planetGroup.userData = {
      id: planet.id,
      name: planet.englishName,
      angle: Math.random() * Math.PI * 2,                  // aktueller Orbitalwinkel (in Radiant)
      orbitalSpeed: (2 * Math.PI) / planet.sideralOrbit,     // Umlaufgeschwindigkeit (Radiant pro Tag)
      distance: Math.sqrt(planet.semimajorAxis / (SCALING_FACTORS.orbits || SCALING_FACTORS.default)),
      eccentricity: planet.eccentricity || 0,
      rotationSpeed: (2 * Math.PI) / (planet.sideralRotation / 23.9345), // Selbstrotation (Radiant pro Tag)
      inclination: planet.inclination || 0,                // Bahnneigung (Grad)
      argument: argument                                   // Argument der Periapsis (Grad)
    };
    // Speichere auch den Axial-Tilt (Rotationsachse des Planeten, z. B. ca. 23° für die Erde)
    planetGroup.userData.axialTilt = planet.axialTilt || 0;

    // Berechne die Position der Gruppe (Orbit um die Sonne) wie bisher:
    const a = planetGroup.userData.distance;         // semimajor axis
    const e = planetGroup.userData.eccentricity;       // eccentricity
    const b = a * Math.sqrt(1 - e * e);                // semiminor axis
    const centerX = -a * e;                            // Offset, damit der Fokus (Sonne) bei (0,0) liegt
    const t = planetGroup.userData.angle;              // aktueller Orbitalparameter

    // Berechne die unrotierte Position in der x-z-Ebene:
    const x_un = centerX + a * Math.cos(t);
    const z_un = b * Math.sin(t);

    // Wende die Orientierung (Argument der Periapsis) an:
    const phi = THREE.MathUtils.degToRad(planetGroup.userData.argument);
    const x_oriented = x_un * Math.cos(phi) - z_un * Math.sin(phi);
    const z_oriented = x_un * Math.sin(phi) + z_un * Math.cos(phi);

    // Wende die Bahnneigung (Rotation um die x-Achse) an:
    const inc = THREE.MathUtils.degToRad(planetGroup.userData.inclination);
    planetGroup.position.x = x_oriented;
    planetGroup.position.y = z_oriented * Math.sin(inc);
    planetGroup.position.z = z_oriented * Math.cos(inc);

    // Wende den Axial-Tilt an, indem du die Gruppe um die Z-Achse rotierst.
    // Damit wird die Rotationsachse des Planeten geneigt.
    planetGroup.rotation.z = THREE.MathUtils.degToRad(planetGroup.userData.axialTilt);

    scene.add(planetGroup);
    planetGroups.push(planetGroup);
  });

  return planetGroups;
}
