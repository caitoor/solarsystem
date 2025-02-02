import { createScene } from './system/Scene.js';
import { createRenderer } from './system/Renderer.js';
import { createCamera } from './system/Camera.js';
import { createControls } from './system/Controls.js';
import { createPlanets } from './bodies/Planets.js';
import { createOrbits } from './bodies/Orbits.js';
import { updatePlanets } from './animation/Animation.js';
import { createSun } from './bodies/Sun.js';
import { createLights } from './system/Lights.js';
import { initUI } from './interface.js';

const scene = createScene();
const renderer = createRenderer();
const camera = createCamera();
const controls = createControls(camera, renderer);
initUI(camera);
const { sun, glow, updateGlow } = createSun(scene, camera);
createLights(scene, sun);

const planets = createPlanets(scene);
createOrbits(scene, planets);

function animate() {
    requestAnimationFrame(animate);
    updatePlanets(planets);
    controls.update();
    sun.material.uniforms.time.value += 0.02;
    updateGlow();
    renderer.render(scene, camera);
}
animate();
