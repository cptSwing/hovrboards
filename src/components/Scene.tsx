import { Canvas } from '@react-three/fiber';
import { Backdrop, Environment, Float, OrbitControls, PerspectiveCamera } from '@react-three/drei';
import HoverBoardAssembly from './three/HoverBoardAssembly';
import { Color } from 'three';

const Scene = () => {
    return (
        <Canvas
            shadows={true}
            color='gray'
            gl={{ alpha: false, antialias: true }}
            onCreated={({ scene }) => {
                scene.background = new Color('gray');
            }}
        >
            <PerspectiveCamera name='defaultCamera' makeDefault position={[0.5, 0.5, 1]} />
            <OrbitControls />
            <Float
                speed={10} // Animation speed, defaults to 1
                rotationIntensity={0} // XYZ rotation intensity, defaults to 1
                floatIntensity={1} // Up/down float intensity, works like a multiplier with floatingRange,defaults to 1
                floatingRange={[0.1, 0.125]} // Range of y-axis values the object will float within, defaults to [-0.1,0.1]
            >
                <HoverBoardAssembly />
            </Float>

            <directionalLight castShadow position={[-1, 1, 1]} />
            <Backdrop position={[0, -0.1, 0]} scale={[2, 1, 1]} receiveShadow>
                <meshStandardMaterial color='#353540' />
            </Backdrop>

            <axesHelper />

            <Environment preset='city' />
        </Canvas>
    );
};

export default Scene;
