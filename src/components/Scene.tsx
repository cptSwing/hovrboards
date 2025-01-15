import { Canvas, useThree } from '@react-three/fiber';
import { Backdrop, Environment, Float, PerspectiveCamera } from '@react-three/drei';
import HoverBoardAssembly from './three/HoverBoardAssembly';
import { Color, Vector3 } from 'three';
import { useZustand } from '../zustand';
import { useEffect } from 'react';

const lookAtSceneRoot = new Vector3(0, 0, 0);

const Scene = () => {
    const cameraPosition = useZustand((store) => store.scene.cameraFocus);

    return (
        <Canvas shadows={true} gl={{ alpha: false, antialias: true }}>
            <PerspectiveCamera
                name='defaultCamera'
                makeDefault
                position={cameraPosition}
                onUpdate={(self) => {
                    self.lookAt(lookAtSceneRoot);
                }}
            />

            <Float
                speed={10} // Animation speed, defaults to 1
                rotationIntensity={0} // XYZ rotation intensity, defaults to 1
                floatIntensity={1} // Up/down float intensity, works like a multiplier with floatingRange,defaults to 1
                floatingRange={[-0.01, 0.01]} // Range of y-axis values the object will float within, defaults to [-0.1,0.1]
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
