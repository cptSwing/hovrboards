import { Color, MeshStandardMaterial, Texture } from 'three';
import CustomShaderMaterial from 'three-custom-shader-material/vanilla';
import colorMasked_FRAG from '../shaders/colorMasked_FRAG.glsl';

type ColorMaskedMaterialParams = {
    map: Texture | null;
    normalMap: Texture | null;
    metalness: number;
    roughness: number;
    emissive: Color;
    name: string;
};

export class ColorMaskedMaterial extends CustomShaderMaterial<typeof MeshStandardMaterial> {
    constructor(params: ColorMaskedMaterialParams) {
        super({
            baseMaterial: MeshStandardMaterial,
            vertexColors: true,
            fragmentShader: colorMasked_FRAG,
            uniforms: {
                u_customColor: {
                    value: new Color(),
                },
            },
            ...params,
        });
    }
}
