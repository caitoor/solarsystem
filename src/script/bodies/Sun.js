import * as THREE from 'three';
import { SCALING_FACTORS } from '../../config/constants.js';
import { ShaderMaterial, UniformsUtils } from 'three';
import SunShader from '../shaders/SunShader.js';
import SunGlowShader from '../shaders/SunGlowShader.js';
import sunData from '../../data/sun.json'; // Import the Sun data as an object

export function createSun(scene, camera) {
    // Use sunData.meanRadius from the JSON to compute the sun's size.
    // Adjust the divisor to control the scale.
    const sunRadius = Math.sqrt(sunData.meanRadius / SCALING_FACTORS.sunSize);
    const sunGeometry = new THREE.SphereGeometry(sunRadius, 64, 64);
    const sunMaterial = new ShaderMaterial({
        vertexShader: SunShader.vertexShader,
        fragmentShader: SunShader.fragmentShader,
        uniforms: SunShader.uniforms
    });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    scene.add(sun);

    const glowRadius = sunRadius * SCALING_FACTORS.sunGlow;
    const glowGeometry = new THREE.SphereGeometry(glowRadius, 64, 64);
    const glowMaterial = new ShaderMaterial({
        vertexShader: SunGlowShader.vertexShader,
        fragmentShader: SunGlowShader.fragmentShader,
        uniforms: UniformsUtils.clone(SunGlowShader.uniforms),
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    scene.add(glow);

    function updateGlow() {
        glowMaterial.uniforms.viewVector.value = new THREE.Vector3().subVectors(camera.position, sun.position);
    }

    return { sun, glow, updateGlow };
}
