import * as THREE from 'three';
import { createScene } from './system/Scene.js';
import { createBackground } from './system/Background.js';
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
import { Clouds } from './bodies/Clouds.js';


const clock = new THREE.Clock();
const scene = createScene();
// createBackground(scene); // doesn't look good 
const renderer = createRenderer();
const camera = createCamera();
const controls = createControls(camera, renderer);

// Erstelle Sonne und Lichter
const { sun, updateGlow } = createSun(scene, camera);
createLights(scene, sun);

// Erstelle Planeten – hier werden Pivot-Gruppen (planetGroups) erzeugt
const planetGroups = createPlanets(scene);
createOrbits(scene, planetGroups);
const moons = createMoons(scene, planetGroups);

// Finde den Erd-Pivot (wir gehen davon aus, dass in userData.id "terre" steht)
const earthGroup = planetGroups.find(p => p.userData.id.toLowerCase() === 'terre');
let earthClouds;
if (earthGroup) {
    earthClouds = new Clouds(earthGroup, {
        texture: './textures/earth_clouds.jpg', // Pfad zur Wolkentextur in public/textures/
        color: 0xffffff,
        opacity: 0,
        speed: 0.15,
        radiusFactor: 1.02
    });
    // Da wir Clouds als eigenständiges Mesh in die Szene einfügen (nicht als Kind der Erde),
    // wird in der update()-Methode die Position anhand des Parent-Pivot (earthGroup) neu gesetzt.
    scene.add(earthClouds.mesh);
}

initUI(camera, planetGroups, controls);

function animate() {
    requestAnimationFrame(animate);
    const deltaTime = clock.getDelta() * SPEED_COEFFICIENT;
    const daysPassed = deltaTime; // 1 Sekunde = 1 Tag bei SPEED_COEFFICIENT = 1
    updatePlanets(planetGroups, daysPassed);
    updateMoons(moons, daysPassed);
    if (earthClouds) {
        earthClouds.update(daysPassed);
    }
    controls.update();
    sun.material.uniforms.time.value += 0.02;
    updateGlow();
    renderer.render(scene, camera);
}
animate();
