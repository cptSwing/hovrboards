import { useGLTF } from '@react-three/drei';
import { FC, useEffect, useRef, useState } from 'react';
import { Group, Mesh, Object3DEventMap } from 'three';
import useAssembleBoard from '../../hooks/useAssembleBoard';

const HoverBoardAssembly: FC<{}> = ({}) => {
    const boardRef = useRef<Group<Object3DEventMap> | null>(null);

    const { board, engine, hoverPads, ornaments } = useAssembleBoard();
    useEffect(() => {
        console.log('%c[HoverBoardAssembly]', 'color: #fb1613', `board, engine, hoverPads, ornaments :`, board, engine, hoverPads, ornaments);
    }, [board, engine, hoverPads, ornaments]);

    const [groupPos, setGroupPos] = useState([0, 0, 0] as [x: number, y: number, z: number]);
    // useEffect(() => {
    //     setGroupPos([-5, 0, 0]);
    //     const timer = setTimeout(() => {
    //         setGroupPos([0, 0, 0]);
    //     }, 200);
    // }, [board]);

    return (
        <group position={groupPos}>
            <BoardModel filePath={board.filePath} />
            <AccessoryModel filePath={engine.filePath} />
            {hoverPads.map((hoverPad, idx) => (
                <AccessoryModel key={hoverPad.id + idx} filePath={hoverPad.filePath} />
            ))}
            {ornaments.map((ornament, idx) => (
                <AccessoryModel key={ornament.id + idx} filePath={ornament.filePath} />
            ))}
        </group>
    );
};

export default HoverBoardAssembly;

const BoardModel = ({ filePath }: { filePath: string }) => {
    const { scene } = useGLTF(filePath);

    return <primitive object={scene} />;
};

const AccessoryModel = ({ filePath }: { filePath: string }) => {
    const { scene } = useGLTF(filePath);

    let meshObject;

    scene.traverse((obj) => {
        if ((obj as Mesh).isMesh) {
            meshObject = obj;
            return;
        }
    });

    // return meshObject ? <primitive object={meshObject} /> : null;
    return <primitive object={scene} />;
};
