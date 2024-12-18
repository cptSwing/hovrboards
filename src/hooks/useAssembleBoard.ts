import { useZustand } from '../zustand';
import mockDb from '../mockApi/mockDb.json';

const { Boards, Engines, HoverPads, Ornaments } = mockDb;

const useAssembleBoard = () => {
    const selectedBoardIndex = useZustand((store) => store.state.selected.board);
    const selectedBoard = Boards[selectedBoardIndex];

    const selectedEngineIndex = useZustand((store) => store.state.selected.engine);
    const selectedEngine = Engines[selectedEngineIndex];

    const selectedHoverPadIndices = useZustand((store) => store.state.selected.hoverPads);
    const selectedHoverPads = HoverPads.filter((_, idx) => selectedHoverPadIndices.includes(idx));

    const selectedOrnamentIndices = useZustand((store) => store.state.selected.ornaments);
    const selectedOrnaments = Ornaments.filter((_, idx) => selectedOrnamentIndices.includes(idx));

    return {
        board: selectedBoard,
        engine: selectedEngine,
        hoverPads: selectedHoverPads,
        ornaments: selectedOrnaments,
    };
};

export default useAssembleBoard;
