import * as THREE from 'three';
import { switchToTopView, resetCameraView } from './system/Camera.js';

export let selectedPlanetGroup = null;
export let fovLocked = false; // Flag, das anzeigt, dass ein FOV-Tween bereits erfolgt ist

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

export function initUI(camera, planetGroups, controls) {
    const topViewBtn = document.getElementById('topViewBtn');
    topViewBtn.addEventListener('click', () => {
        // Setze den ausgewählten Planet zurück und den FOV-Lock
        selectedPlanetGroup = null;
        fovLocked = false;
        switchToTopView(camera, 2);
    });

    const resetViewBtn = document.getElementById('resetViewBtn');
    resetViewBtn.addEventListener('click', () => {
        resetCameraView(camera, 2);
    });

    /*
    // Tooltip bei Mousemove
    const tooltip = document.getElementById('tooltip');
    window.addEventListener('mousemove', (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
    });
    */
}