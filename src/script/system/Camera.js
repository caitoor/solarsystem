// src/system/camera.js
import * as THREE from 'three';
import gsap from 'gsap';
import { CAMERA_SETTINGS } from '../../config/constants.js';

export function createCamera() {
    const settings = CAMERA_SETTINGS.default;
    const camera = new THREE.PerspectiveCamera(
        settings.fov,                            // FOV in degrees (adjust for wider or narrower view)
        window.innerWidth / window.innerHeight, // Aspect ratio
        settings.near,                             // Near clipping plane (objects closer than this are not rendered)
        settings.far                             // Far clipping plane (objects farther than this are not rendered)
    );

    // Set initial camera position (more zoomed out)
    // Adjust these values to change the initial view of your scene.
    camera.position.set(settings.position.x, settings.position.y, settings.position.z); return camera;
}

export function resetCameraView(camera, duration = 2) {
    const settings = CAMERA_SETTINGS.default;
    gsap.to(camera.position, {
        duration: duration,
        x: settings.position.x,
        y: settings.position.y,
        z: settings.position.z,
        ease: "power2.inOut",
        onUpdate: () => {
            camera.lookAt(new THREE.Vector3(0, 0, 0));
            camera.updateProjectionMatrix();
        }
    });
    gsap.to(camera, {
        duration: duration,
        fov: settings.fov,
        ease: "power2.inOut",
        onUpdate: () => {
            camera.updateProjectionMatrix();
        }
    });
}

export function switchToTopView(camera, duration = 2) {
    // Ermittle die Weltposition der Sonne
    const sunPos = new THREE.Vector3(0, 0, 0);

    // Definiere den Offset (z.B. 120 Einheiten über der Sonne)
    const offset = new THREE.Vector3(0, 120, 0);
    const newCamPos = sunPos.clone().add(offset);

    gsap.to(camera.position, {
        duration: duration,
        x: newCamPos.x,
        y: newCamPos.y,
        z: newCamPos.z,
        ease: "power2.inOut",
        onUpdate: () => {
            camera.lookAt(sunPos);
            camera.updateProjectionMatrix();
        }
    });
}
