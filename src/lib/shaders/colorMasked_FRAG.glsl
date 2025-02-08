uniform vec3 u_customColor;

void main() {
    vec3 preColored = vColor.rgb;
    vec3 baseColor = preColored;

    #if defined( USE_MAP )
    #if defined(MAP_UV)
    baseColor = texture(map, vUv).rgb;
    #endif
    #endif

    float useCustomColor = vColor.a;

    vec3 vertexColors = mix(preColored, u_customColor, useCustomColor);
    vec3 coloredMap = baseColor * (vertexColors * vec3(2.));

    csm_DiffuseColor = vec4(coloredMap, opacity);

    // csm_FragColor = vColor;
}
