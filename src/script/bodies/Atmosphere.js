// src/script/bodies/Atmosphere.js
import * as THREE from 'three';
import GlowShader from '../shaders/GlowShader';
import { UniformsUtils } from 'three';

export class Atmosphere {
    /**
     * Erzeugt einen Atmosphären- (Glow-) Layer für einen Himmelskörper.
     * @param {THREE.Object3D} parentMesh - Das übergeordnete Objekt (Pivot oder Mesh), dessen Weltposition und Rotation übernommen werden.
     * @param {Object} options - Konfigurationsoptionen:
     *   - texture: (string) Optionaler Pfad zur Atmosphären-Textur (wird hier nicht genutzt, da wir den Glow-Effekt ohne Textur verwenden),
     *   - color: (number oder THREE.Color) Basisfarbe des Glow-Effekts,
     *   - opacity: (number) Opazität des Glow-Effekts,
     *   - speed: (number) Animationsgeschwindigkeit (für dynamische Effekte, falls gewünscht),
     *   - radiusFactor: (number) Faktor, um wieviel größer der Atmosphären-Layer als der Parent sein soll,
     *   - glowFactor: (number) Faktor, der die Intensität des Glow-Effekts steuert,
     *   - falloffExponent: (number) Exponent, der den Übergang (Falloff) steuert.
     */
    constructor(parentMesh, options = {}) {
        this.options = Object.assign({
            texture: null,
            color: 0xffaa00,
            opacity: 0.5,
            speed: 0.1,
            radiusFactor: 1.05,
            glowFactor: 0.013,
            falloffExponent: 8.5
        }, options);

        this.parentMesh = parentMesh;

        // Falls der übergebene Parent ein Pivot (Group) ist, verwende das erste Kind als tatsächliches Mesh.
        let actualMesh = parentMesh;
        if (!parentMesh.geometry && parentMesh.children.length > 0) {
            actualMesh = parentMesh.children[0];
        }

        // Bestimme den Radius des Parent-Meshes und skaliere ihn.
        const parentRadius = actualMesh.geometry.parameters.radius;
        const atmosphereRadius = parentRadius * this.options.radiusFactor;
        const geometry = new THREE.SphereGeometry(atmosphereRadius, 64, 64);

        // Klone die Uniforms des GlowShader und überschreibe mit Optionen.
        const uniforms = UniformsUtils.clone(GlowShader.uniforms);
        uniforms.glowColor.value = new THREE.Color(this.options.color);
        uniforms.glowFactor.value = this.options.glowFactor;
        uniforms.falloffExponent.value = this.options.falloffExponent;
        uniforms.opacity.value = this.options.opacity;
        // Optional: Der time-Uniform wird in update() animiert.

        // Erstelle das ShaderMaterial mit dem GlowShader.
        this.material = new THREE.ShaderMaterial({
            vertexShader: GlowShader.vertexShader,
            fragmentShader: GlowShader.fragmentShader,
            uniforms: uniforms,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });

        this.mesh = new THREE.Mesh(geometry, this.material);
        // Positioniere den Atmosphären-Layer initial an der Weltposition des Parent.
        this.mesh.position.copy(parentMesh.getWorldPosition(new THREE.Vector3()));
    }

    /**
     * Aktualisiert den Atmosphären-Layer: Uniform time, Position und Rotation.
     * @param {number} delta - Verstrichene Zeit (Simulationszeiteinheit).
     */
    update(delta) {
        this.material.uniforms.time.value += delta;
        // Aktualisiere die Position anhand des Weltortes des Parent.
        this.mesh.position.copy(this.parentMesh.getWorldPosition(new THREE.Vector3()));
        // Hole das tatsächliche Planet-Mesh (falls Parent eine Group ist)
        let actualMesh = this.parentMesh;
        if (!this.parentMesh.geometry && this.parentMesh.children.length > 0) {
            actualMesh = this.parentMesh.children[0];
        }
        // Kopiere die Weltrotation des tatsächlichen Meshs auf den Atmosphären-Layer.
        this.mesh.quaternion.copy(actualMesh.getWorldQuaternion(new THREE.Quaternion()));
    }
}
