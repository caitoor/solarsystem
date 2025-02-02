import * as THREE from 'three';
import { createScene } from './system/Scene.js';
import { createRenderer } from './system/Renderer.js';
import { createCamera } from './system/Camera.js';
import { createControls } from './system/Controls.js';
import { createPlanets } from './bodies/Planets.js';
import { createOrbits } from './bodies/Orbits.js';
import { updatePlanets, updateMoons } from './animation/Animation.js';
import { createSun } from './bodies/Sun.js';
import { createLights } from './system/Lights.js';
import { initUI } from './interface.js';
import { createMoons } from './bodies/Moons.js';
import { SPEED_COEFFICIENT } from '../config/constants.js';

const clock = new THREE.Clock();
const scene = createScene();
const renderer = createRenderer();
const camera = createCamera();
const controls = createControls(camera, renderer);
const { sun, updateGlow } = createSun(scene, camera);
createLights(scene, sun);
const planets = createPlanets(scene);
createOrbits(scene, planets);
const moons = createMoons(scene, planets);
initUI(camera, planets);

function animate() {
    requestAnimationFrame(animate);
    const deltaTime = clock.getDelta() * SPEED_COEFFICIENT;
    const daysPassed = deltaTime;
    updatePlanets(planets, daysPassed);
    updateMoons(moons, daysPassed);
    controls.update();
    sun.material.uniforms.time.value += 0.02;
    updateGlow();
    renderer.render(scene, camera);
}
animate();
