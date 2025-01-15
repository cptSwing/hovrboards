import { FC, useState } from 'react';
import { MathUtils, Mesh } from 'three';
import PlugAccessory from './gltfJsx/PlugAccessory';
import useBoardConfiguration from '../../hooks/useBoardConfiguration';
import useBoardMeshAndSocket from '../../hooks/useBoardMeshAndSockets';
import { MeshStandardMaterialProps } from '@react-three/fiber';
import { DB_BoardType } from '../../types/types';

const HoverBoardAssembly: FC = () => {
    const { board, engine, hoverPads, ornaments } = useBoardConfiguration();
    const meshAndSockets = useBoardMeshAndSocket(board.filePath);

    // TODO on board switch, move old to left and new in from right. Copy this component, then unmount?
    const [groupPos, _setGroupPos] = useState([0, 0, 0] as [x: number, y: number, z: number]);
    // useEffect(() => {
    //     setGroupPos([-5, 0, 0]);
    //     const timer = setTimeout(() => {
    //         setGroupPos([0, 0, 0]);
    //     }, 200);
    // }, [board]);

    if (!meshAndSockets) {
        return null;
    } else {
        const { boardMesh, engineTransform, hoverPadTransforms, ornamentTransforms } = meshAndSockets;

        return (
            <group position={groupPos} rotation={[0, MathUtils.degToRad(90), 0]}>
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

const Board: FC<{ dbData: DB_BoardType; mesh: Mesh }> = ({ dbData, mesh }) => {
    const { name, position, geometry, material } = mesh;
    const { hexColor } = dbData;

    return (
        <group position={position} dispose={null}>
            <mesh name={name} castShadow receiveShadow geometry={geometry}>
                <meshStandardMaterial {...(material as MeshStandardMaterialProps)} color={hexColor} />
            </mesh>
        </group>
    );
};
