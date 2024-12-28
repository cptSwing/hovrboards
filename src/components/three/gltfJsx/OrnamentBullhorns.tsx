/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three';
import React, { useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { GLTF } from 'three-stdlib';

type GLTFResult = GLTF & {
    nodes: {
        ornament_bullhorns: THREE.Mesh;
    };
    materials: {};
};

export function Model(props: JSX.IntrinsicElements['group']) {
    const { nodes, materials } = useGLTF('/ornament_bullhorns.glb') as GLTFResult;
    return (
        <group {...props} dispose={null}>
            <group name='plug_ornament' position={[0, 0.0148807, 0.4499564]} rotation={[Math.PI / 2, 0, 0]}>
                <mesh
                    name='ornament_bullhorns'
                    castShadow
                    receiveShadow
                    geometry={nodes.ornament_bullhorns.geometry}
                    material={nodes.ornament_bullhorns.material}
                    position={[0, 0, 0]}
                    rotation={[-Math.PI / 2, 0, 0]}
                />
            </group>
        </group>
    );
}

useGLTF.preload('/ornament_bullhorns.glb');