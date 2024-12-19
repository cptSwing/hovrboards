import { useGLTF } from '@react-three/drei';
import { FC, ReactNode, useRef, useState } from 'react';
import { Group, Mesh, Object3DEventMap, Vector3 } from 'three';
import useAssembleBoard from '../../hooks/useAssembleBoard';
import { DB_BoardType } from '../../types/types';

const HoverBoardAssembly: FC<{}> = ({}) => {
    const boardRef = useRef<Group<Object3DEventMap> | null>(null);

    const [groupPos, setGroupPos] = useState([0, 0, 0] as [x: number, y: number, z: number]);
    // useEffect(() => {
    //     setGroupPos([-5, 0, 0]);
    //     const timer = setTimeout(() => {
    //         setGroupPos([0, 0, 0]);
    //     }, 200);
    // }, [board]);

    return (
        <group position={groupPos}>
            <BoardModel></BoardModel>
        </group>
    );
};

export default HoverBoardAssembly;

const BoardModel = () => {
    const { board, engine, hoverPads, ornaments } = useAssembleBoard();

    const { scene } = useGLTF(board.filePath);
    let enginePos = new Vector3(0, 0, 0);
    scene.traverse((obj) => {
        if (obj.name === board.socketNames.engine) {
            enginePos = obj.position;
        }
    });

    return (
        <primitive object={scene}>
            <AccessoryModel filePath={engine.filePath} socketPosition={enginePos} />

            {hoverPads.map((hoverPad, idx) => (
                <AccessoryModel key={hoverPad.id + idx} filePath={hoverPad.filePath} socketPosition={enginePos} />
            ))}

            {ornaments.map((ornament, idx) => (
                <AccessoryModel key={ornament.id + idx} filePath={ornament.filePath} socketPosition={enginePos} />
            ))}
        </primitive>
    );
};

const AccessoryModel = ({ filePath, socketPosition }: { filePath: string; socketPosition: Vector3 }) => {
    const { scene } = useGLTF(filePath);
    console.log('%c[HoverBoardAssembly]', 'color: #339e5a', `scene :`, scene);

    // return meshObject ? <primitive object={meshObject} /> : null;
    return <primitive object={scene} position={socketPosition} />;
};
