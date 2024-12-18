import { FC, useMemo } from 'react';
import { useZustand } from '../zustand';
import mockDb from '../mockApi/mockDb.json';
import useAssembleBoard from '../hooks/useAssembleBoard';
import { DB_BoardType, DB_EngineType, DB_HoverPadType, DB_OrnamentType } from '../types/types';

const { store_cycleBoards, store_cycleEngines, store_cycleHoverPads, store_cycleOrnaments } = useZustand.getState().methods;

const Configure: FC<{}> = ({}) => {
    const { board, engine, hoverPads, ornaments } = useAssembleBoard();

    return (
        <div className='space-y-8 [--margin:theme(spacing.4)] first:mt-[--margin]'>
            <ConfigureBoard board={board} />
            <ConfigureEngine engine={engine} />
            <ConfigureHoverPads hoverPads={hoverPads} count={board.socketNames.hoverPads.length} />
            <ConfigureOrnaments ornaments={ornaments} count={board.socketNames.ornaments.length} />
        </div>
    );
};

const ConfigureBoard: FC<{ board: DB_BoardType }> = ({ board }) => {
    const { name, description } = board;

    return (
        <div className='flex flex-col items-center justify-start'>
            <div className='mb-[--margin] self-start'>Board:</div>
            <div className='flex w-full items-start justify-between'>
                <div
                    className='cursor-pointer'
                    onClick={() => {
                        store_cycleBoards('prev');
                    }}
                >
                    prev
                </div>
                {name}
                <div
                    className='cursor-pointer'
                    onClick={() => {
                        store_cycleBoards('next');
                    }}
                >
                    next
                </div>
            </div>
            <div className='mt-[--margin]'>{description}</div>
        </div>
    );
};

const ConfigureEngine: FC<{ engine: DB_EngineType }> = ({ engine }) => {
    const { name, description } = engine;

    return (
        <div className='flex flex-col items-center justify-start'>
            <div className='mb-[--margin] self-start'>Engine:</div>
            <div className='flex w-full items-start justify-between'>
                <div
                    className='cursor-pointer'
                    onClick={() => {
                        store_cycleEngines('prev');
                    }}
                >
                    prev
                </div>
                {name}
                <div
                    className='cursor-pointer'
                    onClick={() => {
                        store_cycleEngines('next');
                    }}
                >
                    next
                </div>
            </div>
            <div className='mt-[--margin]'>{description}</div>
        </div>
    );
};

const ConfigureHoverPads: FC<{ hoverPads: DB_HoverPadType[]; count: number }> = ({ hoverPads, count }) => {
    return (
        <div className='flex flex-col items-center justify-start'>
            <div className='mb-[--margin] self-start'>Hover Pads:</div>

            {Array.from({ length: count }).map((_, idx) => {
                const { name, description } = hoverPads[idx];

                return (
                    <div key={name + idx} className='mb-[--margin] flex w-full flex-col items-center justify-start'>
                        <div className='flex w-full items-start justify-between'>
                            <div
                                className='cursor-pointer'
                                onClick={() => {
                                    store_cycleHoverPads(idx, 'prev');
                                }}
                            >
                                prev
                            </div>
                            {name}
                            <div
                                className='cursor-pointer'
                                onClick={() => {
                                    store_cycleHoverPads(idx, 'next');
                                }}
                            >
                                next
                            </div>
                        </div>
                        <div className='mt-[--margin]'>{description}</div>
                    </div>
                );
            })}
        </div>
    );
};

const ConfigureOrnaments: FC<{ ornaments: DB_OrnamentType[]; count: number }> = ({ ornaments, count }) => {
    return (
        <div className='flex flex-col items-center justify-start'>
            <div className='mb-[--margin] self-start'>Ornaments:</div>

            {Array.from({ length: count }).map((_, idx) => {
                const { name, description } = ornaments[idx];
                console.log('%c[Configure]', 'color: #4786ce', `name, description :`, name, description);

                return (
                    <div key={name + idx} className='mb-[--margin] flex w-full flex-col items-center justify-start'>
                        <div className='flex w-full items-start justify-between'>
                            <div
                                className='cursor-pointer'
                                onClick={() => {
                                    store_cycleOrnaments(idx, 'prev');
                                }}
                            >
                                prev
                            </div>
                            {name}
                            <div
                                className='cursor-pointer'
                                onClick={() => {
                                    store_cycleOrnaments(idx, 'next');
                                }}
                            >
                                next
                            </div>
                        </div>
                        <div className='mt-[--margin]'>{description}</div>
                    </div>
                );
            })}
        </div>
    );
};

export default Configure;
