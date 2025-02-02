import * as THREE from 'three';

export function updatePlanets(planets) {
  const speedFactor = 5;
  planets.forEach(planet => {
    // Update the orbital parameter
    planet.userData.angle += planet.userData.speed * speedFactor;

    const a = planet.userData.distance;
    const e = planet.userData.eccentricity || 0;
    const b = a * Math.sqrt(1 - e * e);
    const centerX = -a * e;
    const t = planet.userData.angle;

    // Compute unrotated orbital position in x-z plane:
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
    planet.rotation.y += planet.userData.rotationSpeed * speedFactor;
  });
}
