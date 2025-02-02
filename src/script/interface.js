import * as THREE from 'three';
import { switchToTopView } from './system/Camera.js';

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

export function initUI(camera, planets) {
    // Top-View Button
    const topViewBtn = document.getElementById('topViewBtn');
    topViewBtn.addEventListener('click', () => {
        switchToTopView(camera);
    });

    // Tooltip-Element (in HTML bereits vorhanden, id="tooltip")
    const tooltip = document.getElementById('tooltip');

    // Mausbewegungen abfangen und Raycaster aktualisieren
    window.addEventListener('mousemove', (event) => {
        // Mauskoordinaten in den normierten Gerätekoordinaten (-1 bis +1)
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);

        // Prüfe Schnittpunkte mit den Planeten
        const intersects = raycaster.intersectObjects(planets);
        if (intersects.length > 0) {
            const intersect = intersects[0];
            const planetName = intersect.object.userData.name || 'Unknown';
            tooltip.textContent = planetName;
            tooltip.style.display = 'block';
            // Tooltip positionieren (kleiner Offset)
            tooltip.style.left = event.clientX + 10 + 'px';
            tooltip.style.top = event.clientY + 10 + 'px';
        } else {
            tooltip.style.display = 'none';
        }
    });
}
