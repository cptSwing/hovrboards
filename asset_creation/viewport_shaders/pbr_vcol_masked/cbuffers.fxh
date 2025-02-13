//------------------------------------
// Per Frame constant buffer
//------------------------------------
cbuffer UpdatePerFrame : register(b0)
{
	float4x4 viewInv 			: ViewInverse < string UIWidget = "None"; > ;
	float4x4 view				: View < string UIWidget = "None"; > ;
	float4x4 prj				: Projection < string UIWidget = "None"; > ;
	float4x4 viewPrj			: ViewProjection < string UIWidget = "None"; > ;
	float4x4 worldViewInvTrans	: WorldViewInverseTranspose < string UIWidget = "None"; > ;

	// A shader may wish to do different actions when Maya is rendering the preview swatch (e.g. disable displacement)
	// This value will be true if Maya is rendering the swatch
	bool IsSwatchRender : MayaSwatchRender < string UIWidget = "None"; > = false;
}

//------------------------------------
// Per Object constant buffer
//------------------------------------
cbuffer UpdatePerObject : register(b1)
{
	float4x4	World				: World < string UIWidget = "None"; > ;
	float4x4	WorldView			: WorldView < string UIWidget = "None"; > ;
	float4x4	WorldIT 			: WorldInverseTranspose < string UIWidget = "None"; > ;
	float4x4	WorldViewProj		: WorldViewProjection < string UIWidget = "None"; > ;

    HOG_PROPERTY_MATERIAL_CUSTOMCOLOR

	HOG_PROPERTY_MATERIAL_BUMPINTENSITY

    HOG_PROPERTY_FLIP_NORMALMAP_Y

	HOG_PROPERTY_LINEAR_SPACE_LIGHTING

	HOG_PROPERTY_FLIP_BACKFACE_NORMALS

} //end UpdatePerObject cbuffer
