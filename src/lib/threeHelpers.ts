import { BufferGeometry, Material, Mesh, MeshStandardMaterial, Object3D, Object3DEventMap } from 'three';
import { mergeBufferGeometries } from 'three-stdlib';
import { GLTFResult, MeshMaterialArray, MeshSingleMaterial } from '../types/types';
import { ColorMaskedMaterial } from './materials/ColorMaskedMaterial';

export const mergeToMultimaterialMesh = (meshes: MeshSingleMaterial[], name: string) => {
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
    return newMesh as MeshMaterialArray;
};

export const materialToArrayOfMaterials = (mesh: MeshSingleMaterial) => {
    const tempMat = mesh.material;
    const materialArray = [tempMat];

    const multiMatMesh = mesh as unknown as MeshMaterialArray;
    multiMatMesh.material = materialArray;

    const geo = multiMatMesh.geometry;
    const count = geo.index ? geo.index.count : geo.getAttribute('position').count;
    multiMatMesh.geometry.addGroup(0, count, 0);

    return multiMatMesh;
};

export const setCommonMaterialValues = ({ map, normalMap, metalness, roughness, emissive, name }: MeshStandardMaterial) => {
    const newMaterial = new ColorMaskedMaterial({
        // map: map ?? emptyTex,
        // normalMap: normalMap ?? emptyTex,
        map,
        normalMap,
        metalness,
        roughness,
        emissive,
        name,
    });

    return newMaterial;
};

export const getFirstMesh = (nodes: Object3D<Object3DEventMap>[]) => nodes.find((node) => (node as Mesh).isMesh) as MeshSingleMaterial;
export const _getFirstPlug = (nodes: GLTFResult['nodes']) => Object.values(nodes).find((node) => node.name.includes('plug_')) as Object3D;
