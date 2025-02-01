uniform float time;
varying vec2 vUv;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

float fbm(vec2 p) {
  float total = 0.0;
  float amplitude = 1.0;
  float frequency = 1.0;
  for (int i = 0; i < 4; i++) {
    total += noise(p * frequency) * amplitude;
    frequency *= 2.0;
    amplitude *= 0.5;
  }
  return total;
}

void main() {
  vec2 uv = vUv;
  float n = fbm(uv * 5.0 + time * 0.2);
  float brightness = sin(uv.x * 10.0 + time + n * 6.28) * 0.3 + 0.7;

  // Definiere die Farben
  vec3 brightColor = vec3(1.0, 0.6, 0.0);
  vec3 darkColor = vec3(0.5, 0.0, 0.0);

  // Interpoliere zwischen darkColor und brightColor
  vec3 finalColor = mix(darkColor, brightColor, brightness);
  
  gl_FragColor = vec4(finalColor, 1.0);
}
