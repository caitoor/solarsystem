uniform vec3 glowColor;
uniform float glowFactor;
varying float intensity;
void main() {
  gl_FragColor = vec4(glowColor, intensity * glowFactor);
}
