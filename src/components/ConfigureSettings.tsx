import { FC, useState } from 'react';
import { useZustand } from '../zustand';
import ConfigureColor from './ConfigureColor';
import { changeBooleanInArray } from '../lib/configurationItems';
import { presetsObj, PresetsType } from '@react-three/drei/helpers/environment-assets';

const store_setBackgroundSettings = useZustand.getState().methods.store_setBackgroundSettings;

const ConfigureSettings = () => {
    const [menuOpen, setMenuOpen] = useState([true]);

    return (
        <div className='space-y-4 first:mt-[--margin]'>
            <BackgroundSettings
                isOpen={menuOpen[0]}
                handleTitleClick={() => {
                    setMenuOpen((oldArr) => changeBooleanInArray(oldArr, 0));
                }}
            />
        </div>
    );
};

export default ConfigureSettings;

const BackgroundSettings: FC<{ isOpen: boolean; handleTitleClick: () => void }> = ({ isOpen, handleTitleClick }) => {
    const { preset, isVisible, color, showBackdrop } = useZustand((state) => state.settings.background);

    const backgroundPresets = Object.keys(presetsObj);

    return (
        <div className='flex flex-col items-start justify-start'>
            <div className='w-full cursor-pointer self-start bg-gray-700 px-1' onClick={handleTitleClick}>
                {isOpen ? '-' : ' +'} <span className='capitalize'>Background:</span>
            </div>
            {isOpen && (
                <>
                    <div className='mt-[--margin]'>
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
                </>
            )}
        </div>
    );
};
