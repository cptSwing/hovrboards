import { FC, useEffect, useMemo, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { DB_CommonType, GLTFResult, MeshMultipleMaterials, MeshSingleMaterial, SocketPosRot } from '../../types/types';
import { getFirstMesh, materialToArrayOfMaterials, mergeMultimaterialMesh, setCommonMaterialValues } from '../../lib/threeHelpers';
import { BufferAttribute, Group } from 'three';

const PlugAccessory: FC<{ dbData: DB_CommonType; socket: SocketPosRot }> = ({ dbData, socket }) => {
    const { filePath, hexColor } = dbData;
    const [socketPosition, socketRotation] = socket;
    const { nodes } = useGLTF(filePath) as GLTFResult;

    const meshRef = useRef<MeshMultipleMaterials | null>(null);

    const nodeMesh_Memo = useMemo(() => {
        const nodeValues = Object.values(nodes);
        const groupIndex = nodeValues.findIndex((node) => (node as Group).isGroup);

        let mesh: MeshMultipleMaterials;

        if (groupIndex > -1) {
            const mergedMesh = mergeMultimaterialMesh(nodeValues[groupIndex].children as MeshSingleMaterial[], nodeValues[groupIndex].name);
            mergedMesh.material = mergedMesh.material.map((mat) => setCommonMaterialValues(mat));

            mesh = mergedMesh;
        } else {
            const firstMeshNode = getFirstMesh(nodes);

            if (!Array.isArray(firstMeshNode.material)) {
                firstMeshNode.material = setCommonMaterialValues(firstMeshNode.material);
                mesh = materialToArrayOfMaterials(firstMeshNode as MeshSingleMaterial);
            } else {
                firstMeshNode.material = firstMeshNode.material.map((mat) => setCommonMaterialValues(mat));
                mesh = firstMeshNode as MeshMultipleMaterials;
            }
        }

        //WARN for meshes w/o exported vertex colors
        if (!mesh.geometry.getAttribute('color')) {
            const typedColorArray = new Float32Array(mesh.geometry.getAttribute('position').count * 4).map(() => 1);
            mesh.geometry.setAttribute('color', new BufferAttribute(typedColorArray, 4));
        }

        return mesh;
    }, [nodes]);

    const { name, position, rotation, material, geometry } = nodeMesh_Memo;
    console.log('%c[PlugAccessory]', 'color: #4e7cce', `geometry :`, geometry);

    useEffect(() => {
        if (meshRef.current) {
            meshRef.current.material.forEach((mat) => {
                mat.uniforms.u_customColor.value.set(hexColor);
                mat.uniforms.u_customColor.needsUpdate = true;
            });
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
