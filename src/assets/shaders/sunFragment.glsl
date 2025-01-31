uniform float time;
varying vec2 vUv;
void main() {
    float brightness = sin(vUv.x * 10.0 + time) * 0.5 + 0.5;
    gl_FragColor = vec4(vec3(1.0, 0.6, 0.0) * brightness, 1.0);
}