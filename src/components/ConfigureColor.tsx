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
            <div className='rounded-sm bg-white px-1 py-0.5 text-sm'>
                <input type='checkbox' id={inputId} className='peer hidden' />

                {/* Closed Picker: */}
                <label htmlFor={inputId} className='cursor-pointer rounded-sm bg-white px-1 py-0.5 text-sm text-gray-700'>
                    ColorPicker
                </label>

                <div className='absolute -top-full left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center rounded-md bg-gray-700 px-4 pb-4 shadow-lg peer-checked:flex'>
                    {/* Opened Picker: */}
                    <label htmlFor={inputId} className='w-fit cursor-pointer rounded-sm px-1 text-sm'>
                        Close
                    </label>
                    <HexColorPicker color={hexColor} onChange={changeHandler} />
                    <HexColorInput className='mt-[--margin] w-full rounded-sm px-1 text-gray-700' color={hexColor} onChange={changeHandler} prefixed />
                </div>
            </div>

            <div className='cursor-pointer rounded-sm bg-white px-1 py-0.5 text-sm text-gray-700'>Random</div>

            <div className='cursor-pointer rounded-sm bg-white px-1 py-0.5 text-sm text-gray-700'>Default</div>
        </div>
    );
};

export default ConfigureColor;
