uniform float u_time;
uniform float u_speed;
varying vec2 vUv;

void main() {
    vUv = uv;
    vUv.x /= 2.;
    vUv.x += u_time * u_speed;
}
