import { useGLTF } from '@react-three/drei';
import { MeshMaterialArray, MeshSingleMaterial } from '../types/types';
import { BufferAttribute, Group, Mesh, Object3D } from 'three';
import { getFirstMesh, materialToArrayOfMaterials, mergeToMultimaterialMesh, setCommonMaterialValues } from '../lib/threeHelpers';
import { useMemo } from 'react';

const usePrepareMesh = (filePath: string) => {
    const nodes = useGLTF(filePath).nodes;
    const nodeValues_Memo = useMemo(() => Object.values(nodes), [nodes]);

    const meshMaterialArray_Memo = useMemo(() => {
        const groupIndex = nodeValues_Memo.findIndex((node) => (node as Group).isGroup);
        const isSplitByMaterials = groupIndex > -1;

        let meshMatArray: MeshMaterialArray;

        if (isSplitByMaterials) {
            meshMatArray = mergeToMultimaterialMesh(
                nodeValues_Memo[groupIndex].children.filter((child) => (child as Mesh).isMesh) as MeshSingleMaterial[],
                nodeValues_Memo[groupIndex].name,
            );
        } else {
            const firstMeshNode = getFirstMesh(nodeValues_Memo);

            if (!Array.isArray(firstMeshNode.material)) {
                meshMatArray = materialToArrayOfMaterials(firstMeshNode);
            } else {
                meshMatArray = firstMeshNode as MeshMaterialArray;
            }
        }

        meshMatArray.material = meshMatArray.material.map((mat) => setCommonMaterialValues(mat));

        //WARN for meshes w/o exported vertex colors
        if (!meshMatArray.geometry.getAttribute('color')) {
            const typedColorArray = new Float32Array(meshMatArray.geometry.getAttribute('position').count * 4).map(() => 1);
            meshMatArray.geometry.setAttribute('color', new BufferAttribute(typedColorArray, 4));
        }

        return meshMatArray;
    }, [nodeValues_Memo]);

    const sockets_Memo = useMemo(() => nodeValues_Memo.filter((node) => node.name.includes('socket_')), [nodeValues_Memo]);

    return [meshMaterialArray_Memo, sockets_Memo] as [MeshMaterialArray, Object3D[]];
};

export default usePrepareMesh;
