import { Cog8ToothIcon } from '@heroicons/react/24/solid';
import ConfigureBoard from './components/ConfigureBoard';
import ConfigureSettings from './components/ConfigureSettings';
import Scene from './components/Scene';
import { useRef } from 'react';

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
    const inputRef = useRef<HTMLInputElement | null>(null);

    return (
        <>
            <input ref={inputRef} id='settings-toggle-input' type='checkbox' defaultChecked={false} className='peer hidden' />
            <label
                className='absolute left-2 top-2 z-10 size-10 cursor-pointer stroke-gray-700/75 text-slate-500/50 transition-[left] hover:stroke-gray-600/75 hover:stroke-1 hover:text-white/75 active:stroke-gray-600/75 active:stroke-1 active:text-white/75 peer-checked:-left-full'
                htmlFor='settings-toggle-input'
            >
                <Cog8ToothIcon />
            </label>
            <div
                className='absolute -left-full top-0 z-10 h-full w-1/5 bg-slate-500/50 transition-[left] focus:outline-none peer-checked:left-0'
                tabIndex={-1}
                onTransitionEnd={(ev) => (ev.target as HTMLDivElement).focus()}
                onBlur={(ev) => {
                    if (inputRef.current && ev.relatedTarget === null) {
                        inputRef.current.checked = false;
                    }
                }}
            >
                <div className='w-full p-4'>
                    <ConfigureSettings />
                </div>
            </div>
        </>
    );
};

const PanelRight = () => {
    return (
        <div className='absolute right-0 top-0 z-10 h-full w-1/4 bg-slate-500/50 xl:w-1/5'>
            <div className='w-full p-4'>
                <ConfigureBoard />
            </div>
        </div>
    );
};
