uniform float time;
uniform float speed;
uniform int hasTexture;
uniform sampler2D cloudsTexture;
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
  float amplitude = 0.5;
  for (int i = 0; i < 5; i++) {
    total += amplitude * noise(p);
    p *= 2.0;
    amplitude *= 0.5;
  }
  return total;
}

void main() {
  // UV-Skalierung: Erhöhe diesen Wert, um das Detailniveau zu erhöhen
  vec2 uv = vUv * 4.0;
  // Zeitliche Verschiebung der UVs, um Bewegung zu erzeugen
  uv += vec2(time * speed, time * speed * 0.5);
  float n = fbm(uv);
  
  // ******** WOLKENABDECKUNG ********
  // Hier wird das FBM-Muster in einen Wolkenwert (zwischen 0 und 1) umgewandelt.
  // Aktuell werden nur Noise-Werte zwischen 0.7 und 0.85 als Wolken interpretiert.
  // Um mehr Wolken abzudecken, senke den unteren Schwellenwert und/oder erhöhe den oberen.
  // Beispiel: smoothstep(0.4, 0.7, n) würde mehr Bereiche als Wolken klassifizieren.
  float clouds = smoothstep(0.5, 0.85, n);
  
  // Weichere den Übergang (auch hier kannst du den Exponenten anpassen)
  clouds = pow(clouds, 0.8);
  // ************************************

  vec4 finalColor;
  if (hasTexture == 1) {
    // Falls eine Textur vorhanden ist, verschiebe UVs der Textur (unabhängig vom FBM-Pfad)
    vec2 uvTex = vUv + vec2(time * speed * 0.8, time * speed * 0.4);
    vec4 texColor = texture2D(cloudsTexture, uvTex);
    // Mische die Textur mit dem prozeduralen Wolkenwert.
    finalColor = vec4(mix(texColor.rgb, vec3(clouds), 0.5), 0.5);
  } else {
    finalColor = vec4(vec3(clouds), 0.5);
  }
  
  gl_FragColor = finalColor;
}
