import { FC, useEffect, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { DB_AccessoryType, GLTFResult, SocketPosRot, ZustandStore } from '../../types/types';
import { Mesh, Object3D } from 'three';
import { MeshStandardMaterialProps } from '@react-three/fiber';
import { useZustand } from '../../zustand';

const { store_setPositionVector } = useZustand.getState().methods;

const PlugAccessory: FC<{ dbData: DB_AccessoryType; socket: SocketPosRot; category: keyof ZustandStore['selected']; selectedPosition?: number }> = ({
    dbData,
    socket,
    category,
    selectedPosition,
}) => {
    const { filePath, plugName, hexColor } = dbData;
    const [socketPosition, socketRotation] = socket;
    const { nodes } = useGLTF(filePath) as GLTFResult;

    const nodeMesh_Memo = useMemo(() => getFirstMesh(nodes), [nodes]);
    const { name, position, rotation, geometry, material } = nodeMesh_Memo;

    // useEffect(() => {
    //     store_setPositionVector(category, socketPosition, selectedPosition);
    //     console.log('%c[PlugAccessory]', 'color: #554f8e', `category, socketPosition, selectedPosition :`, category, socketPosition, selectedPosition);
    // }, [category, socketPosition, selectedPosition]);

    return nodeMesh_Memo ? (
        <group dispose={null} name={plugName} position={socketPosition} rotation={socketRotation}>
            <mesh name={name} castShadow receiveShadow geometry={geometry} position={position} rotation={rotation}>
                <meshStandardMaterial {...(material as MeshStandardMaterialProps)} color={hexColor} />
            </mesh>
        </group>
    ) : (
        <></>
    );
};

export default PlugAccessory;

const getFirstMesh = (nodes: GLTFResult['nodes']) => Object.values(nodes).find((node) => (node as Mesh).isMesh) as Mesh;
const _getFirstPlug = (nodes: GLTFResult['nodes']) => Object.values(nodes).find((node) => node.name.includes('plug_')) as Object3D;
