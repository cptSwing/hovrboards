import { FC } from 'react';
import { ZustandStore } from '../types/types';
import { HexColorPicker, HexColorInput } from 'react-colorful';

const ConfigureColor: FC<{ hexColor: string; changeHandler: (newColor: string) => void; category?: keyof ZustandStore['selected']; position?: number }> = ({
    hexColor,
    changeHandler,
    category = 'none',
    position = '100',
}) => {
    const inputId = category + position;
    return (
        <div className='relative flex items-start justify-between gap-x-1'>
            <div>
                <input type='checkbox' id={inputId} className='peer hidden' />
                <div className='absolute left-1/2 hidden -translate-x-1/2 flex-col rounded-md bg-gray-700 p-4 peer-checked:flex'>
                    <HexColorPicker color={hexColor} onChange={changeHandler} />
                    <HexColorInput className='mt-[--margin] text-gray-700' color={hexColor} onChange={changeHandler} prefixed />
                </div>

                {/* Closed: */}
                <label htmlFor={inputId} className='cursor-pointer rounded-sm bg-white px-1 py-0.5 text-sm text-gray-700'>
                    ColorPicker
                </label>

                {/* Open: */}
                <label
                    htmlFor={inputId}
                    className='absolute left-0 top-0 hidden -translate-y-full cursor-pointer rounded-sm bg-white px-1 py-0.5 text-sm text-gray-700 peer-checked:block'
                >
                    Close
                </label>
            </div>

            <div className='cursor-pointer rounded-sm bg-white px-1 py-0.5 text-sm text-gray-700'>Random</div>

            <div className='cursor-pointer rounded-sm bg-white px-1 py-0.5 text-sm text-gray-700'>Default</div>
        </div>
    );
};

export default ConfigureColor;
