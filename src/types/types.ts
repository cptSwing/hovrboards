export enum Boards {
    'Hovr_1',
    'Hovr_2',
}

export type ZustandStore = {
    options: {
        board: Boards;
    };
    methods: {
        store_cycleBoards: () => void;
    };
};
