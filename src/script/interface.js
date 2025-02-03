// In src/interface.js
import * as THREE from 'three';
import { switchToTopView } from './system/Camera.js';

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

export function initUI(camera, planets) {
    const topViewBtn = document.getElementById('topViewBtn');
    topViewBtn.addEventListener('click', () => {
        switchToTopView(camera);
    });

    const tooltip = document.getElementById('tooltip');

    window.addEventListener('mousemove', (event) => {
        // Normalisierte Gerätekordinaten (-1 bis +1)
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);

        const intersects = raycaster.intersectObjects(planets, true); // true: prüft rekursiv auch Kinder
        if (intersects.length > 0) {
            const intersect = intersects[0];
            // Versuche zuerst den Namen direkt aus userData zu lesen
            let planetName = intersect.object.userData.name;
            // Falls nicht vorhanden, prüfe den Parent
            if (!planetName && intersect.object.parent && intersect.object.parent.userData) {
                planetName = intersect.object.parent.userData.name;
            }
            tooltip.textContent = planetName || 'Unknown';
            tooltip.style.display = 'block';
            tooltip.style.left = event.clientX + 10 + 'px';
            tooltip.style.top = event.clientY + 10 + 'px';
        } else {
            tooltip.style.display = 'none';
        }
    });
}
