import { useGLTF } from '@react-three/drei';
import { DB_BoardType, GLTFResult, SocketTransforms } from '../types/types';
import { Euler, Mesh, Vector3 } from 'three';
import { useMemo } from 'react';

const useBoardMeshAndSocket = (boardFilePath: DB_BoardType['filePath']) => {
    const { nodes } = useGLTF(boardFilePath) as GLTFResult;

    const boardAndSockets_Memo: (SocketTransforms & { boardMesh: Mesh }) | undefined = useMemo(() => {
        if (nodes) {
            const boardMesh = Object.values(nodes).find((node) => node.name.includes('board_')) as Mesh | undefined;

            if (boardMesh) {
                const engineTemp: (Vector3 | Euler)[] = [];
                const hoverPadTemp: [string, Vector3, Euler][] = [];
                const ornamentTemp: [string, Vector3, Euler][] = [];

                boardMesh.traverse((node) => {
                    if (node.name.includes('socket_')) {
                        if (node.name.includes('engine')) {
                            engineTemp.push(node.position, node.rotation);
                        }

                        if (node.name.includes('hoverpad')) {
                            hoverPadTemp.push([node.name, node.position, node.rotation]);
                        }

                        if (node.name.includes('ornament')) {
                            ornamentTemp.push([node.name, node.position, node.rotation]);
                        }
                    }
                });

                hoverPadTemp.sort(([aName], [bName]) => (aName < bName ? -1 : aName > bName ? 1 : 0));
                ornamentTemp.sort(([aName], [bName]) => (aName < bName ? -1 : aName > bName ? 1 : 0));

                const engineTransform = engineTemp as [Vector3, Euler];
                const hoverPadTransforms: [Vector3, Euler][] = hoverPadTemp.map(([_, vec3, euler]) => [vec3, euler]);
                const ornamentTransforms: [Vector3, Euler][] = ornamentTemp.map(([_, vec3, euler]) => [vec3, euler]);

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
