import { BufferGeometry, Material, Mesh, Object3D } from 'three';
import { mergeBufferGeometries } from 'three-stdlib';
import { GLTFResult, MeshMultipleMaterials, MeshSingleMaterial } from '../types/types';

const useVertexColors = true;
export const mergeMultimaterialMesh = (meshes: MeshSingleMaterial[], name: string) => {
    const geoAndMatCollection = {
        geometries: [],
        materials: [],
    } as { geometries: BufferGeometry[]; materials: Material[] };

    meshes.forEach(({ geometry, material }) => {
        // console.log('%c[threeHelpers]', 'color: #cb69f8', `${name} geometry.index :`, geometry.index);
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

export const setCommonMaterialValues = (material: Material) => {
    if (useVertexColors) {
        material.vertexColors = true;

        // material.onBeforeCompile = (shader) => {
        //     shader.fragmentShader = shader.fragmentShader.replace(
        //         'vec4 diffuseColor = vec4( diffuse, opacity );',
        //         'vec4 diffuseColor = vec4(mix(diffuse, vColor.rgb, vColor.r), opacity );',
        //     );

        //     shader.fragmentShader = shader.fragmentShader.replace('#include <color_fragment>', '');
        // };
    }
};

export const getFirstMesh = (nodes: GLTFResult['nodes']) =>
    Object.values(nodes).find((node) => (node as Mesh).isMesh) as MeshSingleMaterial | MeshMultipleMaterials;
export const _getFirstPlug = (nodes: GLTFResult['nodes']) => Object.values(nodes).find((node) => node.name.includes('plug_')) as Object3D;
