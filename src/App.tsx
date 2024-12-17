import Scene from './components/Scene';
import { useZustand } from './zustand';

const store_cycleBoards = useZustand.getState().methods.store_cycleBoards;

const App = () => {
    return (
        <div className='relative size-full'>
            <Scene />
            <div className='absolute bottom-4 left-1/2 -translate-x-1/2'>
                <button
                    onClick={() => {
                        store_cycleBoards();
                    }}
                >
                    Next Board
                </button>
            </div>
        </div>
    );
};

export default App;
