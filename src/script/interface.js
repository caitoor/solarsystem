import { switchToTopView } from './system/Camera.js';

export function initUI(camera) {
    const topViewBtn = document.getElementById('topViewBtn');
    topViewBtn.addEventListener('click', () => {
        switchToTopView(camera);
    });
}