/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three';
import React, { useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { GLTF } from 'three-stdlib';

type GLTFResult = GLTF & {
    nodes: {
        hoverpad_pow: THREE.Mesh;
    };
    materials: {};
};

export function HoverPadPow(props: JSX.IntrinsicElements['group']) {
    const { nodes, materials } = useGLTF('/gltf/hoverpad_pow.glb') as GLTFResult;
    return (
        <group {...props} dispose={null}>
            <group name='plug_hoverpad' position={[0, 0, -0.1473]} rotation={[-Math.PI / 2, 0, -Math.PI]}>
                <mesh
                    name='hoverpad_pow'
                    castShadow
                    receiveShadow
                    geometry={nodes.hoverpad_pow.geometry}
                    material={nodes.hoverpad_pow.material}
                    rotation={[-Math.PI / 2, 0, Math.PI]}
                />
            </group>
        </group>
    );
}

useGLTF.preload('/gltf/hoverpad_pow.glb');
