import * as THREE from 'three';
import { ShaderMaterial, UniformsUtils } from 'three';
import SunShader from '../shaders/SunShader.js';
import SunGlowShader from '../shaders/SunGlowShader.js';

export function createSun(scene, camera) {
    // Sun Mesh
    const sunGeometry = new THREE.SphereGeometry(Math.sqrt(695508 / 20000), 64, 64);
    const sunMaterial = new ShaderMaterial({
        vertexShader: SunShader.vertexShader,
        fragmentShader: SunShader.fragmentShader,
        uniforms: SunShader.uniforms
    });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    scene.add(sun);

    // Glow Mesh
    const glowGeometry = new THREE.SphereGeometry(Math.sqrt(695508 / 10000), 64, 64);
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
