import { Canvas } from '@react-three/fiber';
import { Backdrop, Bounds, Environment, Float, OrbitControls } from '@react-three/drei';
import LoadBoard from './three/LoadBoard';
import { useZustand } from '../zustand';

const tempBoards = ['/gltf/Hovr_1.glb', '/gltf/Hovr_2.glb'];

const Scene = () => {
    const selectedBoard = useZustand((state) => state.options.board);

    return (
        <Canvas shadows={true}>
            <OrbitControls />
            <Float
                speed={1} // Animation speed, defaults to 1
                rotationIntensity={0} // XYZ rotation intensity, defaults to 1
                floatIntensity={1} // Up/down float intensity, works like a multiplier with floatingRange,defaults to 1
                floatingRange={[0, 0.2]} // Range of y-axis values the object will float within, defaults to [-0.1,0.1]
            >
                {/* <Bounds> */}
                <LoadBoard board={tempBoards[selectedBoard]} />
                {/* </Bounds> */}
            </Float>

            <Backdrop receiveShadow position={[0, -0.1, 0]}>
                <meshStandardMaterial color='#353540' />
            </Backdrop>
            <Environment preset='city' background />
        </Canvas>
    );
};

export default Scene;
