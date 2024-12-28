import { useGLTF } from '@react-three/drei';
import { FC, ReactNode, useEffect, useMemo, useRef, useState } from 'react';
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

    const socketPositions_Memo = useMemo(() => {
        let enginePos = new Vector3(0, 0, 0);
        let hoverPadsPos: { [key: string]: Vector3 }[] = [];
        let ornamentsPos: { [key: string]: Vector3 }[] = [];

        scene.traverse((obj) => {
            console.log('%c[HoverBoardAssembly]', 'color: #ae2cd1', `obj.name :`, obj.name);

            if (board.socketNames.engine === obj.name) {
                enginePos = obj.position;
            } else if (board.socketNames.hoverPads.includes(obj.name)) {
                hoverPadsPos.push({ [obj.name]: obj.position });
            } else if (board.socketNames.ornaments.includes(obj.name)) {
                ornamentsPos.push({ [obj.name]: obj.position });
            }
        });

        console.log('%c[HoverBoardAssembly]', 'color: #a7610c', `ornamentsPos,  :`, ornamentsPos);

        return {
            engine: enginePos,
            hoverPads: hoverPadsPos,
            ornaments: ornamentsPos,
        };
    }, [scene, board]);

    return (
        <primitive object={scene}>
            <AccessoryModel filePath={engine.filePath} socketPosition={socketPositions_Memo.engine} />

            {hoverPads.map((hoverPad, idx) => (
                <AccessoryModel key={hoverPad.id + idx} filePath={hoverPad.filePath} socketPosition={Object.values(socketPositions_Memo.hoverPads[idx])[0]} />
            ))}

            {ornaments.map((ornament, idx) => {
                return (
                    <AccessoryModel
                        key={ornament.id + idx}
                        filePath={ornament.filePath}
                        socketPosition={Object.values(socketPositions_Memo.hoverPads[idx])[0]}
                    />
                );
            })}
        </primitive>
    );
};

// TODO result from useGLTF will need to be duplicated with scene.clone() or by sharing geometry etc.. or displaying several per scene not possible
const nullTR = new Vector3(0, 0, 0);
const AccessoryModel = ({ filePath, socketPosition }: { filePath: string; socketPosition: Vector3 }) => {
    const { scene } = useGLTF(filePath);

    // useEffect(() => {
    //     scene.traverse((obj) => {
    //         obj.position.copy(nullTR);
    //         obj.rotation.set(nullTR.x, nullTR.y, nullTR.z);
    //     });
    // }, [scene]);

    console.log('%c[HoverBoardAssembly]', 'color: #058f93', `filePath, socketPosition :`, filePath, socketPosition);

    return <primitive object={scene} position={socketPosition} />;
};
