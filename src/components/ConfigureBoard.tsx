import { FC } from 'react';
import { useZustand } from '../zustand';
import { ArrowLeftCircleIcon, ArrowRightCircleIcon } from '@heroicons/react/24/solid';
import { DB_CommonType, MeshData, ZustandStore } from '../types/types';
import ConfigureColor from './ConfigureColor';
import { ConfigurationCard } from './ConfigurationCard';
import { cameraPositions } from '../sceneConstants';
import { Vector3 } from 'three';

const { store_cycleBoards, store_cycleEngines, store_cycleHoverPads, store_cycleOrnaments, store_setHexColor, store_setCameraValues } =
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
    const dbItem = useZustand((store) => store.selected[category]) as DB_CommonType & MeshData;

    return (
        <ConfigurationCard
            title={category}
            group={'configure-board'}
            defaultChecked={category === 'board'}
            handleChecked={() => store_setCameraValues({ position: cameraPositions[category], lookAt: dbItem.socketPosition })}
        >
            <BoardItem category={category} item={dbItem} handleCyclingClick={handleCyclingClick} />
        </ConfigurationCard>
    );
};

const ConfigureMultipleItems: FC<{
    category: keyof ZustandStore['selected'];
    handleCyclingClick: (direction: 'next' | 'prev', position: number) => void;
}> = ({ category, handleCyclingClick }) => {
    const dbItems = useZustand((store) => store.selected[category]) as (DB_CommonType & MeshData)[];

    return (
        <ConfigurationCard
            title={category}
            group={'configure-board'}
            defaultChecked={category === 'board'}
            handleChecked={() => store_setCameraValues({ position: cameraPositions[category], lookAt: dbItems[0].socketPosition })}
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
    item: DB_CommonType & MeshData;
    position?: number;
    handleCyclingClick: (direction: 'next' | 'prev', position?: number) => void;
}> = ({ category, item, position, handleCyclingClick }) => {
    const { name, description, hexColor, socketPosition, socketRotation } = item;

    return (
        <div
            className='flex flex-col items-center justify-start gap-y-4 border-t border-t-slate-500 p-2 pb-3'
            onClick={() => {
                const zAxis = new Vector3(0, 1, 0).applyEuler(socketRotation).multiplyScalar(0.5);
                const positionCopy = socketPosition.clone().add(zAxis);

                store_setCameraValues({ position: positionCopy, lookAt: socketPosition });
            }}
        >
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
