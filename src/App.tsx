import ConfigureBoard from './components/ConfigureBoard';
import ConfigureSettings from './components/ConfigureSettings';
import Scene from './components/Scene';

const App = () => {
    return (
        <div className='relative h-dvh w-dvw [--margin:theme(spacing.4)]'>
            <PanelLeft />
            <Scene />
            <PanelRight />
        </div>
    );
};

export default App;

const PanelLeft = () => {
    return (
        <div className='absolute left-0 top-0 z-10 h-full w-1/4 bg-slate-500/75'>
            <div className='mx-auto w-4/5'>
                <ConfigureSettings />
            </div>
        </div>
    );
};

const PanelRight = () => {
    return (
        <div className='absolute right-0 top-0 z-10 h-full w-1/4 bg-slate-500/75'>
            <div className='mx-auto w-4/5'>
                <ConfigureBoard />
            </div>
        </div>
    );
};
