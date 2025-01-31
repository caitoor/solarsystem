import * as THREE from 'three';
import { ShaderMaterial, Vector3 } from 'three';

export function createSun(scene) {
    const sunGeometry = new THREE.SphereGeometry(5, 64, 64);

    // Shader Material für die Sonnenoberfläche
    const sunMaterial = new ShaderMaterial({
        uniforms: {
            time: { value: 0.0 }
        },
        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform float time;
            varying vec2 vUv;
            void main() {
                float brightness = sin(vUv.x * 10.0 + time) * 0.5 + 0.5;
                gl_FragColor = vec4(vec3(1.0, 0.6, 0.0) * brightness, 1.0);
            }
        `
    });

    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    scene.add(sun);

    // Glow-Effekt durch eine zweite größere Kugel mit transparentem Material
    const glowGeometry = new THREE.SphereGeometry(6, 64, 64);
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0xffaa00,
        transparent: true,
        opacity: 0.3,
        depthWrite: false,
    });

    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    scene.add(glow);

    // Zurückgeben, damit die Sonne animiert werden kann
    return { sun, glow };
}
