// src/script/bodies/Sun.js
import * as THREE from 'three';
import { SCALING_FACTORS } from '../../config/constants.js';
import sunData from '../../data/sun.json';
import { CelestialBody } from './CelestialBody.js';
import { Atmosphere } from './Atmosphere.js';
import SunShader from '../shaders/SunShader.js';

export class Sun extends CelestialBody {
    constructor(scene, camera) {
        const rotationSpeed =
            sunData.sideralRotation && sunData.sideralRotation !== 0
                ? (2 * Math.PI) / (sunData.sideralRotation / 23.9345)
                : 0.001;
        const sunRadius = Math.sqrt(sunData.meanRadius / (SCALING_FACTORS.sun || SCALING_FACTORS.default));
        const geometry = new THREE.SphereGeometry(sunRadius, 64, 64);
        const material = new THREE.ShaderMaterial({
            vertexShader: SunShader.vertexShader,
            fragmentShader: SunShader.fragmentShader,
            uniforms: SunShader.uniforms
        });
        const params = {
            id: sunData.id,
            name: sunData.englishName,
            geometry: geometry,
            material: material,
            distance: 0,
            eccentricity: 0,
            inclination: 0,
            argument: 0,
            orbitalSpeed: 0,
            angle: 0,
            rotationSpeed: rotationSpeed,
            axialTilt: sunData.axialTilt || 0,
            castShadow: false,
            receiveShadow: false
        };

        super(params);
        scene.add(this.group);

        // Hier den Glow/Effekt erstellen – passe den radiusFactor und die Shader-Parameter an,
        // damit der Glow sichtbar wird.
        this.atmosphere = new Atmosphere(this.group, {
            texture: null,
            color: 0xffaa00,
            opacity: 0.7,              // Erhöhter Opacity-Wert für besseren Glow
            speed: 0.1,
            radiusFactor: SCALING_FACTORS.sunGlow || 1.5, // Erhöhter Wert, damit der Glow vom Sonnenkörper abhebt
            glowFactor: 0.02,          // Etwas höher, um den Effekt zu verstärken
            falloffExponent: 8.5
        });
        this.group.add(this.atmosphere.mesh);
        this.camera = camera;
    }

    update(delta) {
        this.mesh.rotation.y += this.rotationSpeed * delta;
        this.mesh.material.uniforms.time.value += delta;
        if (this.atmosphere) {
            this.atmosphere.update(delta);
        }
    }
}
