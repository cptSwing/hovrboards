import { FC } from 'react';
import { useZustand } from '../zustand';
import { ArrowLeftCircleIcon, ArrowRightCircleIcon } from '@heroicons/react/24/solid';
import { DB_CommonType, ZustandStore } from '../types/types';
import ConfigureColor from './ConfigureColor';
import { ConfigurationCard } from './ConfigurationCard';

const { store_cycleBoards, store_cycleEngines, store_cycleHoverPads, store_cycleOrnaments, store_setHexColor, store_setCameraPosition } =
    useZustand.getState().methods;

const ConfigureBoard: FC = () => {
    return (
        <div className='space-y-4'>
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

    return (
        <ConfigurationCard
            title={category}
            group={'configure-board'}
            defaultChecked={category === 'board'}
            handleChecked={() => store_setCameraPosition(category)}
        >
            <BoardItem category={category} item={dbItem} handleCyclingClick={handleCyclingClick} />
        </ConfigurationCard>
    );
};

const ConfigureMultipleItems: FC<{
    category: keyof ZustandStore['selected'];
    handleCyclingClick: (direction: 'next' | 'prev', position: number) => void;
}> = ({ category, handleCyclingClick }) => {
    const dbItems = useZustand((store) => store.selected[category]) as DB_CommonType[];

    return (
        <ConfigurationCard
            title={category}
            group={'configure-board'}
            defaultChecked={category === 'board'}
            handleChecked={() => store_setCameraPosition(category)}
        >
            <>
                {dbItems.map((dbItem, idx) => (
                    <BoardItem
                        key={category + idx}
                        category={category}
                        item={dbItem}
                        handleCyclingClick={handleCyclingClick as (direction: 'next' | 'prev', position?: number) => void}
                        position={idx}
                    />
                ))}
            </>
        </ConfigurationCard>
    );
};

const BoardItem: FC<{
    category: keyof ZustandStore['selected'];
    item: DB_CommonType;
    position?: number;
    handleCyclingClick: (direction: 'next' | 'prev', position?: number) => void;
}> = ({ category, item, position, handleCyclingClick }) => {
    const { name, description, hexColor } = item;

    return (
        <div className='flex flex-col items-center justify-start gap-y-4 border-t border-t-slate-500 p-2 pb-3'>
            <div className='flex w-full select-none items-center justify-between'>
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

            <div>{description}</div>

            <ConfigureColor
                hexColor={hexColor}
                changeHandler={(newColor) => store_setHexColor(newColor, category, position)}
                category={category}
                position={position}
            />
        </div>
    );
};
