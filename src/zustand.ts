import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { ZustandStore } from './types/types';
import mockDb from './mockApi/mockDb.json';

export const useZustand = create<ZustandStore>()(
    immer((set, get) => ({
        state: {
            selected: {
                board: 0,
                engine: 0,
                hoverPads: [0, 1],
                ornaments: [0],
            },
        },
        methods: {
            store_cycleBoards: (direction) => {
                const current = get().state.selected.board;
                const boards = mockDb.Boards;
                let following: number;

                if (direction === 'next') {
                    following = boards[current + 1] ? current + 1 : 0;
                } else {
                    following = boards[current - 1] ? current - 1 : boards.length - 1;
                }

                set((draftState) => {
                    draftState.state.selected.board = following;
                });
            },

            store_cycleEngines: (direction) => {
                const current = get().state.selected.engine;
                const engines = mockDb.Engines;
                let following: number;

                if (direction === 'next') {
                    following = engines[current + 1] ? current + 1 : 0;
                } else {
                    following = engines[current - 1] ? current - 1 : engines.length - 1;
                }

                set((draftState) => {
                    draftState.state.selected.engine = following;
                });
            },

            store_cycleHoverPads: (position, direction) => {
                const current = get().state.selected.hoverPads[position];
                const hoverPads = mockDb.HoverPads;
                let following: number;

                if (direction === 'next') {
                    following = hoverPads[current + 1] ? current + 1 : 0;
                } else {
                    following = hoverPads[current - 1] ? current - 1 : hoverPads.length - 1;
                }

                set((draftState) => {
                    draftState.state.selected.hoverPads[position] = following;
                });
            },

            store_cycleOrnaments: (position, direction) => {
                const current = get().state.selected.ornaments[position];
                const ornaments = mockDb.Ornaments;
                let following: number;

                if (direction === 'next') {
                    following = ornaments[current + 1] ? current + 1 : 0;
                } else {
                    following = ornaments[current - 1] ? current - 1 : ornaments.length - 1;
                }

                set((draftState) => {
                    draftState.state.selected.ornaments[position] = following;
                });
            },
        },
    })),
);
