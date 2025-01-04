import { FC, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { DB_AccessoryType, GLTFResult } from '../../../types/types';
import { Euler, Vector3 } from 'three';
import { getFirstMesh, getFirstPlug } from './BoardChubber';

// useGLTF.preload('/gltf/hoverpad_fullcircle.glb');

const PlugAccessory: FC<{ accessory: DB_AccessoryType; socketPosition: Vector3; socketRotation: Euler }> = ({ accessory, socketPosition, socketRotation }) => {
    const { filePath, plugName } = accessory;
    const { nodes } = useGLTF(filePath) as GLTFResult;

    const [nodeMesh_Memo, plug_Memo] = useMemo(() => [getFirstMesh(nodes), getFirstPlug(nodes)], [nodes]);

    console.log('%c[HoverPadFullCircle]', 'color: #0dfe2f', `filePath,  plugName, nodes, socketPosition :`, filePath, plugName, nodes, socketPosition);

    return nodeMesh_Memo ? (
        <group
            dispose={null}
            name={plugName}
            position={socketPosition}
            rotation={plug_Memo.rotation}
            // position={ [ 0, 0, -0.1473 ] }
            // rotation={[-Math.PI / 2, 0, -Math.PI]}
        >
            <mesh
                name={`${plugName}_mesh`}
                castShadow
                receiveShadow
                geometry={nodeMesh_Memo.geometry}
                material={nodeMesh_Memo.material}
                position={nodeMesh_Memo.position}
                rotation={nodeMesh_Memo.rotation}
                // rotation={[-Math.PI / 2, 0, Math.PI]}
            />
        </group>
    ) : (
        <></>
    );
};

export default PlugAccessory;
