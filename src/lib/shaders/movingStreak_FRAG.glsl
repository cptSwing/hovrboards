varying vec2 vUv;

void main() {
    vec4 baseColor = texture(map, vUv);
    baseColor.rgb *= vec3(0.5);

    csm_DiffuseColor = baseColor;
}
