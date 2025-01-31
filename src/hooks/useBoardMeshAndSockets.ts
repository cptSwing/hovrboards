import { useGLTF } from '@react-three/drei';
import { DB_BoardType, GLTFResult, MeshMultipleMaterials, MeshSingleMaterial, SocketTransforms } from '../types/types';
import { Euler, Group, Mesh, Object3D, Quaternion, Vector3 } from 'three';
import { useMemo } from 'react';
import { useZustand } from '../zustand';
import { materialToArrayOfMaterials, mergeMultimaterialMesh, setCommonMaterialValues } from '../lib/threeHelpers';

const { store_setSocketTransforms } = useZustand.getState().methods;

const useBoardMeshAndSocket = (boardFilePath: DB_BoardType['filePath']) => {
    const { nodes } = useGLTF(boardFilePath) as GLTFResult;

    const boardAndSockets_Memo: (SocketTransforms & { boardMesh: Mesh }) | undefined = useMemo(() => {
        if (nodes) {
            const nodeValues = Object.values(nodes);
            const groupIndex = nodeValues.findIndex((node) => (node as Group).isGroup);

            let boardMesh: MeshMultipleMaterials | undefined;

            if (groupIndex > -1) {
                const mergedMesh = mergeMultimaterialMesh(
                    nodeValues[groupIndex].children.filter((child) => (child as Mesh).isMesh) as MeshSingleMaterial[],
                    nodeValues[groupIndex].name,
                );
                mergedMesh.material.forEach((mat) => setCommonMaterialValues(mat));
                boardMesh = mergedMesh;
            } else {
                const mesh = nodeValues.find((node) => node.name.includes('board_')) as Mesh | undefined;

                if (mesh) {
                    if (!Array.isArray(mesh.material)) {
                        setCommonMaterialValues(mesh.material);
                        boardMesh = materialToArrayOfMaterials(mesh as MeshSingleMaterial);
                    } else {
                        mesh.material.forEach((mat) => setCommonMaterialValues(mat));
                        boardMesh = mesh as MeshMultipleMaterials;
                    }
                }
            }

            if (boardMesh) {
                const engineTemp: (Vector3 | Euler)[] = [];
                const hoverPadSocketsTemp: [string, Vector3, Euler][] = [];
                const ornamentSocketsTemp: [string, Vector3, Euler][] = [];

                const traverseRoot = groupIndex > -1 ? nodeValues[groupIndex] : boardMesh;

                traverseRoot.traverse((node) => {
                    if (node.name.includes('socket_')) {
                        if (node.name.includes('engine')) {
                            engineTemp.push(node.position, node.rotation);
                        }

                        if (node.name.includes('hoverpad')) {
                            hoverPadSocketsTemp.push([node.name, node.position, node.rotation]);
                        }

                        if (node.name.includes('ornament')) {
                            ornamentSocketsTemp.push([node.name, node.position, node.rotation]);
                        }
                    }
                });

                hoverPadSocketsTemp.sort(([aName], [bName]) => (aName < bName ? -1 : aName > bName ? 1 : 0));
                ornamentSocketsTemp.sort(([aName], [bName]) => (aName < bName ? -1 : aName > bName ? 1 : 0));

                const engineTransform = engineTemp as [Vector3, Euler];
                store_setSocketTransforms('engine', ...engineTransform);

                const hoverPadTransforms: [Vector3, Euler][] = hoverPadSocketsTemp.map(([_, vec3, euler], idx) => {
                    store_setSocketTransforms('hoverPads', vec3, euler, idx);
                    return [vec3, euler];
                });
                const ornamentTransforms: [Vector3, Euler][] = ornamentSocketsTemp.map(([_, vec3, euler], idx) => {
                    store_setSocketTransforms('ornaments', vec3, euler, idx);
                    return [vec3, euler];
                });

                if (engineTransform.length && hoverPadTransforms.length && ornamentTransforms.length) {
                    return {
                        boardMesh,
                        engineTransform,
                        hoverPadTransforms,
                        ornamentTransforms,
                    };
                }
            }
        }
    }, [nodes]);

    return boardAndSockets_Memo;
};

export default useBoardMeshAndSocket;

const _localToWorld = (quat: Quaternion, object: Object3D, target?: Quaternion) => {
    return quat.premultiply(object.getWorldQuaternion(target ?? new Quaternion()));
};
