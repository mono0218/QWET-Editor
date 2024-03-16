precision highp float;
attribute vec3 position;
attribute vec3 normal;
uniform mat4 worldViewProjection;

varying vec3 vPosition;
varying vec3 vNormal;

void main()
{
    vec4 p = vec4(position, 1.);
    vPosition = position;
    vNormal = normal;
    gl_Position = worldViewProjection * p;
}
