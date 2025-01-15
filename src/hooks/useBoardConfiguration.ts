import { useZustand } from '../zustand';

const useBoardConfiguration = () => {
    const selectedBoard = useZustand((store) => store.selected.board);
    const selectedEngine = useZustand((store) => store.selected.engine);
    const selectedHoverPads = useZustand((store) => store.selected.hoverPads);
    const selectedOrnaments = useZustand((store) => store.selected.ornaments);

    return {
        board: selectedBoard,
        engine: selectedEngine,
        hoverPads: selectedHoverPads,
        ornaments: selectedOrnaments,
    };
};

export default useBoardConfiguration;
