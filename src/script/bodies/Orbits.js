import * as THREE from 'three';

export function createOrbits(scene, planets) {
    planets.forEach(planet => {
        const a = planet.userData.distance;
        const e = planet.userData.eccentricity || 0;
        const b = a * Math.sqrt(1 - e * e);
        const centerX = -a * e;
        const segments = 100;
        const points = [];

        // Retrieve the orbital orientation (argument of periapsis)
        const phi = THREE.MathUtils.degToRad(planet.userData.argument || 0);
        // Retrieve the inclination
        const inc = THREE.MathUtils.degToRad(planet.userData.inclination || 0);

        for (let i = 0; i <= segments; i++) {
            const t = (i / segments) * 2 * Math.PI;
            // Unrotated ellipse in the x-z plane:
            const x_un = centerX + a * Math.cos(t);
            const z_un = b * Math.sin(t);
            // Apply orbital orientation (rotate the ellipse in its plane)
            const x_oriented = x_un * Math.cos(phi) - z_un * Math.sin(phi);
            const z_oriented = x_un * Math.sin(phi) + z_un * Math.cos(phi);
            // Apply the orbit inclination (rotate about the x-axis)
            const x = x_oriented;
            const y = z_oriented * Math.sin(inc);
            const z = z_oriented * Math.cos(inc);
            points.push(new THREE.Vector3(x, y, z));
        }

        const orbitGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const orbitMaterial = new THREE.LineBasicMaterial({ color: 0x222222 });
        const orbit = new THREE.LineLoop(orbitGeometry, orbitMaterial);
        scene.add(orbit);
    });
}
