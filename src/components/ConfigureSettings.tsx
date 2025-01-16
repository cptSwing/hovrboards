import { FC } from 'react';
import { useZustand } from '../zustand';
import ConfigureColor from './ConfigureColor';
import { presetsObj, PresetsType } from '@react-three/drei/helpers/environment-assets';
import { ConfigurationCard } from './ConfigurationCard';

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
        <ConfigurationCard title={'Background'} inputId={inputId} defaultChecked={alwaysOpen}>
            <>
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
            </>
        </ConfigurationCard>
    );
};
