export function updatePlanets(planets) {
    planets.forEach(planet => {
        planet.userData.angle += planet.userData.speed * .5;
        planet.position.x = Math.cos(planet.userData.angle) * planet.userData.distance;
        planet.position.z = Math.sin(planet.userData.angle) * planet.userData.distance;
        planet.rotation.y += planet.userData.rotationSpeed * 2;
    });
}
