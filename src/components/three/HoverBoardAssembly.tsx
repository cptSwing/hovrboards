import { FC, useEffect, useRef, useState } from 'react';
import PlugAccessory from './PlugAccessory';
import useBoardConfiguration from '../../hooks/useBoardConfiguration';
import useBoardSockets from '../../hooks/useBoardSockets';

import { DB_BoardType, MeshMaterialArray } from '../../types/types';
import usePrepareMesh from '../../hooks/usePrepareMesh';

const HoverBoardAssembly: FC = () => {
    const { board, engine, hoverPads, ornaments } = useBoardConfiguration();
    const [boardMesh, boardSockets] = usePrepareMesh(board.filePath);
    const socketTransforms = useBoardSockets(boardSockets);

    // TODO on board switch, move old to left and new in from right. Copy this component, then unmount?
    const [groupPos, _setGroupPos] = useState([0, 0, 0] as [x: number, y: number, z: number]);
    // useEffect(() => {
    //     setGroupPos([-5, 0, 0]);
    //     const timer = setTimeout(() => {
    //         setGroupPos([0, 0, 0]);
    //     }, 200);
    // }, [board]);

    if (!socketTransforms) {
        return null;
    } else {
        const { engineTransform, hoverPadTransforms, ornamentTransforms } = socketTransforms;

        return (
            <group position={groupPos} rotation={[0, 0, 0]}>
                <Board dbData={board} mesh={boardMesh} />

                <PlugAccessory dbData={engine} socket={engineTransform} />

                {hoverPads.map((hoverPad, idx) => (
                    <PlugAccessory key={idx} dbData={hoverPad} socket={hoverPadTransforms[idx]} />
                ))}

                {ornaments.map((ornament, idx) => (
                    <PlugAccessory key={idx} dbData={ornament} socket={ornamentTransforms[idx]} />
                ))}
            </group>
        );
    }
};

export default HoverBoardAssembly;

const Board: FC<{ dbData: DB_BoardType; mesh: MeshMaterialArray }> = ({ dbData, mesh }) => {
    const meshRef = useRef<MeshMaterialArray | null>(null);

    const { name, position, geometry, material } = mesh;
    const { hexColor } = dbData;

    useEffect(() => {
        if (meshRef.current) {
            meshRef.current.material.forEach((mat) => mat.uniforms.u_customColor.value.set(hexColor));
        }
    }, [hexColor]);

    return (
        <group position={position} dispose={null}>
            <mesh ref={meshRef} name={name} castShadow receiveShadow geometry={geometry} material={material} />
        </group>
    );
};
