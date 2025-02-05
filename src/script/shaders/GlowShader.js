import * as THREE from 'three';
import glowVertex from '../../assets/shaders/glowVertex.glsl?raw';
import glowFragment from '../../assets/shaders/glowFragment.glsl?raw';

const GlowShader = {
    vertexShader: glowVertex,
    fragmentShader: glowFragment,
    uniforms: {
        glowColor: { value: new THREE.Color(0xffaa00) },
        viewVector: { value: new THREE.Vector3() },
        glowFactor: { value: 0.013 },
        falloffExponent: { value: 8.5 },
        opacity: { value: 0.5 },
        time: { value: 0 }
    }
};

export default GlowShader;
