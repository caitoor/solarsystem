// src/assets/shaders/glowFragment.glsl

uniform vec3 glowColor;
uniform float glowFactor;
uniform float opacity;
varying float intensity;
void main() {
  gl_FragColor = vec4(glowColor, intensity * glowFactor * opacity);
}