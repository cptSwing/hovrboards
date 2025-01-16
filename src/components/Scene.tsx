import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Backdrop, Environment, Float, PerspectiveCamera } from '@react-three/drei';
import { PerspectiveCamera as PerspectiveCameraImpl } from 'three';

import HoverBoardAssembly from './three/HoverBoardAssembly';
import { Color, Vector3 } from 'three';
import { useZustand } from '../zustand';
import { useEffect, useRef } from 'react';

const lookAtSceneRoot = new Vector3(0, 0, 0);

const Scene = () => {
    return (
        <Canvas shadows={true} gl={{ alpha: false, antialias: true }}>
            <Camera />

            <Float speed={10} rotationIntensity={0} floatIntensity={1} floatingRange={[-0.01, 0.01]}>
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

const Camera = () => {
    const cameraPosition = useZustand((store) => store.scene.cameraPosition);
    const cameraRef = useRef<PerspectiveCameraImpl | null>(null);

    useFrame(() => {
        if (cameraRef.current) {
            if (cameraRef.current.position.distanceToSquared(cameraPosition) > 0.00001) {
                cameraRef.current.position.lerp(cameraPosition, 0.1);
                cameraRef.current.lookAt(lookAtSceneRoot);
            }
        }
    });

    return <PerspectiveCamera ref={cameraRef} name='defaultCamera' makeDefault />;
};

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
