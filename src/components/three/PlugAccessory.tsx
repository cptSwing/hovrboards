import { FC, useEffect, useMemo, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { DB_CommonType, GLTFResult, MeshMultipleMaterials, MeshSingleMaterial, SocketPosRot } from '../../types/types';
import { BufferGeometry, Camera, Group, Material, Mesh, Object3D, Scene, WebGLRenderer } from 'three';
import { mergeBufferGeometries } from 'three-stdlib';
import { useThree } from '@react-three/fiber';

const PlugAccessory: FC<{ dbData: DB_CommonType; socket: SocketPosRot }> = ({ dbData, socket }) => {
    const { filePath, hexColor } = dbData;
    const [socketPosition, socketRotation] = socket;
    const { nodes } = useGLTF(filePath) as GLTFResult;

    const meshRef = useRef<MeshMultipleMaterials | null>(null);

    const nodeMesh_Memo = useMemo(() => {
        const nodeValues = Object.values(nodes);
        const groupIndex = nodeValues.findIndex((node) => (node as Group).isGroup);

        if (groupIndex > -1) {
            const mergedMesh = mergeMultimaterialMesh(nodeValues[groupIndex].children as MeshSingleMaterial[], nodeValues[groupIndex].name);
            mergedMesh.material.forEach((mat) => setCommonMaterialValues(mat));

            return mergedMesh;
        } else {
            const firstMeshNode = getFirstMesh(nodes);

            if (!Array.isArray(firstMeshNode.material)) {
                setCommonMaterialValues(firstMeshNode.material);
                return materialToArrayOfMaterials(firstMeshNode as MeshSingleMaterial);
            } else {
                firstMeshNode.material.forEach((mat) => setCommonMaterialValues(mat));
                return firstMeshNode;
            }
        }
    }, [nodes]);

    const { name, position, rotation, material, geometry } = nodeMesh_Memo;

    console.log('%c[PlugAccessory]', 'color: #a15ee5', `nodeMesh_Memo :`, nodeMesh_Memo);

    useEffect(() => {
        if (meshRef.current) {
            meshRef.current.material.forEach((mat) => mat.color.set(hexColor));
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

const useVertexColors = true;
const mergeMultimaterialMesh = (meshes: MeshSingleMaterial[], name: string) => {
    const geoAndMatCollection = {
        geometries: [],
        materials: [],
    } as { geometries: BufferGeometry[]; materials: Material[] };

    meshes.forEach(({ geometry, material }) => {
        geoAndMatCollection.geometries.push(geometry);
        geoAndMatCollection.materials.push(material);
    });

    const mergedGeometries = mergeBufferGeometries(geoAndMatCollection.geometries, true);

    const newMesh = new Mesh(mergedGeometries ?? new BufferGeometry(), geoAndMatCollection.materials);
    newMesh.name = name;
    return newMesh as MeshMultipleMaterials;
};

const materialToArrayOfMaterials = (mesh: MeshSingleMaterial) => {
    const tempMat = mesh.material;
    const materialArray = [tempMat];

    const multiMatMesh = mesh as unknown as MeshMultipleMaterials;
    multiMatMesh.material = materialArray;

    const geo = multiMatMesh.geometry;
    const count = geo.index ? geo.index.count : geo.getAttribute('position').count;
    multiMatMesh.geometry.addGroup(0, count, 0);

    return multiMatMesh;
};

const setCommonMaterialValues = (material: Material) => {
    if (useVertexColors) {
        material.vertexColors = true;

        material.onBeforeCompile = (shader) => {
            shader.fragmentShader = shader.fragmentShader.replace(
                'vec4 diffuseColor = vec4( diffuse, opacity );',
                'vec4 diffuseColor = vec4(mix(diffuse, vColor.rgb, vColor.r), opacity );',
            );

            shader.fragmentShader = shader.fragmentShader.replace('#include <color_fragment>', '');
        };
    }
};

const getFirstMesh = (nodes: GLTFResult['nodes']) => Object.values(nodes).find((node) => (node as Mesh).isMesh) as MeshSingleMaterial | MeshMultipleMaterials;
const _getFirstPlug = (nodes: GLTFResult['nodes']) => Object.values(nodes).find((node) => node.name.includes('plug_')) as Object3D;
