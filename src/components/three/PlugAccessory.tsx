import { FC, useEffect, useRef } from 'react';
import { DB_CommonType, MeshWithCustomMaterialArray, SocketPosRot } from '../../types/types';
import usePrepareMesh from '../../hooks/usePrepareMesh';
import { Euler, Vector3 } from 'three';

const nullVector = new Vector3(0, 0, 0);
const nullEuler = new Euler(0, 0, 0);

const PlugAccessory: FC<{ dbData: DB_CommonType; socket: SocketPosRot }> = ({ dbData, socket }) => {
    const { filePath, hexColor } = dbData;
    const [socketPosition, socketRotation] = socket ?? [nullVector, nullEuler];

    const [accessoryMesh_Memo] = usePrepareMesh(filePath);

    const { name, position, rotation, material, geometry } = accessoryMesh_Memo;

    const meshRef = useRef<MeshWithCustomMaterialArray | null>(null);

    useEffect(() => {
        if (meshRef.current) {
            meshRef.current.material.forEach((mat) => {
                mat.uniforms.u_customColor.value.set(hexColor);
            });
        }
    }, [hexColor]);

    return accessoryMesh_Memo ? (
        <group dispose={null} name={`${name}-group`} position={socketPosition} rotation={socketRotation}>
            <mesh ref={meshRef} name={name} castShadow receiveShadow geometry={geometry} position={position} rotation={rotation} material={material} />
        </group>
    ) : (
        <></>
    );
};

export default PlugAccessory;
