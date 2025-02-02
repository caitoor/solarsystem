// src/system/camera.js
import gsap from 'gsap';
import * as THREE from 'three';

export function createCamera() {
    // Create a perspective camera with:
    // - FOV (field of view): adjust to change how wide the camera view is.
    // - Aspect ratio: usually window.innerWidth / window.innerHeight.
    // - Near and far clipping planes: objects outside this range are not rendered.
    const camera = new THREE.PerspectiveCamera(
        80,                              // FOV in degrees (adjust for wider or narrower view)
        window.innerWidth / window.innerHeight, // Aspect ratio
        0.1,                             // Near clipping plane (objects closer than this are not rendered)
        1000                             // Far clipping plane (objects farther than this are not rendered)
    );

    // Set initial camera position (more zoomed out)
    // Adjust these values to change the initial view of your scene.
    camera.position.set(0, 20, 80); // (x, y, z): Increase z for more zoom-out, adjust x/y for offset.
    return camera;
}

export function switchToTopView(camera, duration = 2) {
    // Animate the camera to a top view with a zoomed-out perspective.
    // Adjust the target position values to change the top view.
    gsap.to(camera.position, {
        duration: duration,
        x: 0,      // x position remains centered
        y: 120,    // y position: higher value for a more top-down view
        z: 0,      // z position: 0 means the camera is directly above the origin
        ease: "power2.inOut",
        onUpdate: () => {
            // Ensure the camera always looks at the scene center during transition.
            camera.lookAt(0, 0, 0);
        }
    });
}
