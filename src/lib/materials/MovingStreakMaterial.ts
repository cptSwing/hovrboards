import { AdditiveBlending, Clock, MeshBasicMaterial, Texture } from 'three';
import CustomShaderMaterial from 'three-custom-shader-material/vanilla';
import movingStreak_VERT from '../shaders/movingStreak_VERT.glsl';
import movingStreak_FRAG from '../shaders/movingStreak_FRAG.glsl';

type MovingStreakMaterialParams = {
    map: Texture | null;
    speed?: number;
    name?: string;
};

export class MovingStreakMaterial extends CustomShaderMaterial {
    constructor(params: MovingStreakMaterialParams) {
        const { speed = 1.5, ...materialParams } = params;

        super({
            baseMaterial: MeshBasicMaterial,
            vertexShader: movingStreak_VERT,
            fragmentShader: movingStreak_FRAG,
            blending: AdditiveBlending,
            uniforms: {
                u_time: {
                    value: 0,
                },
                u_speed: {
                    value: speed,
                },
            },
            ...materialParams,
        });
    }

    declare uniforms: {
        u_time: {
            value: Clock['elapsedTime'];
        };
        u_speed: {
            value: MovingStreakMaterialParams['speed'];
        };
    };
}
