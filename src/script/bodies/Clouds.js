// src/script/bodies/Clouds.js
import * as THREE from 'three';
import cloudsVertex from '../../assets/shaders/cloudsVertex.glsl?raw';
import cloudsFragment from '../../assets/shaders/cloudsFragment.glsl?raw';

export class Clouds {
    constructor(planetMesh, options = {}) {
        // Standardoptionen, die ggf. überschrieben werden können
        this.options = Object.assign({
            texture: null,
            color: 0xffffff,
            opacity: 0.4,
            speed: 0.1,
            radiusFactor: 1.02
        }, options);

        // Der übergebene planetMesh (Pivot-Container) wird gespeichert
        this.planetMesh = planetMesh;

        // Hole das tatsächliche Planet-Mesh aus dem Container (falls vorhanden)
        let actualPlanetMesh = planetMesh;
        if (!planetMesh.geometry && planetMesh.children.length > 0) {
            actualPlanetMesh = planetMesh.children[0];
        }

        // Ermittele den Radius aus der Geometrie des tatsächlichen Planet-Meshes
        const planetRadius = actualPlanetMesh.geometry.parameters.radius;
        // Der Clouds-Layer soll etwas größer als der Planet sein
        const cloudGlobeRadius = planetRadius * this.options.radiusFactor;
        const geometry = new THREE.SphereGeometry(cloudGlobeRadius, 64, 64);

        // Definiere Uniforms für den Shader
        const uniforms = {
            time: { value: 0 },
            baseColor: { value: new THREE.Color(this.options.color) },
            opacity: { value: this.options.opacity },
            speed: { value: this.options.speed },
            hasTexture: { value: this.options.texture ? 1 : 0 },
            cloudsTexture: { value: null }
        };

        // Falls eine Textur angegeben wurde, lade sie
        if (this.options.texture) {
            const loader = new THREE.TextureLoader();
            uniforms.cloudsTexture.value = loader.load(
                this.options.texture,
                () => { /* Texture loaded, ggf. Debug-Log hier */ },
                undefined,
                (err) => { console.error('Error loading clouds texture:', err); }
            );
        }

        // Erstelle das ShaderMaterial mit Transparenz
        this.material = new THREE.ShaderMaterial({
            vertexShader: cloudsVertex,
            fragmentShader: cloudsFragment,
            uniforms: uniforms,
            transparent: true,
            depthWrite: false,
            blending: THREE.NormalBlending
        });

        // Erstelle das Clouds-Mesh und positioniere es initial an der Weltposition des Pivot-Containers
        this.mesh = new THREE.Mesh(geometry, this.material);
        this.mesh.position.copy(planetMesh.getWorldPosition(new THREE.Vector3()));
    }

    update(delta) {
        // Erhöhe den time-Uniform, um die Animation voranzutreiben
        this.material.uniforms.time.value += delta;
        // Aktualisiere die Position des Clouds-Meshes anhand der Weltposition des Pivot-Containers
        this.mesh.position.copy(this.planetMesh.getWorldPosition(new THREE.Vector3()));
        // Um die Selbstrotation (und damit den Axial-Tilt) korrekt zu übernehmen,
        // verwenden wir das tatsächliche Planet-Mesh (falls vorhanden)
        let actualPlanetMesh = this.planetMesh;
        if (!this.planetMesh.geometry && this.planetMesh.children.length > 0) {
            actualPlanetMesh = this.planetMesh.children[0];
        }
        // Kopiere die Weltrotation des tatsächlichen Planet-Meshes auf den Clouds-Layer
        this.mesh.quaternion.copy(actualPlanetMesh.getWorldQuaternion(new THREE.Quaternion()));
    }
}
