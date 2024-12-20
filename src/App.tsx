import Configure from './components/Configure';
import Scene from './components/Scene';

const App = () => {
    return (
        <div className='relative size-full'>
            <Scene />
            <div className='absolute right-0 top-0 h-full w-1/4 bg-slate-500/75'>
                <div className='mx-auto w-4/5'>
                    <Configure />
                </div>
            </div>
        </div>
    );
};

export default App;
