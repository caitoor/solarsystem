// src/script/bodies/Planet.js
import { CelestialBody } from './CelestialBody.js';
import { Atmosphere } from './Atmosphere.js';
import { Clouds } from './Clouds.js';
// import { Rings } from './Rings.js';

/**
 * Planet – repräsentiert einen Planeten, der alle typischen Features haben kann:
 *   - Orbit (über die Basisklasse CelestialBody)
 *   - Selbstrotation
 *   - Atmosphären-Effekte (Atmosphere)
 *   - Wolken (Clouds)
 *   - Ringe (Rings)
 *
 * Im Konstruktor werden optionale Parameter übergeben, die bestimmen,
 * ob und wie Atmosphären, Wolken und Ringe hinzugefügt werden.
 */
export class Planet extends CelestialBody {
    /**
     * @param {Object} params - Parameter für den Himmelskörper.
     *   Erweitert um optionale Konfigurationen:
     *     atmosphere: { enabled: boolean, options: {...} }
     *     clouds: { enabled: boolean, options: {...} }
     *     rings: { enabled: boolean, options: {...} }
     */
    constructor(params) {
        // Rufe die Basisklasse auf, die das Mesh, Orbit-Parameter usw. erstellt
        super(params);

        // Optionale Zusatzkomponenten
        // Atmosphäre (z. B. Glow, prozedurale Wolken, etc.)
        if (params.atmosphere && params.atmosphere.enabled) {
            this.atmosphere = new Atmosphere(this.mesh, params.atmosphere.options);
            // Füge die Atmosphäre der Gruppe hinzu, damit sie dem Axial-Tilt und der Orbit-Transformation folgt.
            this.group.add(this.atmosphere.mesh);
        }

        // Wolken-Layer
        if (params.clouds && params.clouds.enabled) {
            this.clouds = new Clouds(this.mesh, params.clouds.options);
            this.group.add(this.clouds.mesh);
        }
        /*
            // Ringe
            if (params.rings && params.rings.enabled) {
              this.rings = new Rings(this.mesh, params.rings.options);
              this.group.add(this.rings.mesh);
            }
              */
    }

    /**
     * Aktualisiert den Planeten:
     * - Orbit-Position und Selbstrotation (über die Basisklasse)
     * - Zusätzliche Komponenten (Atmosphere, Clouds, Rings) werden ebenfalls aktualisiert.
     * @param {number} delta - Verstrichene Zeit (in Simulationszeiteinheiten).
     */
    update(delta) {
        // Update orbit und Selbstrotation über die Basisklasse
        super.update(delta);

        // Update zusätzliche Komponenten
        if (this.atmosphere) {
            this.atmosphere.update(delta);
        }
        if (this.clouds) {
            this.clouds.update(delta);
        }
        if (this.rings) {
            this.rings.update(delta);
        }
    }
}
