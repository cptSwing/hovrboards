/* Some tunning, set here to match Painter a little bit more */
static const float cg_PI = 3.141592666f;
static const float blikMultiplier = 15;
static const float mipMultiplier = 15;
static const float3 lightDirection = float3(1.3, .5, -1);

//------------------------------------
// Defines
//------------------------------------
#define NumberOfMipMaps 0
#define ROUGHNESS_BIAS 0.005
#define EPSILON 10e-5f


#define _3DSMAX_SPIN_MAX 99999

static const float diffGamma = 2.2;
static const float floatPrecisionThreshold = 0.999999;

//------------------------------------
// Samplers
//------------------------------------
#include "samplers.fxh"

// SamplerLinearWrap
SAMPLERMINMAGMIPLINEARWRAP
// SamplerCubeMap
SAMPLERCUBEMAP
// SamplerState SamplerAnisoClampUV (used in toneMapping.fxh)
SAMPLERSTATEANISOCLAMP_UV

// maxplay includes
#include "pbr_shader_ui.fxh"
#include "toneMapping.fxh"

// max includes
#include "maxUtilities.fxh"

//------------------------------------
// Map Channels
//------------------------------------
MAXTEXCOORD0
MAXVCOLORCOORD
MAXVALPHACOORD


//------------------------------------
// Textures
//------------------------------------
// baseColorMap:			Texture2D
HOG_MAP_BASECOLOR
// baseNormalMap:			Texture2D
HOG_MAP_BASENORMAL
// roughnessMap:			Texture2D
HOG_MAP_ROUGHNESS
// metalnessMap:			Texture2D		
HOG_MAP_METALNESS 

// These are PBR IBL env related texture inputs
HOG_CUBEMAP_IBLDIFF
HOG_CUBEMAP_IBLSPEC
HOG_ENVLIGHTING_EXP


// Per Frame constant buffer
#include "cbuffers.fxh"

//------------------------------------
// Vertex Shader
//------------------------------------
struct vsInput
{
	float3 m_Position		: POSITION;
	float4 m_AlbedoRGBA     : COLOR;
	float2 m_Uv0			: TEXCOORD0;
	float3 m_Normal			: NORMAL;
	float3 m_Tangent		: TANGENT;
	float3 m_Binormal		: BINORMAL;

    float3 m_VertexColor    : TEXCOORD5;
    float m_VertexAlpha     : TEXCOORD6;
};

struct VsOutput
{
	float4 m_Position		    : SV_POSITION;
	float4 m_AlbedoRGBA         : COLOR;
	float2 m_Uv0			    : TEXCOORD0;
	float4 m_WorldPosition	    : TEXCOORD1_centroid;
	float4 m_View			    : TEXCOORD2_centroid;
	float3x3 m_TWMtx		    : TEXCOORD3_centroid;

    float4 m_VertexColorAlpha   : TEXCOORD6;
};

/* Tools */
#include "tools.fxh"

VsOutput vsMain(vsInput v)
{
	VsOutput OUT = (VsOutput)0;

	OUT.m_Position = mul( float4( v.m_Position, 1.0f ), WorldViewProj );

    // WARN deleted m_NormalW, m_TangentW, m_BinormalW here as they seemed unused
	
	// we pass vertices in world space
	OUT.m_WorldPosition = mul(float4(v.m_Position, 1), World);

	// Pass through texture coordinates
	OUT.m_Uv0 = v.m_Uv0;

    OUT.m_VertexColorAlpha = float4(v.m_VertexColor, v.m_VertexAlpha);

	// Build the view vector and cache its length in W
	// pulling the view position in world space from the inverse view matrix 4th row
	OUT.m_View.xyz = viewInv[3].xyz - OUT.m_WorldPosition.xyz;
	OUT.m_View.w = length(OUT.m_View.xyz);
	// normalize
	OUT.m_View.xyz *= rcp(OUT.m_View.w);

	// Compose the tangent space to local space matrix
	OUT.m_TWMtx[0] = mul(v.m_Tangent, World);
	OUT.m_TWMtx[1] = mul(v.m_Binormal, World);
	OUT.m_TWMtx[2] = mul(v.m_Normal, World);

	// ZUP/YUP
    OUT.m_View.xyz = float3(OUT.m_View.x, OUT.m_View.z, -OUT.m_View.y);
    OUT.m_WorldPosition = OUT.m_WorldPosition[0], OUT.m_WorldPosition[2], -OUT.m_WorldPosition[1];

    OUT.m_TWMtx[0] = float3(OUT.m_TWMtx[0][0], OUT.m_TWMtx[0][2], -OUT.m_TWMtx[0][1]);
    OUT.m_TWMtx[1] = float3(OUT.m_TWMtx[1][0], OUT.m_TWMtx[1][2], -OUT.m_TWMtx[1][1]);
    OUT.m_TWMtx[2] = float3(OUT.m_TWMtx[2][0], OUT.m_TWMtx[2][2], -OUT.m_TWMtx[2][1]);

	return OUT;
}

