import { Euler, Object3D, Vector3 } from 'three';
import { GLTF } from 'three-stdlib';

export type DB_BoardType = {
    id: number;
    name: string;
    description: string;
    filePath: string;
    socketNames: {
        engine: string;
        hoverPads: string[];
        ornaments: string[];
    };
};

export type DB_AccessoryType = {
    id: number;
    name: string;
    description: string;
    filePath: string;
    plugName: string;
};

export type DB_EngineType = DB_AccessoryType;
export type DB_HoverPadType = DB_AccessoryType;
export type DB_OrnamentType = DB_AccessoryType;

export type DBType = {
    Boards: DB_BoardType[];
    Engines: DB_EngineType[];
    HoverPads: DB_HoverPadType[];
    Ornaments: DB_OrnamentType[];
};

export type SocketPosRot = [Vector3, Euler];
export type SocketTransforms = { engineTransform: SocketPosRot; hoverPadTransforms: SocketPosRot[]; ornamentTransforms: SocketPosRot[] };

export type GLTFResult = GLTF & {
    nodes: {
        [key: string]: Object3D;
    };
    materials: {};
};

export type ZustandStore = {
    state: {
        selected: {
            board: DB_BoardType['id'];
            engine: DB_EngineType['id'];
            hoverPads: DB_HoverPadType['id'][];
            ornaments: DB_OrnamentType['id'][];
        };
    };
    methods: {
        store_cycleBoards: (direction: 'next' | 'prev') => void;
        store_cycleEngines: (direction: 'next' | 'prev') => void;
        store_cycleHoverPads: (position: number, direction: 'next' | 'prev') => void;
        store_cycleOrnaments: (position: number, direction: 'next' | 'prev') => void;
    };
};
