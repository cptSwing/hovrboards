import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { DB_CommonType, ZustandStore } from './types/types';
import mockDb from './mockApi/mockDb.json';
import { cameraPositions, sceneRoot } from './sceneConstants';
import { Euler, Vector3 } from 'three';

const nullEuler = new Euler();

export const useZustand = create<ZustandStore>()(
    immer((set, get) => ({
        selected: {
            board: { ...mockDb['Boards'][0], socketPosition: sceneRoot, socketRotation: nullEuler },
            engine: { ...mockDb['Engines'][0], socketPosition: sceneRoot, socketRotation: nullEuler },
            hoverPads: mockDb['Boards'][0].socketNames.hoverPads.map((_, idx) => ({
                ...mockDb['HoverPads'][idx],
                socketPosition: sceneRoot,
                socketRotation: nullEuler,
            })),
            ornaments: mockDb['Boards'][0].socketNames.ornaments.map((_, idx) => ({
                ...mockDb['Ornaments'][idx],
                socketPosition: sceneRoot,
                socketRotation: nullEuler,
            })),
        },

        settings: {
            background: {
                preset: 'city',
                isVisible: false,
                color: '#808080',
                showBackdrop: true,
            },
        },

        camera: {
            position: cameraPositions.board,
            lookAt: new Vector3(0, 0, 0),
        },

        methods: {
            store_setSocketTransforms: (category, position, rotation, selectionIndex) => {
                // TODO clean up types
                set((draftState) => {
                    if (typeof selectionIndex === 'number' && Array.isArray(draftState.selected[category])) {
                        (draftState.selected[category][selectionIndex] as ZustandStore['selected']['hoverPads'][0]).socketPosition = position;
                        (draftState.selected[category][selectionIndex] as ZustandStore['selected']['hoverPads'][0]).socketRotation = rotation;
                    } else {
                        (draftState.selected[category] as ZustandStore['selected']['board']).socketPosition = position;
                        (draftState.selected[category] as ZustandStore['selected']['board']).socketRotation = rotation;
                    }
                });
            },

            store_cycleBoards: (direction) => {
                const currentSelection = get().selected;
                const currentBoardIndex = currentSelection.board.id;
                const dbBoards = mockDb.Boards;
                let following: number;

                if (direction === 'next') {
                    following = dbBoards[currentBoardIndex + 1] ? currentBoardIndex + 1 : 0;
                } else {
                    following = dbBoards[currentBoardIndex - 1] ? currentBoardIndex - 1 : dbBoards.length - 1;
                }

                const newBoard = { ...currentSelection.board, ...dbBoards[following] };
                const newHoverPads = modifiedArrayLength(currentSelection.hoverPads, newBoard.socketNames.hoverPads.length);
                const newOrnaments = modifiedArrayLength(currentSelection.ornaments, newBoard.socketNames.ornaments.length);

                set((draftState) => {
                    draftState.selected = {
                        board: newBoard,
                        engine: currentSelection.engine,
                        hoverPads: newHoverPads,
                        ornaments: newOrnaments,
                    };
                });
            },

            store_cycleEngines: (direction) => {
                const currentEngine = get().selected.engine;
                const currentIndex = currentEngine.id;
                const dbEngines = mockDb.Engines;
                let following: number;

                if (direction === 'next') {
                    following = dbEngines[currentIndex + 1] ? currentIndex + 1 : 0;
                } else {
                    following = dbEngines[currentIndex - 1] ? currentIndex - 1 : dbEngines.length - 1;
                }

                set((draftState) => {
                    draftState.selected.engine = { ...currentEngine, ...dbEngines[following] };
                });
            },

            store_cycleHoverPads: (direction, position) => {
                const currentHoverPad = get().selected.hoverPads[position];
                const currentIndex = currentHoverPad.id;
                const dbHoverPads = mockDb.HoverPads;
                let following: number;

                if (direction === 'next') {
                    following = dbHoverPads[currentIndex + 1] ? currentIndex + 1 : 0;
                } else {
                    following = dbHoverPads[currentIndex - 1] ? currentIndex - 1 : dbHoverPads.length - 1;
                }

                set((draftState) => {
                    draftState.selected.hoverPads[position] = { ...currentHoverPad, ...dbHoverPads[following] };
                });
            },

            store_cycleOrnaments: (direction, position) => {
                const currentOrnament = get().selected.ornaments[position];
                const currentIndex = currentOrnament.id;
                const dbOrnaments = mockDb.Ornaments;
                let following: number;

                if (direction === 'next') {
                    following = dbOrnaments[currentIndex + 1] ? currentIndex + 1 : 0;
                } else {
                    following = dbOrnaments[currentIndex - 1] ? currentIndex - 1 : dbOrnaments.length - 1;
                }

                set((draftState) => {
                    draftState.selected.ornaments[position] = { ...currentOrnament, ...dbOrnaments[following] };
                });
            },

            store_setHexColor: (hexColor, category, position) => {
                set((draftState) => {
                    if (typeof position === 'number') {
                        (draftState.selected[category] as DB_CommonType[])[position].hexColor = hexColor;
                    } else {
                        (draftState.selected[category] as DB_CommonType).hexColor = hexColor;
                    }
                });
            },

            store_setBackgroundSettings: ({ color, preset, isVisible, showBackdrop }) => {
                const current = get().settings.background;
                set((draftState) => {
                    draftState.settings.background = {
                        ...current,
                        ...(color && { color }),
                        ...(preset && { preset }),
                        ...(!(typeof isVisible === 'undefined') && { isVisible }),
                        ...(!(typeof showBackdrop === 'undefined') && { showBackdrop }),
                    };
                });
            },

            store_setCameraValues: ({ position, lookAt }) => {
                const current = get().camera;

                set((draftState) => {
                    draftState.camera = {
                        ...current,
                        ...(position && { position }),
                        ...(lookAt && { lookAt }),
                    };
                });
            },
        },
    })),
);

const modifiedArrayLength = <T>(oldArr: T[], newLength: number) => {
    if (oldArr.length === newLength) return oldArr;

    const newArr: T[] = [];

    for (let i = 0; i < newLength; i++) {
        newArr.push(oldArr[i] ?? oldArr[0]);
    }

    return newArr;
};
