uniform vec3 u_customColor;

void main() {
    vec3 preColored = vColor.rgb;

    #if defined( USE_MAP )
    vec3 baseColor = texture(map, vUv).rgb;
    #else
    vec3 baseColor = preColored;
    #endif

    float useCustomColor = vColor.a;

    vec3 vertexColors = mix(preColored, u_customColor, useCustomColor);
    vec3 coloredMap = baseColor * (vertexColors * vec3(2.));

    csm_DiffuseColor = vec4(coloredMap, opacity);

    // csm_FragColor = vec4(vec3(useCustomColor), 1.);
    // csm_FragColor = vColor;
    // csm_FragColor = vec4(u_customColor, 1.);
}
