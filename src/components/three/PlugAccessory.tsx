import { FC, useEffect, useMemo, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { DB_CommonType, GLTFResult, MeshMultipleMaterials, MeshSingleMaterial, SocketPosRot } from '../../types/types';
import { getFirstMesh, materialToArrayOfMaterials, mergeMultimaterialMesh, setCommonMaterialValues } from '../../lib/threeHelpers';
import { Group } from 'three';

const PlugAccessory: FC<{ dbData: DB_CommonType; socket: SocketPosRot }> = ({ dbData, socket }) => {
    const { filePath, hexColor } = dbData;
    const [socketPosition, socketRotation] = socket;
    const { nodes } = useGLTF(filePath) as GLTFResult;

    const meshRef = useRef<MeshMultipleMaterials | null>(null);

    const nodeMesh_Memo = useMemo(() => {
        const nodeValues = Object.values(nodes);
        const groupIndex = nodeValues.findIndex((node) => (node as Group).isGroup);

        if (groupIndex > -1) {
            const mergedMesh = mergeMultimaterialMesh(nodeValues[groupIndex].children as MeshSingleMaterial[], nodeValues[groupIndex].name);
            mergedMesh.material.forEach((mat) => setCommonMaterialValues(mat));

            return mergedMesh;
        } else {
            const firstMeshNode = getFirstMesh(nodes);

            if (!Array.isArray(firstMeshNode.material)) {
                setCommonMaterialValues(firstMeshNode.material);
                return materialToArrayOfMaterials(firstMeshNode as MeshSingleMaterial);
            } else {
                firstMeshNode.material.forEach((mat) => setCommonMaterialValues(mat));
                return firstMeshNode as MeshMultipleMaterials;
            }
        }
    }, [nodes]);

    const { name, position, rotation, material, geometry } = nodeMesh_Memo;

    useEffect(() => {
        if (meshRef.current) {
            meshRef.current.material.forEach((mat) => mat.color.set(hexColor));
        }
    }, [hexColor]);

    return nodeMesh_Memo ? (
        <group dispose={null} name={`${name}-group`} position={socketPosition} rotation={socketRotation}>
            <mesh ref={meshRef} name={name} castShadow receiveShadow geometry={geometry} position={position} rotation={rotation} material={material} />
        </group>
    ) : (
        <></>
    );
};

export default PlugAccessory;
