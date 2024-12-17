import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { Boards, ZustandStore } from './types/types';

export const useZustand = create<ZustandStore>()(
    immer((set, get) => ({
        options: {
            board: Boards['Hovr_1'],
        },
        methods: {
            store_cycleBoards: () => {
                const current = get().options.board;
                const next = current === Boards['Hovr_1'] ? Boards['Hovr_2'] : Boards['Hovr_1'];

                set((draftState) => {
                    draftState.options.board = next;
                });
            },
        },
    })),
);
