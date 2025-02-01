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
    amplitude *= 0.65;
  }
  return total;
}

void main() {
  vec2 uv = vUv;
  // Compute FBM noise and smooth it for a gentler variation.
  float n = fbm(uv * 20.0 + time * 0.2);
  float ns = smoothstep(0.3, 0.7, n);
  
  // Convert uv.x to a full circle to ensure seamless wrapping.
  float angle = uv.x * 6.28318; // 2*PI
  float wave = sin(angle + time + ns * 6.28);
  
  // Remap the wave to a brightness value.
  float brightness = wave * 0.3 + 0.7;

  // Define the two colors: dark (orangerot) and bright (yellow)
  vec3 darkColor = vec3(0.7, 0.1, 0.1);
  vec3 brightColor = vec3(1.0, 0.75, 0.0);

  // Smoothly interpolate between the dark and bright colors.
  vec3 finalColor = mix(darkColor, brightColor, brightness);
  
  gl_FragColor = vec4(finalColor, 1.0);
}
