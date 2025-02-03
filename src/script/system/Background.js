import * as THREE from 'three';
import { BACKGROUND_OPACITY } from '../../config/constants.js';

export function createBackground(scene) {
    const loader = new THREE.TextureLoader();
    loader.load('/textures/stars_milky_way.jpg', (texture) => {
        texture.encoding = THREE.sRGBEncoding;
        const geometry = new THREE.SphereGeometry(500, 64, 64);
        const material = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.BackSide,
            transparent: true,
            opacity: BACKGROUND_OPACITY,
        });
        const skySphere = new THREE.Mesh(geometry, material);
        scene.add(skySphere);
        scene.userData.skySphere = skySphere;
    });
}
