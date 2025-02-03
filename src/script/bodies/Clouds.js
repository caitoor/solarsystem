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
      radiusFactor: 1.001
    }, options);

    this.planetMesh = planetMesh;

    // Hole das tatsächliche Planet-Mesh, falls planetMesh eine Gruppe (Pivot) ist.
    let actualPlanetMesh = planetMesh;
    if (!planetMesh.geometry && planetMesh.children.length > 0) {
      actualPlanetMesh = planetMesh.children[0];
    }

    const planetRadius = actualPlanetMesh.geometry.parameters.radius;
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
      uniforms.cloudsTexture.value = loader.load(
        this.options.texture,
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
    // Positioniere initial an der Position des übergebenen Pivot-Objekts.
    this.mesh.position.copy(planetMesh.getWorldPosition(new THREE.Vector3()));
  }

  update(delta) {
    this.material.uniforms.time.value += delta;
    // Aktualisiere die Position anhand des Weltortes des Planet-Pivots.
    this.mesh.position.copy(this.planetMesh.getWorldPosition(new THREE.Vector3()));
    // Um die tatsächliche Selbstrotation (und damit den Axial-Tilt) zu erhalten,
    // frage das tatsächliche Planet-Mesh (Kind der Pivot-Gruppe) ab.
    let actualPlanetMesh = this.planetMesh;
    if (!this.planetMesh.geometry && this.planetMesh.children.length > 0) {
      actualPlanetMesh = this.planetMesh.children[0];
    }
    this.mesh.quaternion.copy(actualPlanetMesh.getWorldQuaternion(new THREE.Quaternion()));
  }
}
