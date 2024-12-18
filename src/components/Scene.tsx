import { Canvas } from '@react-three/fiber';
import { Backdrop, Bounds, Environment, Float, OrbitControls } from '@react-three/drei';
import LoadBoard from './three/LoadBoard';
import { useZustand } from '../zustand';
import mockDb from '../mockApi/mockDb.json';
import { Color, MathUtils } from 'three';

const { Boards, Engines, HoverPads, Ornaments } = mockDb;

const Scene = () => {
    const selectedBoard = useZustand((store) => store.state.selected.board);

    return (
        <Canvas
            shadows={true}
            color='gray'
            gl={{ alpha: false, antialias: true }}
            onCreated={({ scene }) => {
                scene.background = new Color('gray');
            }}
        >
            <OrbitControls />
            <Bounds>
                <Float
                    speed={10} // Animation speed, defaults to 1
                    rotationIntensity={0} // XYZ rotation intensity, defaults to 1
                    floatIntensity={1} // Up/down float intensity, works like a multiplier with floatingRange,defaults to 1
                    floatingRange={[0.1, 0.125]} // Range of y-axis values the object will float within, defaults to [-0.1,0.1]
                >
                    <LoadBoard board={Boards[selectedBoard].filePath} />
                </Float>
            </Bounds>

            <Backdrop position={[0, -0.1, 0]} rotation={[0, MathUtils.degToRad(-90), 0]} scale={[2, 1, 1]} receiveShadow>
                <meshStandardMaterial color='#353540' />
            </Backdrop>
            <Environment preset='city' />
        </Canvas>
    );
};

export default Scene;
