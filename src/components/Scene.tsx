import { Canvas, useThree } from '@react-three/fiber';
import { Backdrop, Environment, Float, OrbitControls, PerspectiveCamera } from '@react-three/drei';
import HoverBoardAssembly from './three/HoverBoardAssembly';
import { Color } from 'three';
import { useZustand } from '../zustand';
import { useEffect } from 'react';

const Scene = () => {
    return (
        <Canvas shadows={true} gl={{ alpha: false, antialias: true }}>
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

            <axesHelper />

            <Background />
        </Canvas>
    );
};

// useGLTF.preload(filePath);

export default Scene;

const Background = () => {
    const { preset, isVisible, color, showBackdrop } = useZustand((state) => state.settings.background);
    const scene = useThree((state) => state.scene);

    useEffect(() => {
        scene.background = new Color(color);
    }, [scene, color]);

    return (
        <>
            <Backdrop position={[0, -0.1, 0]} scale={[2, 1, 1]} receiveShadow visible={showBackdrop}>
                <meshStandardMaterial color='#353540' />
            </Backdrop>

            <Environment preset={preset} background={isVisible} />
        </>
    );
};
