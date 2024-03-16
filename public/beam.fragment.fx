precision highp float;
// attribute vec3 position;
// attribute vec3 normal;

varying vec3 vPosition;
varying vec3 vNormal;

uniform vec3 lightColor;
uniform vec3 spotPosition;
uniform float attenuation;
uniform float anglePower;

// gl_FragColor = vec4(1.,0.,0.,1.);

void main()
{
    float intensity;
    intensity = distance(vPosition, spotPosition) / attenuation;
    intensity = 1.0 - clamp(intensity, 0.0, 1.0);

    vec3 normal = vec3(vNormal.x, vNormal.y, abs(vNormal.z));
    float angleIntensity = pow(dot(normal, vec3(0.0, 0.0, 1.0)), anglePower);
    intensity = intensity * angleIntensity;
    gl_FragColor = vec4(lightColor, intensity);
}