
/* Tools */

float3 RGBMDecode ( float4 rgbm, float hdrExp, float gammaExp ) 
{
    float3 upackRGBhdr = (rgbm.bgr * rgbm.a) * hdrExp;
    float3 rgbLin = pow(upackRGBhdr.rgb, gammaExp);
    return rgbLin;
}

/* BrDf: GGX */
float G1V(float dotNV, float k)
{
	return 1.0f/(dotNV*(1.0f-k)+k);
}

float LightingFuncGGX(float3 N, float3 V, float3 L, float roughness, float F0)
{
	float alpha = roughness*roughness;
	float3 H = normalize(V+L);
	float dotNL = saturate(dot(N,L));
	float dotLH = saturate(dot(L,H));
	float dotNH = saturate(dot(N,H));
	float F, D, vis;

	// D
	float alphaSqr = alpha*alpha;
	float pi = 3.14159f;
	float denom = dotNH * dotNH *(alphaSqr-1.0) + 1.0f;
	D = alphaSqr/(pi * denom * denom);

	// F
	float dotLH5 = pow(1.0f-dotLH,5);
	F = F0 + (1.0-F0)*(dotLH5);

	// V
	float k = alpha/2.0f;
	float k2 = k*k;
	float invK2 = 1.0f-k2;
	vis = rcp(dotLH*dotLH*invK2 + k2);

	float specular = dotNL * D * F * vis;
	return specular;
}
