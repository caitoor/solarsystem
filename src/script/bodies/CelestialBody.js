// src/script/bodies/CelestialBody.js
import * as THREE from 'three';

export class CelestialBody {
  /**
   * Erzeugt einen Himmelskörper.
   * @param {Object} params - Konfigurationsparameter:
   *   - id: string, eindeutige Kennung.
   *   - name: string, Anzeigename.
   *   - geometry: THREE.Geometry/BufferGeometry für den Body.
   *   - material: THREE.Material, das für den Body verwendet wird.
   *   - distance: Zahl, semimajor-Axis (relativ skaliert).
   *   - eccentricity: Zahl, Exzentrizität (0 bis 1).
   *   - inclination: Zahl, Bahninclination in Grad.
   *   - argument: Zahl, Argument der Periapsis in Grad.
   *   - orbitalSpeed: Zahl, Umlaufgeschwindigkeit (in Radiant pro Simulationszeit-Einheit).
   *   - angle: Zahl, aktueller Winkel im Orbit (in Radiant).
   *   - rotationSpeed: Zahl, Selbstrotation (in Radiant pro Simulationszeit-Einheit).
   *   - axialTilt: Zahl, Axial-Tilt in Grad.
   *   - castShadow, receiveShadow: Boolean, optional.
   */
  constructor(params) {
    this.id = params.id;
    this.name = params.name;

    // Erstelle das Mesh des Himmelskörpers.
    this.mesh = new THREE.Mesh(params.geometry, params.material);
    this.mesh.castShadow = params.castShadow || false;
    this.mesh.receiveShadow = params.receiveShadow || false;

    // Speichere Orbit-Parameter in einem Objekt.
    this.orbitParams = {
      distance: params.distance,
      eccentricity: params.eccentricity || 0,
      inclination: params.inclination || 0, // in Grad
      argument: params.argument || 0,         // in Grad
      orbitalSpeed: params.orbitalSpeed,      // in Radiant pro Zeiteinheit
      angle: params.angle || 0                // aktueller Winkel in Radiant
    };

    // Selbstrotationsgeschwindigkeit in Radiant pro Zeiteinheit.
    this.rotationSpeed = params.rotationSpeed || 0;
    // Axial-Tilt in Grad (z. B. 23,5 für Erde)
    this.axialTilt = params.axialTilt || 0;

    // Erstelle einen Pivot-Container (Group) für den Orbit und Axial-Tilt.
    // Der Container wird die orbitale Bewegung (Position im Sonnensystem) übernehmen.
    // Der eigentliche Mesh (selbstrotation) bleibt als Kind, sodass er sich unabhängig dreht.
    this.group = new THREE.Group();
    this.group.add(this.mesh);
    // Zentriere das Mesh im Group (sollte es noch nicht der Fall sein)
    this.mesh.position.set(0, 0, 0);
    // Wende den Axial-Tilt auf die Gruppe an.
    this.group.rotation.z = THREE.MathUtils.degToRad(this.axialTilt);
  }

  /**
   * Berechnet die Position im Orbit basierend auf den Parametern.
   * Diese Funktion implementiert den klassischen Ansatz, den Orbit in der x-z-Ebene zu berechnen
   * und dann Inklination und Argument der Periapsis anzuwenden.
   * @returns {THREE.Vector3} - Die berechnete Position.
   */
  computeOrbitPosition() {
    const a = this.orbitParams.distance;            // semimajor-Axis
    const e = this.orbitParams.eccentricity;          // Exzentrizität
    const b = a * Math.sqrt(1 - e * e);               // semiminor-Achse
    const centerX = -a * e;                           // Versatz, damit der Fokus (z. B. die Sonne) bei (0,0) liegt
    const t = this.orbitParams.angle;                 // aktueller Winkel im Orbit

    // Untransformierte Position in der x-z-Ebene:
    const x_un = centerX + a * Math.cos(t);
    const z_un = b * Math.sin(t);

    // Wende das Argument der Periapsis an:
    const phi = THREE.MathUtils.degToRad(this.orbitParams.argument);
    const x_oriented = x_un * Math.cos(phi) - z_un * Math.sin(phi);
    const z_oriented = x_un * Math.sin(phi) + z_un * Math.cos(phi);

    // Wende die Bahninclination an:
    const inc = THREE.MathUtils.degToRad(this.orbitParams.inclination);
    return new THREE.Vector3(
      x_oriented,
      z_oriented * Math.sin(inc),
      z_oriented * Math.cos(inc)
    );
  }

  /**
   * Aktualisiert den Himmelskörper: Orbit und Selbstrotation.
   * Diese Methode sollte im Animationsloop aufgerufen werden.
   * @param {number} delta - Verstrichene Zeit (in deiner Simulationszeiteinheit).
   */
  update(delta) {
    // Aktualisiere den aktuellen Orbitwinkel
    this.orbitParams.angle += this.orbitParams.orbitalSpeed * delta;
    // Aktualisiere die Position der Pivot-Gruppe anhand des berechneten Orbitpunkts.
    const newPos = this.computeOrbitPosition();
    this.group.position.copy(newPos);
    // Aktualisiere die Selbstrotation des Meshes (Rotation um Y)
    this.mesh.rotation.y += this.rotationSpeed * delta;
  }
}
