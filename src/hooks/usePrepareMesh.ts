import { useGLTF } from '@react-three/drei';
import { MeshWithCustomMaterialArray, MeshWithMaterialArray, MeshWithSingleMaterial } from '../types/types';
import { BufferAttribute, BufferGeometry, Group, MeshStandardMaterial, Object3D } from 'three';
import { getFirstMesh, materialToArrayOfMaterials, mergeToMultimaterialMesh, replaceWithCustomMaterial } from '../lib/threeHelpers';
import { useMemo } from 'react';

const usePrepareMesh = (filePath: string) => {
    const nodes = useGLTF(filePath).nodes;
    const nodeValues_Memo = useMemo(() => Object.values(nodes), [nodes]);

    const meshWithMaterialArray_Memo = useMemo(() => {
        const groupIndex = nodeValues_Memo.findIndex((node) => (node as Group).isGroup);
        const hasGroup = groupIndex > -1;

        let meshWithMaterialArray: MeshWithMaterialArray;

        if (hasGroup) {
            const parent = nodeValues_Memo[groupIndex];

            meshWithMaterialArray = mergeToMultimaterialMesh(
                parent.children.filter((child) => (child as MeshWithSingleMaterial).isMesh) as MeshWithSingleMaterial[],
                parent,
            );
        } else {
            const firstMeshNode = getFirstMesh(nodeValues_Memo);

            if (!Array.isArray(firstMeshNode.material)) {
                meshWithMaterialArray = materialToArrayOfMaterials(firstMeshNode);
            } else {
                meshWithMaterialArray = firstMeshNode as unknown as MeshWithMaterialArray;
            }
        }

        meshWithMaterialArray.material = meshWithMaterialArray.material.map((mat) => replaceWithCustomMaterial(mat as MeshStandardMaterial));
        const meshWithCustomMaterialArray = meshWithMaterialArray as MeshWithCustomMaterialArray;

        //WARN for meshes w/o exported vertex colors
        if (!meshWithCustomMaterialArray.geometry.getAttribute('color')) handleMissingVertexColors(meshWithCustomMaterialArray.geometry);

        return meshWithCustomMaterialArray;
    }, [nodeValues_Memo]);

    const sockets_Memo = useMemo(() => nodeValues_Memo.filter((node) => node.name.includes('socket_')), [nodeValues_Memo]);

    return [meshWithMaterialArray_Memo, sockets_Memo] as [MeshWithCustomMaterialArray, Object3D[]];
};

export default usePrepareMesh;

const handleMissingVertexColors = (geometry: BufferGeometry) => {
    const typedColorArray = new Float32Array(geometry.getAttribute('position').count * 4).map(() => 1);
    geometry.setAttribute('color', new BufferAttribute(typedColorArray, 4));

    // eslint-disable-next-line no-console
    console.error(
        `mesh '${geometry.name}' does not come with vertex colors assigned. Please assign rgba colors to all vertices, where .rgb always color specific vertices or faces (multiplied over texture), and .a masks custom coloring via app`,
    );
};
