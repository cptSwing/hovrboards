import { BufferGeometry, Color, Material, Mesh, MeshStandardMaterial, Object3D, Texture } from 'three';
import { mergeBufferGeometries } from 'three-stdlib';
import { GLTFResult, MeshMultipleMaterials, MeshSingleMaterial } from '../types/types';
import CustomShaderMaterial from 'three-custom-shader-material/vanilla';
import colorMasked_VERT from './shaders/colorMasked_VERT.glsl';
import colorMasked_FRAG from './shaders/colorMasked_FRAG.glsl';

const useVertexColors = true;

export const mergeMultimaterialMesh = (meshes: MeshSingleMaterial[], name: string) => {
    const geoAndMatCollection = {
        geometries: [],
        materials: [],
    } as { geometries: BufferGeometry[]; materials: Material[] };

    meshes.forEach(({ geometry, material }) => {
        geoAndMatCollection.geometries.push(geometry);
        geoAndMatCollection.materials.push(material);
    });

    const mergedGeometries = mergeBufferGeometries(geoAndMatCollection.geometries, true);

    const newMesh = new Mesh(mergedGeometries ?? new BufferGeometry(), geoAndMatCollection.materials);
    newMesh.name = name;
    return newMesh as MeshMultipleMaterials;
};

export const materialToArrayOfMaterials = (mesh: MeshSingleMaterial) => {
    const tempMat = mesh.material;
    const materialArray = [tempMat];

    const multiMatMesh = mesh as unknown as MeshMultipleMaterials;
    multiMatMesh.material = materialArray;

    const geo = multiMatMesh.geometry;
    const count = geo.index ? geo.index.count : geo.getAttribute('position').count;
    multiMatMesh.geometry.addGroup(0, count, 0);

    return multiMatMesh;
};

export const setCommonMaterialValues = (material: MeshStandardMaterial) =>
    new ColorMaskedMaterial({
        map: material.map,
        normalMap: material.normalMap,
        metalness: material.metalness,
        roughness: material.roughness,
        emissive: material.emissive,
        name: material.name,
    });

export const getFirstMesh = (nodes: GLTFResult['nodes']) =>
    Object.values(nodes).find((node) => (node as Mesh).isMesh) as MeshSingleMaterial | MeshMultipleMaterials;
export const _getFirstPlug = (nodes: GLTFResult['nodes']) => Object.values(nodes).find((node) => node.name.includes('plug_')) as Object3D;

type ColorMaskedMaterialParams = {
    map: Texture | null;
    normalMap: Texture | null;
    metalness: number;
    roughness: number;
    emissive: Color;
    name: string;
};

export class ColorMaskedMaterial extends CustomShaderMaterial {
    constructor(params: ColorMaskedMaterialParams) {
        super({
            baseMaterial: MeshStandardMaterial,
            defines: { USE_COLOR_ALPHA: '', USE_UV: '', MAP_UV: 'uv', USE_NORMALMAP: '', NORMALMAP_UV: 'uv' },
            vertexColors: useVertexColors,
            vertexShader: colorMasked_VERT,
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
