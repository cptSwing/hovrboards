import { FC, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { DB_AccessoryType, GLTFResult, SocketPosRot } from '../../../types/types';
import { Mesh, Object3D } from 'three';

const PlugAccessory: FC<{ accessory: DB_AccessoryType; socket: SocketPosRot }> = ({ accessory, socket }) => {
    const { filePath, plugName } = accessory;
    const [socketPosition, socketRotation] = socket;
    const { nodes } = useGLTF(filePath) as GLTFResult;

    const _test = 1;

    const nodeMesh_Memo = useMemo(() => getFirstMesh(nodes), [nodes]);

    return nodeMesh_Memo ? (
        <group dispose={null} name={plugName} position={socketPosition} rotation={socketRotation}>
            <mesh
                name={`${plugName}_mesh`}
                castShadow
                receiveShadow
                geometry={nodeMesh_Memo.geometry}
                material={nodeMesh_Memo.material}
                position={nodeMesh_Memo.position}
                rotation={nodeMesh_Memo.rotation}
            />
        </group>
    ) : (
        <></>
    );
};

console.log('%c[PlugAccessory]', 'color: #f69ac9', `ldkdd :`);

export default PlugAccessory;

const getFirstMesh = (nodes: GLTFResult['nodes']) => Object.values(nodes).find((node) => (node as Mesh).isMesh) as Mesh;
const _getFirstPlug = (nodes: GLTFResult['nodes']) => Object.values(nodes).find((node) => node.name.includes('plug_')) as Object3D;
