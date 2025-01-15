import { FC } from 'react';
import { useZustand } from '../zustand';
import { ArrowLeftCircleIcon, ArrowRightCircleIcon, ChevronDownIcon } from '@heroicons/react/24/solid';
import { DB_CommonType, ZustandStore } from '../types/types';
import ConfigureColor from './ConfigureColor';

const { store_cycleBoards, store_cycleEngines, store_cycleHoverPads, store_cycleOrnaments, store_setHexColor } = useZustand.getState().methods;

const ConfigureBoard: FC = () => {
    return (
        <div className='space-y-4 first:mt-[--margin]'>
            <ConfigureSingleItem category='board' handleCyclingClick={store_cycleBoards} />
            <ConfigureSingleItem category='engine' handleCyclingClick={store_cycleEngines} />
            <ConfigureMultipleItems category='hoverPads' handleCyclingClick={store_cycleHoverPads} />
            <ConfigureMultipleItems category='ornaments' handleCyclingClick={store_cycleOrnaments} />
        </div>
    );
};

export default ConfigureBoard;

const ConfigureSingleItem: FC<{
    category: keyof ZustandStore['selected'];
    handleCyclingClick: (direction: 'next' | 'prev') => void;
}> = ({ category, handleCyclingClick }) => {
    const dbItem = useZustand((store) => store.selected[category]) as DB_CommonType;
    const inputId = `configure-board-title-${category}`;

    return (
        <div className='w-full'>
            <input name='configure-board-titles' id={inputId} type='radio' className='peer hidden' defaultChecked={category === 'board'} />
            <label
                htmlFor={inputId}
                className='flex w-full cursor-pointer items-center justify-between self-start rounded-md bg-gray-700 px-2 py-0.5 [--unchecked:1] peer-checked:rounded-b-none peer-checked:[--unchecked:0]'
            >
                <div className='capitalize'>{category}:</div>
                <ChevronDownIcon className='h-5 rotate-[calc(90deg*var(--unchecked))] transition-transform' />
            </label>

            <div className='flex h-0 flex-col items-center justify-start overflow-hidden rounded-b-md bg-gray-600 p-0 opacity-10 transition-opacity duration-500 peer-checked:h-full peer-checked:p-2 peer-checked:opacity-100'>
                <Item category={category} item={dbItem} handleCyclingClick={handleCyclingClick} />
            </div>
        </div>
    );
};

const ConfigureMultipleItems: FC<{
    category: keyof ZustandStore['selected'];
    handleCyclingClick: (direction: 'next' | 'prev', position: number) => void;
}> = ({ category, handleCyclingClick }) => {
    const dbItems = useZustand((store) => store.selected[category]) as DB_CommonType[];
    const inputId = `configure-board-title-${category}`;

    return (
        <div className='w-full'>
            <input name='configure-board-titles' id={inputId} type='radio' className='peer hidden' defaultChecked={category === 'board'} />
            <label
                htmlFor={inputId}
                className='flex w-full cursor-pointer items-center justify-between self-start rounded-md bg-gray-700 px-2 py-0.5 [--unchecked:1] peer-checked:rounded-b-none peer-checked:[--unchecked:0]'
            >
                <div className='capitalize'>{category}:</div>
                <ChevronDownIcon className='h-5 rotate-[calc(90deg*var(--unchecked))] transition-transform' />
            </label>

            <div className='flex h-0 flex-col items-center justify-start overflow-hidden rounded-b-md bg-gray-600 p-0 opacity-10 transition-opacity duration-500 peer-checked:h-full peer-checked:p-2 peer-checked:opacity-100'>
                {dbItems.map((dbItem, idx) => (
                    <Item
                        key={category + idx}
                        category={category}
                        item={dbItem}
                        handleCyclingClick={handleCyclingClick as (direction: 'next' | 'prev', position?: number) => void}
                        position={idx}
                    />
                ))}
            </div>
        </div>
    );
};

const Item: FC<{
    category: keyof ZustandStore['selected'];
    item: DB_CommonType;
    position?: number;
    handleCyclingClick: (direction: 'next' | 'prev', position?: number) => void;
}> = ({ category, item, position, handleCyclingClick }) => {
    const { name, description, hexColor } = item;

    return (
        <>
            <div className='flex w-full items-center justify-between'>
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

            <ConfigureColor
                hexColor={hexColor}
                changeHandler={(newColor) => store_setHexColor(newColor, category, position)}
                category={category}
                position={position}
            />
        </>
    );
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
