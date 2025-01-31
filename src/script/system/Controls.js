import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export function createControls(camera, renderer) {
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 20;
    controls.maxDistance = 500;
    return controls;
}