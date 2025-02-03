import * as THREE from 'three';

export function updatePlanets(planetGroups, daysPassed) {
  planetGroups.forEach(planetGroup => {
    // Aktualisiere den orbitalen Winkel
    planetGroup.userData.angle += planetGroup.userData.orbitalSpeed * daysPassed;
    const a = planetGroup.userData.distance;
    const e = planetGroup.userData.eccentricity || 0;
    const b = a * Math.sqrt(1 - e * e);
    const centerX = -a * e;
    const t = planetGroup.userData.angle;
    const x_un = centerX + a * Math.cos(t);
    const z_un = b * Math.sin(t);
    const phi = THREE.MathUtils.degToRad(planetGroup.userData.argument || 0);
    const x_oriented = x_un * Math.cos(phi) - z_un * Math.sin(phi);
    const z_oriented = x_un * Math.sin(phi) + z_un * Math.cos(phi);
    const inc = THREE.MathUtils.degToRad(planetGroup.userData.inclination || 0);
    
    // Aktualisiere die Position der Gruppe (Orbit um die Sonne)
    planetGroup.position.x = x_oriented;
    planetGroup.position.y = z_oriented * Math.sin(inc);
    planetGroup.position.z = z_oriented * Math.cos(inc);
    
    // Aktualisiere die Selbstrotation des Planeten.
    // Der Planet ist das erste Kind der Gruppe.
    const planetMesh = planetGroup.children[0];
    planetMesh.rotation.y += planetGroup.userData.rotationSpeed * daysPassed;
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