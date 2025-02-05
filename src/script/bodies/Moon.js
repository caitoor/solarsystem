// src/script/bodies/Moon.js

import * as THREE from 'three';
import { CelestialBody } from './CelestialBody.js';
import { Atmosphere } from './Atmosphere.js';
import { Clouds } from './Clouds.js';

export class Moon extends CelestialBody {
    /**
     * Erzeugt einen Mond.
     * @param {Object} params - Parameter für den Mond, z. B.:
     *   {
     *     id, name, geometry, material,
     *     distance,            // Orbit-Distanz (relativ zum Eltern-Planeten)
     *     eccentricity,        // (optional)
     *     inclination,         // in Grad, (optional)
     *     argument,            // in Grad, (optional)
     *     orbitalSpeed,        // in Radiant pro Simulationszeit-Einheit (z. B. Tag)
     *     angle,               // Startwinkel im Orbit (in Radiant)
     *     rotationSpeed,       // Selbstrotation (in Radiant pro Simulationszeit-Einheit)
     *     axialTilt,           // (optional)
     *     // Optionale Komponenten:
     *     atmosphere: { enabled: boolean, options: { … } },
     *     clouds: { enabled: boolean, options: { … } }
     *   }
     * @param {THREE.Object3D} parentPlanet - Der Pivot des übergeordneten Planeten.
     */
    constructor(params, parentPlanet) {
        super(params);
        // Speichere den übergeordneten Planeten (Pivot)
        this.parentPlanet = parentPlanet;

        // Optional: Atmosphere (Glow/Effekt) für den Mond
        if (params.atmosphere && params.atmosphere.enabled) {
            this.atmosphere = new Atmosphere(this.mesh, params.atmosphere.options);
            this.group.add(this.atmosphere.mesh);
        }
        // Optional: Clouds für den Mond
        if (params.clouds && params.clouds.enabled) {
            this.clouds = new Clouds(this.mesh, params.clouds.options);
            this.group.add(this.clouds.mesh);
        }
    }

    /**
     * Aktualisiert den Mond:
     * - Berechnet den neuen Orbitwinkel relativ zum Eltern-Planeten.
     * - Transformiert den lokalen Offset (basierend auf orbitParams.distance und angle)
     *   in Weltkoordinaten und addiert diesen zur Weltposition des Elternteils.
     * - Aktualisiert zudem die Selbstrotation und optionale Komponenten.
     * @param {number} delta - Verstrichene Simulationszeit (z. B. in Tagen).
     */
    update(delta) {
        // Aktualisiere den Orbitwinkel
        this.orbitParams.angle += this.orbitParams.orbitalSpeed * delta;
        // Berechne den lokalen Offset in der x-z-Ebene (Orbit des Mondes relativ zum Eltern-Planeten)
        const localOffset = new THREE.Vector3(
            this.orbitParams.distance * Math.cos(this.orbitParams.angle),
            0,
            this.orbitParams.distance * Math.sin(this.orbitParams.angle)
        );
        // Ermittle die Weltposition und -rotation des Eltern-Pivots
        const parentWorldPos = new THREE.Vector3();
        this.parentPlanet.getWorldPosition(parentWorldPos);
        const parentQuaternion = new THREE.Quaternion();
        this.parentPlanet.getWorldQuaternion(parentQuaternion);
        // Wende die Rotation des Elternteils auf den lokalen Offset an
        localOffset.applyQuaternion(parentQuaternion);
        // Setze die Position des Mond-Pivots (this.group) relativ zum Elternteil
        this.group.position.copy(parentWorldPos.clone().add(localOffset));

        // Aktualisiere die Selbstrotation des Mondes (lokales Mesh)
        this.mesh.rotation.y += this.rotationSpeed * delta;

        // Aktualisiere optionale Komponenten, falls vorhanden
        if (this.atmosphere) {
            this.atmosphere.update(delta);
        }
        if (this.clouds) {
            this.clouds.update(delta);
        }
    }
}
