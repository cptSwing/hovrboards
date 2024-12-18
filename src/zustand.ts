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
                const currentSelection = get().state.selected;
                const BE_boards = mockDb.Boards;
                let following: number;

                if (direction === 'next') {
                    following = BE_boards[currentSelection.board + 1] ? currentSelection.board + 1 : 0;
                } else {
                    following = BE_boards[currentSelection.board - 1] ? currentSelection.board - 1 : BE_boards.length - 1;
                }

                set((draftState) => {
                    draftState.state.selected.board = following;
                });

                if (currentSelection.hoverPads.length !== BE_boards[following].socketNames.hoverPads.length) {
                    const newArr = Array.from({ length: BE_boards[following].socketNames.hoverPads.length }).map((_, idx) =>
                        currentSelection.hoverPads[idx] ? currentSelection.hoverPads[idx] : 0,
                    );

                    set((draftState) => {
                        draftState.state.selected.hoverPads = newArr;
                    });
                }

                if (currentSelection.ornaments.length !== BE_boards[following].socketNames.ornaments.length) {
                    const newArr = Array.from({ length: BE_boards[following].socketNames.ornaments.length }).map((_, idx) =>
                        currentSelection.ornaments[idx] ? currentSelection.ornaments[idx] : 0,
                    );

                    set((draftState) => {
                        draftState.state.selected.ornaments = newArr;
                    });
                }
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
