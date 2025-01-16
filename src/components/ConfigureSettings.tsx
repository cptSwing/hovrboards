import { FC } from 'react';
import { useZustand } from '../zustand';
import ConfigureColor from './ConfigureColor';
import { presetsObj, PresetsType } from '@react-three/drei/helpers/environment-assets';
import { ChevronDownIcon } from '@heroicons/react/24/solid';

const store_setBackgroundSettings = useZustand.getState().methods.store_setBackgroundSettings;

const ConfigureSettings = () => {
    return (
        <div className='space-y-4'>
            <BackgroundSettings />
        </div>
    );
};

export default ConfigureSettings;

const BackgroundSettings: FC = () => {
    const { preset, isVisible, color, showBackdrop } = useZustand((state) => state.settings.background);

    // WARN change once there are more settings
    const alwaysOpen = true;
    const inputId = `configure-settings-title-${alwaysOpen}`;

    const backgroundPresets = Object.keys(presetsObj);

    return (
        <div>
            <input name='configure-setting-titles' id={inputId} type='radio' className='peer hidden' defaultChecked={alwaysOpen} />
            <label
                htmlFor={inputId}
                className='flex cursor-pointer items-center justify-between self-start rounded-md bg-gray-700 px-2 py-0.5 [--unchecked:1] peer-checked:rounded-b-none peer-checked:[--unchecked:0]'
            >
                <div className='capitalize'>Background:</div>
                <ChevronDownIcon className='h-5 rotate-[calc(90deg*var(--unchecked))] transition-transform' />
            </label>

            <div className='flex h-0 flex-col items-start justify-start overflow-hidden rounded-b-md bg-gray-600 p-0 opacity-10 transition-opacity duration-500 peer-checked:h-full peer-checked:p-2 peer-checked:opacity-100'>
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

                <div className='mt-[--margin]'>
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
                    <div className='mt-[--margin]'>
                        <ConfigureColor hexColor={color} changeHandler={(newColor) => store_setBackgroundSettings({ color: newColor })} />
                    </div>
                )}

                <div className='mt-[--margin]'>
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
        </div>
    );
};
