import { FC, useRef } from 'react';
import { ZustandStore } from '../types/types';
import { HexColorPicker, HexColorInput } from 'react-colorful';

const ConfigureColor: FC<{ hexColor: string; changeHandler: (newColor: string) => void; category?: keyof ZustandStore['selected']; position?: number }> = ({
    hexColor,
    changeHandler,
    category = 'none',
    position = '100',
}) => {
    const defaultColor = useRef(hexColor);
    const inputId = category + position;
    return (
        <div className='relative flex select-none items-start justify-between gap-x-2'>
            <>
                <input type='checkbox' id={inputId} className='peer hidden' />

                {/* Closed Picker: */}
                <label
                    className='cursor-pointer rounded-sm bg-white px-1 py-0.5 text-sm text-gray-700 shadow-sm ring-white/75 transition-colors duration-100 hover:bg-slate-400 hover:text-white active:bg-slate-400 active:text-white active:ring sm:active:ring-1'
                    htmlFor={inputId}
                >
                    ColorPicker
                </label>

                <div className='absolute -top-full left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center rounded-md bg-gray-700 px-4 pb-4 shadow-lg peer-checked:flex'>
                    {/* Opened Picker: */}
                    <label
                        className='w-fit cursor-pointer rounded-sm px-1 text-sm text-slate-400 transition-colors hover:text-white active:text-white'
                        htmlFor={inputId}
                    >
                        Close
                    </label>
                    <HexColorPicker color={hexColor} onChange={changeHandler} />
                    <HexColorInput className='mt-[--margin] w-full rounded-sm px-1 text-gray-700' color={hexColor} onChange={changeHandler} prefixed />
                </div>
            </>

            <div
                className='cursor-pointer rounded-sm bg-white px-1 py-0.5 text-sm text-gray-700 shadow-sm ring-white/75 transition-colors duration-100 hover:bg-slate-400 hover:text-white active:bg-slate-400 active:text-white active:ring sm:active:ring-1'
                onClick={() => changeHandler(randomHexColor())}
            >
                Random
            </div>

            <div
                className='cursor-pointer rounded-sm bg-white px-1 py-0.5 text-sm text-gray-700 shadow-sm ring-white/75 transition-colors duration-100 hover:bg-slate-400 hover:text-white active:bg-slate-400 active:text-white active:ring sm:active:ring-1'
                onClick={() => changeHandler(defaultColor.current)}
            >
                Default
            </div>
        </div>
    );
};

export default ConfigureColor;

const randomHexColor = (string?: string) => {
    let final: string;
    if (string) {
        let sum = 0;
        for (let i = 0; i < string.length; i++) {
            sum += string.charCodeAt(i);
        }

        /* This is kinda arbitrary */
        sum = sum / (string.length * 1000);

        /* The number 16,777,215 is the total possible combinations of RGB(255,255,255) which is 32 bit colour. */
        final = `${Math.floor(sum * 16777215).toString(16)}`;
    } else {
        final = `${Math.floor(Math.random() * 16777215).toString(16)}`;
    }

    if (final.length < 6) {
        final = final.padEnd(6, '0');
    }

    return '#' + final;
};
