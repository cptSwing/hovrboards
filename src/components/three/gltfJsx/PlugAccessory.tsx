import { FC, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { DB_AccessoryType, GLTFResult, SocketPosRot } from '../../../types/types';
import { Mesh, Object3D } from 'three';
import { MeshStandardMaterialProps } from '@react-three/fiber';

const PlugAccessory: FC<{ dbData: DB_AccessoryType; socket: SocketPosRot }> = ({ dbData, socket }) => {
    const { filePath, plugName, hexColor } = dbData;
    const [socketPosition, socketRotation] = socket;
    const { nodes } = useGLTF(filePath) as GLTFResult;

    const nodeMesh_Memo = useMemo(() => getFirstMesh(nodes), [nodes]);
    const { name, position, rotation, geometry, material } = nodeMesh_Memo;

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
