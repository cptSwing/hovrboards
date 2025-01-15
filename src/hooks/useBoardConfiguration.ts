import { useZustand } from '../zustand';

const useBoardConfiguration = () => {
    const selectedBoard = useZustand((store) => store.state.selected.board);
    const selectedEngine = useZustand((store) => store.state.selected.engine);
    const selectedHoverPads = useZustand((store) => store.state.selected.hoverPads);
    const selectedOrnaments = useZustand((store) => store.state.selected.ornaments);

    return {
        board: selectedBoard,
        engine: selectedEngine,
        hoverPads: selectedHoverPads,
        ornaments: selectedOrnaments,
    };
};

export default useBoardConfiguration;
