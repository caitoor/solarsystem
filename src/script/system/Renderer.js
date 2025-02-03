import * as THREE from 'three';

export function createRenderer() {
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // optional, für weichere Schatten

    renderer.setSize(window.innerWidth, window.innerHeight);
    const container = document.getElementById('stage');
    if (container) {
        container.appendChild(renderer.domElement);
    } else {
        console.error('Container with id "stage" not found');
    }
    return renderer;
}