//------------------------------------
// Pixel Shader
//------------------------------------

float4 pMain(VsOutput p, bool FrontFace : SV_IsFrontFace) : SV_Target
{

	// I think we need to POM before we clip?
	// 1) silohuette pom clips
	// 2) we can/should set up UV's before we start sampling textures?
	float2 baseUV = p.m_Uv0.xy;


	// texture maps and such
	float3 baseColorTex = baseColorMap.Sample(SamplerLinearWrap, baseUV).rgb;
    
    float3 bColorLin = pow(baseColorTex.rgb, 1.0f / diffGamma);

    float useCustomColor = p.m_VertexColorAlpha.a > floatPrecisionThreshold ? 1 : 0;
    float3 colorToMultiply = lerp(p.m_VertexColorAlpha.rgb, materialCustomColor, useCustomColor);
    float3 colDouble = colorToMultiply * 2;
    
    bColorLin *= colDouble;

	// roughnessMap:			Texture2D
	float3 roughnessTex = roughnessMap.Sample(SamplerLinearWrap, baseUV).rgb;
	float pbrRoughness = 0.0f;  // store it here
	pbrRoughness = roughnessTex.g;

	// metalnessMap:			Texture2D
	float pbrMetalness = 0.0f;
	float3 metalnessTex = metalnessMap.Sample(SamplerLinearWrap, baseUV.xy).rgb;
	pbrMetalness = metalnessTex.g;

    // base color variant for metals
	float3 mColorLin = bColorLin * (1.0f - pbrMetalness);

	float3 normalMap = baseNormalMap.Sample(SamplerLinearWrap, baseUV).xyz;
	float3 normalLin = normalMap * 2 - 1; // -> Zero centered, (-1, 1)
    if (flipNormalMapY) {
        normalLin.y *= -1;
    }

	float3 n = (normalLin.x * p.m_TWMtx[0] + normalLin.y * p.m_TWMtx[1]) + normalLin.z * p.m_TWMtx[2];

    n = lerp(p.m_TWMtx[2], n, materialBumpIntensity);

	// reflection is incoming light
	float3 R = -reflect(p.m_View.xyz, n);
	
	// How blur blurred refl will be. Also: To mach look in painter value is multiplied for metals. Not sure why it works
	const float rMipCount = 8.0f + pbrMetalness * mipMultiplier;
	float roughMip = pbrRoughness * rMipCount;

	// Set up envmap values
	float4 diffEnvMap = diffuseEnvTextureCube.SampleLevel(SamplerCubeMap, n, 0.0f).rgba;
	float4 specEnvMap = specularEnvTextureCube.SampleLevel(SamplerCubeMap, R, roughMip).rgba;

	float3 specEnv = RGBMDecode(specEnvMap, envLightingExp, 1.0f/diffGamma);
	float3 diffEnv = RGBMDecode(diffEnvMap, envLightingExp, 1.0f/diffGamma);

	float specValue = lerp(0.02, 1, pbrMetalness);
	float3 spec = LightingFuncGGX(n, p.m_View.xyz, lightDirection, pbrRoughness, specValue); // Blink
	spec *=  blikMultiplier*lerp(1, pow(baseColorTex, 3), pbrMetalness);  // Color and power
	float fresnel = pow(1 - dot(p.m_View.xyz, n), 5);

	// Now fresnel reflections: lerp(1, baseColorTex*.9 + .1, pbrMetalness) was added to match look in painter.
	// It should not be there, but then results are weird with strong normal maps: when mesh should reflect itself in real life
	spec += clamp( lerp( lerp(specValue, specValue * baseColorTex, pbrMetalness), lerp(1, baseColorTex * .9 + .1, pbrMetalness), fresnel ), 0, specValue ) * pow(specEnv, 0.6) * 2;

	// Finish:
    float3 m_Color = (diffEnv * mColorLin);
	m_Color += spec;
	
    // Why does this work? It looks ok imo when linearSpaceOutput is on, but why I need to set gamma to 1/pow(diffGamma, 2) to make it look right with viewport cc?
    float3 result =  reinhardExp(m_Color, 1.3, linearOutput ? 1.0f / diffGamma : 1 / pow(diffGamma, 2) );

	float4 color_Out = float4(result, 1);

	return color_Out;
}


// Techniques

technique11 Main 
{
    pass p0 
	{
        	VertexShader = compile vs_5_0 vsMain();
        	PixelShader = compile ps_5_0 pMain();
	}
}
