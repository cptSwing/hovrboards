import { Gltf } from '@react-three/drei';
import { FC, useEffect, useRef, useState } from 'react';
import { Group, Object3DEventMap } from 'three';

const LoadBoard: FC<{ board: string }> = ({ board }) => {
    const boardRef = useRef<Group<Object3DEventMap> | null>(null);
    const [groupPos, setGroupPos] = useState([0, 0, 0] as [x: number, y: number, z: number]);

    useEffect(() => {
        setGroupPos([-5, 0, 0]);
        const timer = setTimeout(() => {
            setGroupPos([0, 0, 0]);
        }, 200);
    }, [board]);

    return (
        <group position={groupPos}>
            <Gltf ref={boardRef} src={board} />
            <Gltf src={'/gltf/Engine_1.glb'} />
        </group>
    );
};

export default LoadBoard;
