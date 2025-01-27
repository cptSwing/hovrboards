import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Backdrop, Environment, Float, PerspectiveCamera } from '@react-three/drei';
import { MathUtils, Quaternion } from 'three';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import HoverBoardAssembly from './three/HoverBoardAssembly';
import { Color, Vector3 } from 'three';
import { useZustand } from '../zustand';
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';

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

            <PostProcessing />
            <Debug />
        </Canvas>
    );
};

// useGLTF.preload(filePath);

export default Scene;

const Camera = () => {
    const { position: finalPosition, lookAt: finalLookAt } = useZustand((store) => store.camera);
    const [hasChanged, setHasChanged] = useState(true);

    // Trigger CameraMotion mount on change of values
    useEffect(() => {
        setHasChanged(true);
    }, [finalPosition, finalLookAt]);

    return (
        <>
            <PerspectiveCamera name='defaultCamera' makeDefault filmGauge={100} filmOffset={10} />
            {hasChanged && <CameraMotion position={finalPosition} lookAt={finalLookAt} setHasChangedState={setHasChanged} />}
        </>
    );
};

const intermediateLookAt = new Vector3();
const squaredDistanceMax = 0.00001;

const CameraMotion: FC<{
    position: Vector3;
    lookAt: Vector3;
    setHasChangedState: Dispatch<SetStateAction<boolean>>;
}> = ({ position, lookAt, setHasChangedState }) => {
    const camera = useThree((state) => state.camera);
    const transitionSpeed = useZustand((state) => state.settings.camera.transitionSpeed);

    useFrame(() => {
        camera.position.lerp(position, transitionSpeed);
        intermediateLookAt.lerp(lookAt, transitionSpeed);
        camera.lookAt(intermediateLookAt);

        // Basically unmounts self to get rid of useFrame calls; distanceToSquared() seemingly most performant test (plus, vector.equals(vector2) never triggers due to rounding differences)
        if (camera.position.distanceToSquared(position) < squaredDistanceMax && intermediateLookAt.distanceToSquared(lookAt) < squaredDistanceMax) {
            setHasChangedState(false);
        }
    });

    return null;
};

const Background = () => {
    const { preset, isVisible, color, showBackdrop } = useZustand((state) => state.settings.background);
    const scene = useThree((state) => state.scene);

    useEffect(() => {
        scene.background = new Color(color);
    }, [scene, color]);

    return (
        <>
            <Backdrop position={[0, -0.1, 0]} rotation={[0, MathUtils.degToRad(-90), 0]} scale={[2, 1, 1]} receiveShadow visible={showBackdrop}>
                <meshStandardMaterial color='#353540' />
            </Backdrop>

            <Environment preset={preset} background={isVisible} />
        </>
    );
};

const PostProcessing = () => {
    return (
        <EffectComposer>
            <Bloom luminanceThreshold={1.1} mipmapBlur radius={0.6} intensity={1.5} />
            {/* <DepthOfField focusDistance={0} focalLength={0.02} bokehScale={2} height={480} /> */}
            {/* <Vignette eskil={false} offset={0.05} darkness={1.1} /> */}
        </EffectComposer>
    );
};

const Debug = () => {
    const { lookAt: cameraLookAt } = useZustand((store) => store.camera);

    return <axesHelper position={cameraLookAt} />;
};

const _getObjectLookAt = (distance: number, objQuaternion: Quaternion, objPosition: Vector3) =>
    new Vector3(0, 0, -distance).applyQuaternion(objQuaternion).add(objPosition);
