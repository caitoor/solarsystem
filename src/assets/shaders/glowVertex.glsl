uniform vec3 viewVector;
uniform float falloffExponent; // exponent for opacity drop-off
varying float intensity;
void main() {
  vec3 transformedNormal = normalize(normalMatrix * normal);
  vec3 viewDir = normalize(normalMatrix * viewVector);
  intensity = pow(1.0 - dot(transformedNormal, viewDir), falloffExponent);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
