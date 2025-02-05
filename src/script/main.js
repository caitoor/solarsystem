// src/script/main.js
import * as THREE from 'three';
import { createScene } from './system/Scene.js';
import { createRenderer } from './system/Renderer.js';
import { createCamera } from './system/Camera.js';
import { createControls } from './system/Controls.js';
import { createLights } from './system/Lights.js';
import { initUI } from './interface.js';
import { SPEED_COEFFICIENT } from '../config/constants.js';
import { CelestialManager } from './manager/CelestialManager.js';
import { createBackground } from './system/Background.js';

const clock = new THREE.Clock();
const scene = createScene();
const lights = createLights(scene);
const renderer = createRenderer();
const camera = createCamera();
const controls = createControls(camera, renderer);
createBackground(scene);

// Erstelle den CelestialManager und erzeuge alle Himmelskörper (Sonne, Planeten, Monde etc.)
const celestialManager = new CelestialManager(scene, camera);
celestialManager.genesis();

// Initialisiere die UI, wobei die Kamera, die Liste der Planeten (oder Planet-Gruppen)
// und das Controls-Objekt sowie die Sonne übergeben werden.
// Hier nehmen wir an, dass celestialManager.sun und celestialManager.planets definiert sind.
initUI(camera, celestialManager.planets, controls, celestialManager.sun);

function animate() {
    requestAnimationFrame(animate);
    const deltaTime = clock.getDelta() * SPEED_COEFFICIENT;
    // Aktualisiere alle Himmelskörper (Sonne, Planeten, Monde, etc.)
    celestialManager.update(deltaTime);
    controls.update();
    renderer.render(scene, camera);
}
animate();
