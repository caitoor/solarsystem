import * as THREE from 'three';

export function updatePlanets(planets, daysPassed) {
  planets.forEach(planet => {
    // Update the orbital parameter by adding the orbital speed (in radians per day).
    planet.userData.angle += planet.userData.orbitalSpeed * daysPassed;

    const a = planet.userData.distance;
    const e = planet.userData.eccentricity || 0;
    const b = a * Math.sqrt(1 - e * e);
    const centerX = -a * e;
    const t = planet.userData.angle;

    // Compute unrotated orbital position in the x-z plane:
    const x_un = centerX + a * Math.cos(t);
    const z_un = b * Math.sin(t);

    // Apply the orbital orientation:
    const phi = THREE.MathUtils.degToRad(planet.userData.argument || 0);
    const x_oriented = x_un * Math.cos(phi) - z_un * Math.sin(phi);
    const z_oriented = x_un * Math.sin(phi) + z_un * Math.cos(phi);

    // Apply the orbit inclination:
    const inc = THREE.MathUtils.degToRad(planet.userData.inclination || 0);
    planet.position.x = x_oriented;
    planet.position.y = z_oriented * Math.sin(inc);
    planet.position.z = z_oriented * Math.cos(inc);

    // Update the planet's self rotation
    planet.rotation.y += planet.userData.rotationSpeed * daysPassed;
  });
}

export function updateMoons(moonMeshes, daysPassed) {
  moonMeshes.forEach(moon => {
    // Update the orbital angle
    moon.userData.angle -= moon.userData.orbitalSpeed * daysPassed;
    const d = moon.userData.orbitDistance;
    // Compute the local orbital offset
    const localOffset = new THREE.Vector3(
      d * Math.cos(moon.userData.angle),
      0,
      d * Math.sin(moon.userData.angle)
    );
    // Get the parent's world position
    const parentPos = new THREE.Vector3();
    moon.userData.parentPlanet.getWorldPosition(parentPos);
    // Update the moon's world position
    moon.position.copy(parentPos).add(localOffset);
  });
}