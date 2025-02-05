// src/script/manager/CelestialManager.js
import * as THREE from 'three';
import { SCALING_FACTORS } from '../../config/constants.js';
import sunData from '../../data/sun.json';
import { Sun } from '../bodies/Sun.js';
import planetsData from '../../data/planets.json';
import { Planet } from '../bodies/Planet.js';
import moonsData from '../../data/moons.json';
import moonTextures from '../../config/moonTextures.json';
import { Moon } from '../bodies/Moon.js';

export class CelestialManager {
    /**
     * @param {THREE.Scene} scene - Die Szene, in der alle Himmelskörper platziert werden.
     * @param {THREE.Camera} camera - Optional, falls für spätere Interaktionen benötigt.
     */
    constructor(scene, camera) {
        this.scene = scene;
        this.camera = camera;
        this.sun = null;
        this.planets = [];
        this.moons = [];
    }

    /**
     * Erzeugt die Sonne anhand der Daten in sunData.
     */
    createSun() {
        // Wir nehmen an, dass die Sun-Klasse alle nötigen Parameter intern aus sunData übernimmt.
        // Die Sonne hat keinen Orbit, rotiert nur und besitzt einen Glow-/Atmosphere-Effekt.
        this.sun = new Sun(this.scene, this.camera);
    }

    /**
     * Erzeugt alle Planeten basierend auf den Daten in planetsData.
     * Jeder Planet wird als Instanz der Planet-Klasse erstellt.
     */
    createPlanets() {
        const textureLoader = new THREE.TextureLoader();
        planetsData.forEach((planet) => {
            // Berechne den sichtbaren Radius des Planeten
            const planetRadius = Math.sqrt(planet.meanRadius / (SCALING_FACTORS.planets || SCALING_FACTORS.default));
            const geometry = new THREE.SphereGeometry(planetRadius, 32, 32);
            // Textur laden (basierend auf englishName in Kleinbuchstaben)
            const texture = textureLoader.load(`./textures/${planet.englishName.toLowerCase()}.jpg`);
            const material = new THREE.MeshStandardMaterial({ map: texture });

            // Erstelle ein Parameter-Objekt, das an die Planet-Klasse übergeben wird.
            const params = {
                id: planet.id,
                name: planet.englishName.replace(/^\d+\s/, ''),
                geometry: geometry,
                material: material,
                distance: Math.sqrt(planet.semimajorAxis / (SCALING_FACTORS.orbits || SCALING_FACTORS.default)),
                eccentricity: planet.eccentricity || 0,
                inclination: planet.inclination || 0,      // in Grad
                argument: planet.argPeriapsis || 0,           // in Grad
                orbitalSpeed: (2 * Math.PI) / planet.sideralOrbit,  // Radiant pro Simulationseinheit
                angle: Math.random() * Math.PI * 2,          // zufälliger Startwinkel im Orbit
                rotationSpeed: (2 * Math.PI) / (planet.sideralRotation / 23.9345),
                axialTilt: planet.axialTilt || 0,
                castShadow: true,
                receiveShadow: true,
                // Optional: Zusätzliche Komponenten wie atmosphere, clouds, rings können hier übergeben werden.
            };

            // Erstelle eine Instanz der Planet-Klasse (diese erbt von CelestialBody)
            const planetInstance = new Planet(params);
            // Füge den Pivot (planetInstance.group) der Szene hinzu
            this.scene.add(planetInstance.group);
            this.planets.push(planetInstance);
        });
    }

    /**
     * Erzeugt alle Monde anhand der Daten in moonsData.
     * Jeder Mond wird als Instanz der Moon-Klasse erstellt.
     * @note: Es wird für jeden Mond der übergeordnete Planet gesucht (über den Wert in moon.aroundPlanet.planet).
     */


    createMoons() {
        let skippedMoons = 0;
        const textureLoader = new THREE.TextureLoader();
        moonsData.forEach((moon) => {
            if (!moon.aroundPlanet) {
                skippedMoons++;
                return;
            }
            const parentId = moon.aroundPlanet.planet.toLowerCase();
            console.log(parentId);

            // TODO: there are also moons around dwarf planets or asteroids
            const parentPlanet = this.planets.find(p =>
                p.id.toLowerCase() === parentId || p.name.toLowerCase() === parentId
            );
            if (!parentPlanet) return;

            // TODO: check if radius or diameter has to be passed
            const moonRadius = Math.sqrt(moon.meanRadius / (SCALING_FACTORS.moons || SCALING_FACTORS.default));
            const geometry = new THREE.SphereGeometry(moonRadius, 16, 16);

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

            let material;
            if (textureConfig.texture) {
                const texture = textureLoader.load(`/textures/${textureConfig.texture}`);
                // Optional: Setze sRGB-Encoding
                texture.encoding = THREE.sRGBEncoding;
                material = new THREE.MeshStandardMaterial({ map: texture });
            } else {
                material = new THREE.MeshStandardMaterial({ color: textureConfig.fallbackColor });
            }

            // Setze Parameter für den Mond
            const params = {
                id: moon.id,
                name: moon.englishName,
                geometry: geometry,
                material: material,
                distance: Math.sqrt(moon.semimajorAxis / (SCALING_FACTORS.moonOrbits || SCALING_FACTORS.orbits || SCALING_FACTORS.default)),
                eccentricity: moon.eccentricity || 0,
                inclination: moon.inclination || 0,
                argument: moon.argPeriapsis || 0,
                orbitalSpeed: (2 * Math.PI) / moon.sideralOrbit,
                angle: Math.random() * Math.PI * 2,
                rotationSpeed: (2 * Math.PI) / (moon.sideralRotation / 23.9345),
                axialTilt: moon.axialTilt || 0,
                castShadow: true,
                receiveShadow: true,
            };

            // Erstelle die Moon-Instanz. Hier wird als übergeordneter Pivot der Planetengruppen-Pivot übergeben.
            const moonInstance = new Moon(params, parentPlanet.group);
            // Füge die komplette Pivot-Gruppe des Mondes der Szene hinzu
            this.scene.add(moonInstance.group);
            this.moons.push(moonInstance);
        });
        if (skippedMoons > 0) {
            console.warn(`Skipped ${skippedMoons} moons without parent planet.`);
        }
    }


    /**
     * Erzeugt alle Himmelskörper: Sonne, Planeten und Monde.
     */
    genesis() {
        this.createSun();
        this.createPlanets();
        this.createMoons();
    }

    /**
     * Aktualisiert alle Himmelskörper.
     * Diese Methode sollte im Animationsloop aufgerufen werden.
     * @param {number} delta - Verstrichene Simulationszeit (z. B. in Tagen).
     */
    update(delta) {
        if (this.sun && typeof this.sun.update === 'function') {
            this.sun.update(delta);
        }
        this.planets.forEach(planet => planet.update(delta));
        this.moons.forEach(moon => moon.update(delta));
    }
}
