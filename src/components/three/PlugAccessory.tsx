import { FC, useEffect, useMemo, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { DB_CommonType, GLTFResult, SocketPosRot } from '../../types/types';
import { BufferGeometry, Group, Material, Mesh, MeshStandardMaterial, Object3D } from 'three';
import { mergeBufferGeometries } from 'three-stdlib';

const PlugAccessory: FC<{ dbData: DB_CommonType; socket: SocketPosRot }> = ({ dbData, socket }) => {
    const { filePath, hexColor } = dbData;
    const [socketPosition, socketRotation] = socket;
    const { nodes } = useGLTF(filePath) as GLTFResult;

    const meshRef = useRef<Mesh<BufferGeometry, MeshStandardMaterial | MeshStandardMaterial[]> | null>(null);

    const nodeMesh_Memo = useMemo(() => {
        const nodeValues = Object.values(nodes);
        const groupIndex = nodeValues.findIndex((node) => (node as Group).isGroup);
        if (groupIndex > -1) {
            return mergeMultimaterialMesh(nodeValues[groupIndex].children as Mesh[], nodeValues[groupIndex].name);
        } else {
            return getFirstMesh(nodes);
        }
    }, [nodes]);

    const { name, position, rotation, material, geometry } = nodeMesh_Memo;

    useEffect(() => {
        if (meshRef.current) {
            if (Array.isArray(meshRef.current.material)) {
                meshRef.current.material.forEach((mat) => mat.color.set(hexColor));
            } else {
                meshRef.current.material.color.set(hexColor);
            }
        }
    }, [hexColor]);

    return nodeMesh_Memo ? (
        <group dispose={null} name={`${name}-group`} position={socketPosition} rotation={socketRotation}>
            <mesh ref={meshRef} name={name} castShadow receiveShadow geometry={geometry} position={position} rotation={rotation} material={material} />
        </group>
    ) : (
        <></>
    );
};

export default PlugAccessory;

const mergeMultimaterialMesh = (meshes: Mesh[], name: string) => {
    const geoAndMatCollection = {
        geometries: [],
        materials: [],
    } as { geometries: BufferGeometry[]; materials: Material[] };

    meshes.forEach(({ geometry, material }) => {
        geoAndMatCollection.geometries.push(geometry);
        geoAndMatCollection.materials.push(material as Material);
    });

    const mergedGeometries = mergeBufferGeometries(geoAndMatCollection.geometries, true);

    const newMesh = new Mesh(mergedGeometries ?? new BufferGeometry(), geoAndMatCollection.materials);
    newMesh.name = name;
    return newMesh;
};

const getFirstMesh = (nodes: GLTFResult['nodes']) => Object.values(nodes).find((node) => (node as Mesh).isMesh) as Mesh;
const _getFirstPlug = (nodes: GLTFResult['nodes']) => Object.values(nodes).find((node) => node.name.includes('plug_')) as Object3D;
