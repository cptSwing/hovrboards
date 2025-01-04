import { useZustand } from '../zustand';
import mockDb from '../mockApi/mockDb.json';

const { Boards, Engines, HoverPads, Ornaments } = mockDb;

const useBoardConfiguration = () => {
    const selectedBoardIndex = useZustand((store) => store.state.selected.board);
    const selectedBoard = Boards[selectedBoardIndex];

    const selectedEngineIndex = useZustand((store) => store.state.selected.engine);
    const selectedEngine = Engines[selectedEngineIndex];

    const selectedHoverPadIndices = useZustand((store) => store.state.selected.hoverPads);
    const selectedHoverPads = selectedHoverPadIndices.map((index) => HoverPads[index]);

    const selectedOrnamentIndices = useZustand((store) => store.state.selected.ornaments);
    const selectedOrnaments = selectedOrnamentIndices.map((index) => Ornaments[index]);

    return {
        board: selectedBoard,
        engine: selectedEngine,
        hoverPads: selectedHoverPads,
        ornaments: selectedOrnaments,
    };
};

export default useBoardConfiguration;
