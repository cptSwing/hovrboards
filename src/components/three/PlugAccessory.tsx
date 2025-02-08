import { FC, useEffect, useRef } from 'react';
import { DB_CommonType, MeshMaterialArray, SocketPosRot } from '../../types/types';
import usePrepareMesh from '../../hooks/usePrepareMesh';

const PlugAccessory: FC<{ dbData: DB_CommonType; socket: SocketPosRot }> = ({ dbData, socket }) => {
    const { filePath, hexColor } = dbData;
    const [socketPosition, socketRotation] = socket;

    const [accessoryMesh_Memo] = usePrepareMesh(filePath);
    const { name, position, rotation, material, geometry } = accessoryMesh_Memo;

    const meshRef = useRef<MeshMaterialArray | null>(null);

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
