import { FC, useState } from 'react';
import { useZustand } from '../zustand';
import ConfigureColor from './ConfigureColor';
import { presetsObj, PresetsType } from '@react-three/drei/helpers/environment-assets';
import { ConfigurationCard } from './ConfigurationCard';

const { store_setBackgroundSettings, store_setCameraSettings } = useZustand.getState().methods;

const ConfigureSettings = () => {
    return (
        <div className='space-y-4'>
            <BackgroundSettings />
            <CameraSettings />
        </div>
    );
};

export default ConfigureSettings;

const BackgroundSettings: FC = () => {
    const { preset, isVisible, color, showBackdrop } = useZustand((state) => state.settings.background);

    const backgroundPresets = Object.keys(presetsObj);

    return (
        <ConfigurationCard title={'Background'} group={'configure-settings'} defaultChecked>
            <div className='flex flex-col items-center justify-start gap-y-4 border-t border-t-slate-500 p-2 pb-3'>
                <div>
                    <label htmlFor='background-map-select'>Choose Environment:</label>
                    <select
                        id='background-map-select'
                        defaultValue={preset}
                        onChange={({ currentTarget }) => store_setBackgroundSettings({ preset: currentTarget.value as PresetsType })}
                        className='ml-2 rounded-sm p-px capitalize text-gray-700'
                    >
                        {backgroundPresets.map((preset, idx) => (
                            <option key={preset + idx} className='capitalize' value={preset}>
                                {preset}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor='background-is-visible'>Show Background:</label>
                    <input
                        id='background-is-visible'
                        type='checkbox'
                        defaultChecked={isVisible}
                        onChange={({ target }) => store_setBackgroundSettings({ isVisible: target.checked })}
                        className='ml-2'
                    />
                </div>

                {!isVisible && (
                    <div>
                        <ConfigureColor hexColor={color} changeHandler={(newColor) => store_setBackgroundSettings({ color: newColor })} />
                    </div>
                )}

                <div>
                    <label htmlFor='backdrop-is-visible'>Show Backdrop:</label>
                    <input
                        id='backdrop-is-visible'
                        type='checkbox'
                        defaultChecked={showBackdrop}
                        onChange={({ target }) => store_setBackgroundSettings({ showBackdrop: target.checked })}
                        className='ml-2'
                    />
                </div>
            </div>
        </ConfigurationCard>
    );
};

const min = 0.01;
const max = 1;

const CameraSettings: FC = () => {
    const { transitionSpeed } = useZustand((state) => state.settings.camera);
    const [transitionValue, setTransitionValue] = useState(transitionSpeed);

    return (
        <ConfigurationCard title={'Camera'} group={'configure-settings'} defaultChecked={false}>
            <div className='flex flex-col items-center justify-start gap-y-4 border-t border-t-slate-500 p-2 pb-3'>
                <div>
                    <label htmlFor='camera-transition-speed'>Transition Speed:</label>
                    <input
                        id='camera-transition-speed'
                        type='number'
                        value={transitionValue}
                        min={min}
                        max={max}
                        step={min}
                        onInput={({ currentTarget }) => setTransitionValue(parseFloat(currentTarget.value))}
                        onKeyDown={(ev) => {
                            if (ev.key === 'Enter') {
                                const validated = Math.max(Math.min(transitionValue, max), min);

                                store_setCameraSettings({ transitionSpeed: validated });
                                setTransitionValue(validated);
                            }
                        }}
                        className='ml-2 rounded-sm px-2 text-gray-700 invalid:border-red-500'
                    />
                </div>
            </div>
        </ConfigurationCard>
    );
};
