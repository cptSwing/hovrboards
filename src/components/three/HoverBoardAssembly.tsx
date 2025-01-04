import { FC, useRef, useState } from 'react';
import { MathUtils } from 'three';
import BoardChubber from './gltfJsx/BoardChubber';
import PlugAccessory from './gltfJsx/PlugAccessory';
import useBoardConfiguration from '../../hooks/useBoardConfiguration';
import { SocketTransforms } from '../../types/types';

const HoverBoardAssembly: FC<{}> = ({}) => {
    const socketPos_Ref = useRef<SocketTransforms | null>(null);
    const { board, engine, hoverPads, ornaments } = useBoardConfiguration();

    console.log('%c[HoverBoardAssembly]', 'color: #5aff4d', `board, engine, hoverPads, ornaments :`, board, engine, hoverPads, ornaments);

    const [groupPos, setGroupPos] = useState([0, 0, 0] as [x: number, y: number, z: number]);
    // useEffect(() => {
    //     setGroupPos([-5, 0, 0]);
    //     const timer = setTimeout(() => {
    //         setGroupPos([0, 0, 0]);
    //     }, 200);
    // }, [board]);

    return (
        <group position={groupPos} rotation={[0, MathUtils.degToRad(90), 0]}>
            <BoardChubber ref={socketPos_Ref} />

            {socketPos_Ref.current && (
                <>
                    <PlugAccessory accessory={engine} socketPosition={socketPos_Ref.current.engine[0]} socketRotation={socketPos_Ref.current.engine[1]} />

                    {hoverPads.map((hoverPad, idx) => {
                        const socketPosition = socketPos_Ref.current.hoverPads[idx][0];
                        const socketRotation = socketPos_Ref.current.hoverPads[idx][1];

                        return <PlugAccessory key={hoverPad.id + idx} accessory={hoverPad} socketPosition={socketPosition} socketRotation={socketRotation} />;
                    })}

                    {ornaments.map((ornament, idx) => {
                        const socketPosition = socketPos_Ref.current.ornaments[idx][0];
                        const socketRotation = socketPos_Ref.current.ornaments[idx][1];

                        return <PlugAccessory key={ornament.id + idx} accessory={ornament} socketPosition={socketPosition} socketRotation={socketRotation} />;
                    })}
                </>
            )}
        </group>
    );
};

export default HoverBoardAssembly;
