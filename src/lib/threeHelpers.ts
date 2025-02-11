import { BufferGeometry, Mesh, MeshStandardMaterial, Object3D, Object3DEventMap } from 'three';
import { mergeBufferGeometries } from 'three-stdlib';
import { GLTFResult, MeshWithMaterialArray, MeshWithSingleMaterial } from '../types/types';
import { ColorMaskedMaterial } from './materials/ColorMaskedMaterial';

const geometryNameAddendum = '_geometry';
const cachedGeometries: Record<string, BufferGeometry> = {};

export const mergeToMultimaterialMesh = (meshes: MeshWithSingleMaterial[], parentMesh: Object3D) => {
    const geoName = parentMesh.name + geometryNameAddendum;

    const materials = meshes.map((mesh) => mesh.material);
    let newGeometry: BufferGeometry;

    if (geoName in cachedGeometries) {
        newGeometry = cachedGeometries[geoName];
    } else {
        const geometries = meshes.map(({ geometry }) => geometry);
        const mergedGeometry = mergeBufferGeometries(geometries, true) as BufferGeometry;

        if (!mergedGeometry) {
            throw new Error('mergeBufferGeometries() error in mergeToMultimaterialMesh()');
        } else {
            mergedGeometry.name = geoName;
            newGeometry = mergedGeometry;

            cachedGeometries[geoName] = newGeometry;
        }
    }

    const newMesh = new Mesh(newGeometry, materials);
    newMesh.position.copy(parentMesh.position);
    newMesh.rotation.copy(parentMesh.rotation);
    newMesh.name = parentMesh.name;

    return newMesh as MeshWithMaterialArray;
};

export const materialToArrayOfMaterials = (mesh: MeshWithSingleMaterial) => {
    const geoName = mesh.name + geometryNameAddendum;

    const materialArray = [mesh.material];
    let newGeometry: BufferGeometry;

    if (geoName in cachedGeometries) {
        newGeometry = cachedGeometries[geoName];
    } else {
        const geo = mesh.geometry.clone();
        const count = geo.index ? geo.index.count : geo.getAttribute('position').count;
        geo.addGroup(0, count, 0);
        geo.name = geoName;
        newGeometry = geo;

        cachedGeometries[geoName] = newGeometry;
    }

    const multiMatMesh = mesh.clone() as unknown as MeshWithMaterialArray;
    multiMatMesh.material = materialArray;
    multiMatMesh.geometry = newGeometry;
    multiMatMesh.name = mesh.name;

    return multiMatMesh;
};

export const replaceWithCustomMaterial = ({ map, normalMap, roughnessMap, metalness, roughness, emissive, name }: MeshStandardMaterial) =>
    new ColorMaskedMaterial({
        map,
        normalMap,
        roughnessMap,
        metalness,
        roughness,
        emissive,
        name,
    });

export const getFirstMesh = (nodes: Object3D<Object3DEventMap>[]) => nodes.find((node) => (node as Mesh).isMesh) as MeshWithSingleMaterial;
export const _getFirstPlug = (nodes: GLTFResult['nodes']) => Object.values(nodes).find((node) => node.name.includes('plug_')) as Object3D;
