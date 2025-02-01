import * as THREE from 'three';
import glowVertex from '../../assets/shaders/glowVertex.glsl?raw';
import glowFragment from '../../assets/shaders/glowFragment.glsl?raw';

const SunGlowShader = {
    vertexShader: glowVertex,
    fragmentShader: glowFragment,
    uniforms: {
        glowColor: { value: new THREE.Color(0xffaa00) },
        viewVector: { value: new THREE.Vector3() },
        glowFactor: { value: 0.011 },
        falloffExponent: { value: 8.0 }
    }
};

export default SunGlowShader;
