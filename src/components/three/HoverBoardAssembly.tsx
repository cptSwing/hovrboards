import { FC, useEffect, useRef } from 'react';
import PlugAccessory from './PlugAccessory';
import useBoardConfiguration from '../../hooks/useBoardConfiguration';
import useBoardSockets from '../../hooks/useBoardSockets';

import { DB_BoardType, MeshWithCustomMaterialArray } from '../../types/types';
import usePrepareMesh from '../../hooks/usePrepareMesh';
import useStageEnterExit from '../../hooks/useStageEnterExit';

const HoverBoardAssembly: FC = () => {
    const { board, engine, hoverPads, ornaments } = useBoardConfiguration();
    const [boardMesh, boardSockets] = usePrepareMesh(board.filePath);
    const socketTransforms = useBoardSockets(boardSockets);

    const groupPos = useStageEnterExit([0, 0, 0]);

    if (!socketTransforms) {
        return null;
    } else {
        const { engineTransform, hoverPadTransforms, ornamentTransforms } = socketTransforms;

        return (
            <group name='hoverBoardAssembly-group' position={groupPos} rotation={[0, 0, 0]}>
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

const Board: FC<{ dbData: DB_BoardType; mesh: MeshWithCustomMaterialArray }> = ({ dbData, mesh }) => {
    const meshRef = useRef<MeshWithCustomMaterialArray | null>(null);

    const { name, position, geometry, material } = mesh;
    const { hexColor } = dbData;

    useEffect(() => {
        if (meshRef.current) {
            meshRef.current.material.forEach((mat) => mat.uniforms.u_customColor.value.set(hexColor));
        }
    }, [hexColor]);

    return (
        <group position={position} name={`${name}-group`} dispose={null}>
            <mesh ref={meshRef} name={name} castShadow receiveShadow geometry={geometry} material={material} />
        </group>
    );
};
