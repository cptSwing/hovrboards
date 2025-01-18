import { Vector3 } from 'three';
import { ZustandStore } from './types/types';

export const sceneRoot = new Vector3(0, 0, 0);

export const cameraPositions: Record<keyof ZustandStore['selected'], Vector3> = {
    board: new Vector3(-0.75, 0.75, 0.25),
    engine: new Vector3(-0.25, 0.25, -1),
    hoverPads: new Vector3(-0.5, -0.75, 0),
    ornaments: new Vector3(0, 1, 0),
};
