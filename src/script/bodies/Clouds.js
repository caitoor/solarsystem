import * as THREE from 'three';
import cloudsVertex from '../../assets/shaders/cloudsVertex.glsl?raw';
import cloudsFragment from '../../assets/shaders/cloudsFragment.glsl?raw';

export class Clouds {
    constructor(planetMesh, options = {}) {
        this.options = Object.assign({
            texture: null,
            color: 0xffffff,
            opacity: 0.4,
            speed: 0.1,
            radiusFactor: 1.02
        }, options);

        this.planetMesh = planetMesh;

        const planetRadius = planetMesh.geometry.parameters.radius;
        const cloudGlobeRadius = planetRadius * this.options.radiusFactor;
        const geometry = new THREE.SphereGeometry(cloudGlobeRadius, 64, 64);

        const uniforms = {
            time: { value: 0 },
            baseColor: { value: new THREE.Color(this.options.color) },
            opacity: { value: this.options.opacity },
            speed: { value: this.options.speed },
            hasTexture: { value: this.options.texture ? 1 : 0 },
            cloudsTexture: { value: null }
        };

        if (this.options.texture) {
            const loader = new THREE.TextureLoader();
            uniforms.cloudsTexture.value = loader.load(this.options.texture,
                () => { console.log('Clouds texture loaded:', this.options.texture); },
                undefined,
                (err) => { console.error('Error loading clouds texture:', err); }
            );
        }

        this.material = new THREE.ShaderMaterial({
            vertexShader: cloudsVertex,
            fragmentShader: cloudsFragment,
            uniforms: uniforms,
            transparent: true,
            depthWrite: false,
            blending: THREE.NormalBlending
        });

        this.mesh = new THREE.Mesh(geometry, this.material);
        this.mesh.position.copy(planetMesh.position);
    }

    update(delta) {
        this.material.uniforms.time.value += delta;
        // Aktualisiere die Position anhand des Weltortes des Planeten
        this.mesh.position.copy(this.planetMesh.getWorldPosition(new THREE.Vector3()));
        // Kopiere die Weltrotation des Planeten auf den Atmosphären-Layer,
        // damit die Wolken den Dreheffekt der Erde übernehmen.
        this.mesh.quaternion.copy(this.planetMesh.getWorldQuaternion(new THREE.Quaternion()));
    }
}