import { PresetsType } from '@react-three/drei/helpers/environment-assets';
import { BufferGeometry, Euler, Material, Mesh, Object3D, Vector3 } from 'three';
import { GLTF } from 'three-stdlib';

export type DB_CommonType = {
    id: number; // WARN in SQL database this needs to correspond to array index
    name: string;
    description: string;
    filePath: string;
    hexColor: string;
};

export type DB_BoardType = DB_CommonType & {
    socketNames: {
        engine: string;
        hoverPads: string[];
        ornaments: string[];
    };
};

export type DB_AccessoryType = DB_CommonType & {
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

//TODO for later
export type MeshExtended = Mesh<BufferGeometry, Material[]>;

export type GLTFResult = GLTF & {
    nodes: {
        [key: string]: Object3D;
    };
    materials: { [key: string]: Material };
};

export type MeshData = {
    socketPosition: Vector3;
    socketRotation: Euler;
    directionalVector?: Vector3;
};

export type ZustandStore = {
    selected: {
        board: DB_BoardType & MeshData;
        engine: DB_EngineType & MeshData;
        hoverPads: (DB_HoverPadType & MeshData)[];
        ornaments: (DB_OrnamentType & MeshData)[];
    };

    camera: {
        position: Vector3;
        lookAt: Vector3;
    };

    settings: {
        background: {
            preset: PresetsType;
            isVisible: boolean;
            color: string;
            showBackdrop: boolean;
        };
    };

    methods: {
        store_setSocketTransforms: (category: keyof ZustandStore['selected'], position: Vector3, rotation: Euler, selectionIndex?: number) => void;
        store_cycleBoards: (direction: 'next' | 'prev') => void;
        store_cycleEngines: (direction: 'next' | 'prev') => void;
        store_cycleHoverPads: (direction: 'next' | 'prev', position: number) => void;
        store_cycleOrnaments: (direction: 'next' | 'prev', position: number) => void;
        store_setHexColor: (hexColor: string, category: keyof ZustandStore['selected'], position?: number) => void;
        store_setBackgroundSettings: ({ color, preset, isVisible, showBackdrop }: Partial<ZustandStore['settings']['background']>) => void;
        store_setCameraValues: ({ position, lookAt }: Partial<{ position: Vector3; lookAt: Vector3 }>) => void;
    };
};
