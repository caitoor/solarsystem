import * as THREE from 'three';
import gsap from 'gsap';
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

    // Tooltip bei Mousemove
    const tooltip = document.getElementById('tooltip');
    window.addEventListener('mousemove', (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(planetGroups, true);
        if (intersects.length > 0) {
            const intersect = intersects[0];
            let planetName = intersect.object.userData.name;
            if (!planetName && intersect.object.parent && intersect.object.parent.userData.name) {
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

    // Klick-Listener: Kamera fokussiert den angeklickten Planeten
    window.addEventListener('click', (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(planetGroups, true);
        if (intersects.length > 0) {
            let targetObj = intersects[0].object;
            if (!targetObj.userData.name && targetObj.parent && targetObj.parent.userData.name) {
                targetObj = targetObj.parent;
            }
            const planetName = targetObj.userData.name || 'Unknown';
            console.log("Clicked on:", planetName);

            // Speichere den ausgewählten Planeten
            selectedPlanetGroup = targetObj;

            // Ermittele den Weltmittelpunkt des Ziel-Planeten
            const targetPos = new THREE.Vector3();
            targetObj.getWorldPosition(targetPos);

            // Definiere einen Offset, sodass die Kamera etwas entfernt bleibt
            const offset = new THREE.Vector3(0, 10, 20);
            const newCamPos = targetPos.clone().add(offset);

            // Berechne das FOV anhand der Größe des tatsächlichen Planet-Meshes:
            let actualPlanetMesh = targetObj;
            if (!targetObj.geometry && targetObj.children.length > 0) {
                actualPlanetMesh = targetObj.children[0];
            }
            actualPlanetMesh.geometry.computeBoundingSphere();
            const planetRadius = actualPlanetMesh.geometry.boundingSphere.radius;
            const distanceToPlanet = newCamPos.distanceTo(targetPos);
            // Berechne das minimale FOV, um den Planeten exakt einzurahmen:
            const minFovRad = 2 * Math.atan(planetRadius / distanceToPlanet);
            const minFov = THREE.MathUtils.radToDeg(minFovRad);
            // Um den Planeten nur etwa halb so groß erscheinen zu lassen,
            // erhöhen wir das FOV, z. B. um einen Faktor 2 (d.h. doppelt so weit rauszoomen)
            const newFov = minFov * 2;

            // Tween die Kameraposition und das Controls-Target mit GSAP
            gsap.to(camera.position, {
                duration: 2,
                x: newCamPos.x,
                y: newCamPos.y,
                z: newCamPos.z,
                ease: "power2.inOut",
                onUpdate: () => {
                    camera.lookAt(targetPos);
                    camera.updateProjectionMatrix();
                }
            });
            if (controls) {
                gsap.to(controls.target, {
                    duration: 2,
                    x: targetPos.x,
                    y: targetPos.y,
                    z: targetPos.z,
                    ease: "power2.inOut",
                });
            }

            // Tween das FOV nur einmal beim Klick, wenn es noch nicht "locked" wurde.
            if (!fovLocked) {
                gsap.to(camera, {
                    duration: 2,
                    fov: newFov,
                    ease: "power2.inOut",
                    onUpdate: () => {
                        camera.updateProjectionMatrix();
                    },
                    onComplete: () => {
                        fovLocked = true;
                    }
                });
            }
        }
    });
}
