import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Backdrop, Environment, Float, PerspectiveCamera } from '@react-three/drei';
import { MathUtils, PerspectiveCamera as PerspectiveCameraImpl, Quaternion } from 'three';

import HoverBoardAssembly from './three/HoverBoardAssembly';
import { Color, Vector3 } from 'three';
import { useZustand } from '../zustand';
import { Dispatch, FC, SetStateAction, useEffect, useRef, useState } from 'react';

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

            <Debug />
        </Canvas>
    );
};

// useGLTF.preload(filePath);

export default Scene;

const Camera = () => {
    const { position: finalPosition, lookAt: finalLookAt } = useZustand((store) => store.camera);
    const cameraRef = useRef<PerspectiveCameraImpl | null>(null);

    // Setting initial values for PerspectiveCamera once onMount here, afterwards setting them in CameraMotion
    useEffect(() => {
        if (cameraRef.current) {
            cameraRef.current.position.copy(finalPosition);
            cameraRef.current.lookAt(finalLookAt);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/exhaustive-deps
    }, []);

    const [hasChanged, setHasChanged] = useState(true);

    // Trigger CameraMotion mount on change of values
    useEffect(() => {
        setHasChanged(true);
    }, [finalPosition, finalLookAt]);

    return (
        <>
            <PerspectiveCamera ref={cameraRef} name='defaultCamera' makeDefault />
            {hasChanged && cameraRef.current && (
                <CameraMotion camera={cameraRef.current} position={finalPosition} lookAt={finalLookAt} setHasChangedState={setHasChanged} />
            )}
        </>
    );
};

const intermediateLookAt = new Vector3();
const squaredDistanceMax = 0.00001;
const lerpSpeed = 0.1;

const CameraMotion: FC<{
    camera: PerspectiveCameraImpl;
    position: Vector3;
    lookAt: Vector3;
    setHasChangedState: Dispatch<SetStateAction<boolean>>;
}> = ({ camera, position, lookAt, setHasChangedState }) => {
    useEffect(() => {
        return () => {
            intermediateLookAt.copy(lookAt);
        };
    }, [lookAt]);

    useFrame(() => {
        camera.position.lerp(position, lerpSpeed);
        intermediateLookAt.lerp(lookAt, lerpSpeed);
        camera.lookAt(intermediateLookAt);

        // Unmounts self to get rid of useFrame; distanceToSquared() most performant test (plus, vector.equals(vector2) never triggers due to rounding differences)
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

const Debug = () => {
    const { lookAt: cameraLookAt } = useZustand((store) => store.camera);

    return <axesHelper position={cameraLookAt} />;
};

const _getObjectLookAt = (distance: number, objQuaternion: Quaternion, objPosition: Vector3) =>
    new Vector3(0, 0, -distance).applyQuaternion(objQuaternion).add(objPosition);
