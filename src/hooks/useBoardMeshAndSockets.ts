import { useGLTF } from '@react-three/drei';
import { DB_BoardType, GLTFResult, SocketTransforms } from '../types/types';
import { Euler, Mesh, Object3D, Quaternion, Vector3 } from 'three';
import { useMemo } from 'react';
import { useZustand } from '../zustand';

const { store_setSocketTransforms } = useZustand.getState().methods;

const useBoardMeshAndSocket = (boardFilePath: DB_BoardType['filePath']) => {
    const { nodes } = useGLTF(boardFilePath) as GLTFResult;

    const boardAndSockets_Memo: (SocketTransforms & { boardMesh: Mesh }) | undefined = useMemo(() => {
        if (nodes) {
            const boardMesh = Object.values(nodes).find((node) => node.name.includes('board_')) as Mesh | undefined;

            if (boardMesh) {
                const engineTemp: (Vector3 | Euler)[] = [];
                const hoverPadSocketsTemp: [string, Vector3, Euler][] = [];
                const ornamentSocketsTemp: [string, Vector3, Euler][] = [];

                boardMesh.traverse((node) => {
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
