import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Backdrop, Environment, Float, PerspectiveCamera } from '@react-three/drei';
import { MathUtils, PlaneGeometry, Quaternion, RepeatWrapping, TextureLoader } from 'three';
import { Bloom, EffectComposer, FXAA } from '@react-three/postprocessing';
import HoverBoardAssembly from './three/HoverBoardAssembly';
import { Color, Vector3 } from 'three';
import { useZustand } from '../zustand';
import { Dispatch, FC, SetStateAction, useEffect, useMemo, useState } from 'react';
import { MovingStreakMaterial } from '../lib/materials/MovingStreakMaterial';
import ErrorBoundary from './ErrorBoundary';

const Scene = () => {
    return (
        <Canvas shadows={true} gl={{ alpha: false, antialias: false }}>
            <Camera />

            <Float speed={10} rotationIntensity={0} floatIntensity={1} floatingRange={[-0.01, 0.01]}>
                <HoverBoardAssembly />
            </Float>

            <directionalLight castShadow position={[-1, 1, 1]} />

            <axesHelper />

            <Background />

            <Streaks />

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

const textureLoader = new TextureLoader();
const streakTexture = await textureLoader.loadAsync('/textures/streak.jpg');
streakTexture.wrapS = RepeatWrapping;
streakTexture.wrapT = RepeatWrapping;
let elapsed = 0;

const Streaks = () => {
    useFrame(({ clock }) => {
        elapsed = clock.elapsedTime;
    });

    const geo_Memo = useMemo(() => new PlaneGeometry(0.25, 0.005), []);
    const mat_Memo = useMemo(() => new MovingStreakMaterial({ map: streakTexture }), []);

    return (
        <>
            {Array.from({ length: 5 }).map((_, idx) => (
                <mesh
                    key={idx}
                    geometry={geo_Memo}
                    material={mat_Memo}
                    position={[0.125, 0.1 * idx, 0.25 * (idx - 2)]}
                    rotation={[0, MathUtils.degToRad(-90), 0]}
                    onBeforeRender={(_renderer, _scene, _camera, _geometry, material) => {
                        (material as MovingStreakMaterial).uniforms.u_time.value = elapsed;
                    }}
                />
            ))}
        </>
    );
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

            <ErrorBoundary fallback={<></>}>
                <Environment preset={preset} background={isVisible} />
            </ErrorBoundary>
        </>
    );
};

const PostProcessing = () => {
    return (
        <EffectComposer>
            <FXAA />

            <Bloom luminanceThreshold={1.25} mipmapBlur radius={0.6} intensity={1} />

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
