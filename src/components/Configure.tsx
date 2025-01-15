import { FC, useState } from 'react';
import { useZustand } from '../zustand';
import { ArrowLeftCircleIcon, ArrowRightCircleIcon } from '@heroicons/react/24/solid';
import { HexColorPicker, HexColorInput } from 'react-colorful';
import { DB_CommonType, ZustandStore } from '../types/types';

const { store_cycleBoards, store_cycleEngines, store_cycleHoverPads, store_cycleOrnaments, store_setHexColor } = useZustand.getState().methods;

const Configure: FC = () => {
    const [menuOpen, setMenuOpen] = useState([true, false, false, false]);

    return (
        <div className='space-y-4 [--margin:theme(spacing.4)] first:mt-[--margin]'>
            <ConfigureSingleItem
                category='board'
                isOpen={menuOpen[0]}
                handleTitleClick={() => {
                    setMenuOpen((oldArr) => changeOpenedMenu(oldArr, 0));
                }}
                handleCyclingClick={store_cycleBoards}
            />
            <ConfigureSingleItem
                category='engine'
                isOpen={menuOpen[1]}
                handleTitleClick={() => {
                    setMenuOpen((oldArr) => changeOpenedMenu(oldArr, 1));
                }}
                handleCyclingClick={store_cycleEngines}
            />

            <ConfigureMultipleItems
                category='hoverPads'
                isOpen={menuOpen[2]}
                handleTitleClick={() => {
                    setMenuOpen((oldArr) => changeOpenedMenu(oldArr, 2));
                }}
                handleCyclingClick={store_cycleHoverPads}
            />

            <ConfigureMultipleItems
                category='ornaments'
                isOpen={menuOpen[3]}
                handleTitleClick={() => {
                    setMenuOpen((oldArr) => changeOpenedMenu(oldArr, 3));
                }}
                handleCyclingClick={store_cycleOrnaments}
            />
        </div>
    );
};

const Item: FC<{
    category: keyof ZustandStore['state']['selected'];
    item: DB_CommonType;
    position?: number;
    handleCyclingClick: (direction: 'next' | 'prev', position?: number) => void;
}> = ({ category, item, position, handleCyclingClick }) => {
    const { name, description, hexColor } = item;

    return (
        <>
            <div className='mt-[--margin] flex w-full items-center justify-between'>
                <ArrowLeftCircleIcon
                    className='size-8 cursor-pointer'
                    onClick={() => {
                        handleCyclingClick('prev', position);
                    }}
                />
                {name}
                <ArrowRightCircleIcon
                    className='size-8 cursor-pointer'
                    onClick={() => {
                        handleCyclingClick('next', position);
                    }}
                />
            </div>
            <div className='my-[--margin]'>{description}</div>

            <ConfigureColor hexColor={hexColor} category={category} position={position} />
        </>
    );
};

const ConfigureSingleItem: FC<{
    category: keyof ZustandStore['state']['selected'];
    isOpen: boolean;
    handleTitleClick: () => void;
    handleCyclingClick: (direction: 'next' | 'prev') => void;
}> = ({ category, isOpen, handleTitleClick, handleCyclingClick }) => {
    const dbItem = useZustand((store) => store.state.selected[category]) as DB_CommonType;

    return (
        <div className='flex flex-col items-center justify-start'>
            <div className='w-full cursor-pointer self-start bg-gray-700 px-1' onClick={handleTitleClick}>
                {isOpen ? '-' : ' +'} <span className='capitalize'>{category}:</span>
            </div>
            {isOpen && <Item category={category} item={dbItem} handleCyclingClick={handleCyclingClick} />}
        </div>
    );
};

const ConfigureMultipleItems: FC<{
    category: keyof ZustandStore['state']['selected'];
    isOpen: boolean;
    handleTitleClick: () => void;
    handleCyclingClick: (direction: 'next' | 'prev', position: number) => void;
}> = ({ category, isOpen, handleTitleClick, handleCyclingClick }) => {
    const dbItems = useZustand((store) => store.state.selected[category]) as DB_CommonType[];

    return (
        <div className='flex flex-col items-center justify-start'>
            <div className='w-full cursor-pointer self-start bg-gray-700 px-1' onClick={handleTitleClick}>
                {isOpen ? '-' : ' +'} <span className='capitalize'>{category}:</span>
            </div>

            {isOpen &&
                dbItems.map((dbItem, idx) => (
                    <Item key={category + idx} category={category} item={dbItem} handleCyclingClick={handleCyclingClick} position={idx} />
                ))}
        </div>
    );
};

export default Configure;

const ConfigureColor: FC<{ hexColor: string; category: keyof ZustandStore['state']['selected']; position?: number }> = ({ hexColor, category, position }) => {
    const inputId = category + position;
    return (
        <div className='relative flex items-start justify-between gap-x-1'>
            <div>
                <input type='checkbox' id={inputId} className='peer hidden' />
                <div className='absolute left-1/2 hidden -translate-x-1/2 flex-col rounded-md bg-gray-700 p-4 peer-checked:flex'>
                    <HexColorPicker color={hexColor} onChange={(newColor) => store_setHexColor(newColor, category, position)} />
                    <HexColorInput
                        className='mt-[--margin] text-gray-700'
                        color={hexColor}
                        onChange={(newColor) => store_setHexColor(newColor, category, position)}
                        prefixed
                    />
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

const changeOpenedMenu = (state: boolean[], position: number) => {
    const newState = [...state];
    newState.splice(position, 1, !state[position]);
    return newState;
};

const _randomHexColor = (string?: string) => {
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
        final.padEnd(6, '0');
    }
    return '#' + final;
};
