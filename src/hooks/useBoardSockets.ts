import { SocketTransforms } from '../types/types';
import { Euler, Object3D, Quaternion, Vector3 } from 'three';
import { useMemo } from 'react';
import { useZustand } from '../zustand';

const { store_setSocketTransforms } = useZustand.getState().methods;

const useBoardSockets = (boardSockets?: Object3D[]) => {
    const sockets_Memo = useMemo(() => {
        if (boardSockets?.length) {
            const engineTemp: (Vector3 | Euler)[] = [];
            const hoverPadSocketsTemp: [string, Vector3, Euler][] = [];
            const ornamentSocketsTemp: [string, Vector3, Euler][] = [];

            boardSockets.forEach((boardSocket) => {
                if (boardSocket.name.includes('engine')) {
                    engineTemp.push(boardSocket.position, boardSocket.rotation);
                }

                if (boardSocket.name.includes('hoverpad')) {
                    hoverPadSocketsTemp.push([boardSocket.name, boardSocket.position, boardSocket.rotation]);
                }

                if (boardSocket.name.includes('ornament')) {
                    ornamentSocketsTemp.push([boardSocket.name, boardSocket.position, boardSocket.rotation]);
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

            return {
                engineTransform,
                hoverPadTransforms,
                ornamentTransforms,
            } as SocketTransforms;
        }
    }, [boardSockets]);

    return sockets_Memo;
};

export default useBoardSockets;

const _localToWorld = (quat: Quaternion, object: Object3D, target?: Quaternion) => {
    return quat.premultiply(object.getWorldQuaternion(target ?? new Quaternion()));
};
