import { FC } from 'react';
import { useZustand } from '../zustand';
import mockDb from '../mockApi/mockDb.json';

const { store_cycleBoards, store_cycleEngines, store_cycleHoverPads, store_cycleOrnaments } = useZustand.getState().methods;

const Configure: FC<{}> = ({}) => {
    return (
        <div className='space-y-8 [--margin:theme(spacing.4)] first:mt-[--margin]'>
            <ConfigureBoard />
            <ConfigureEngine />
            <ConfigureHoverPads />
            <ConfigureOrnaments />
        </div>
    );
};

const ConfigureBoard: FC<{}> = ({}) => {
    const selectedBoard = useZustand((store) => store.state.selected.board);
    const { name, description } = mockDb.Boards[selectedBoard];

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

const ConfigureEngine: FC<{}> = ({}) => {
    const selectedEngine = useZustand((store) => store.state.selected.engine);
    const { name, description } = mockDb.Engines[selectedEngine];

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

const ConfigureHoverPads: FC<{}> = ({}) => {
    const selectedHoverPads = useZustand((store) => store.state.selected.hoverPads);

    return (
        <div className='flex flex-col items-center justify-start'>
            <div className='mb-[--margin] self-start'>Hover Pads:</div>

            {selectedHoverPads.map((hPadIndex) => {
                const { name, description } = mockDb.HoverPads[hPadIndex];

                return (
                    <div className='mb-[--margin] flex w-full flex-col items-center justify-start'>
                        <div className='flex w-full items-start justify-between'>
                            <div
                                className='cursor-pointer'
                                onClick={() => {
                                    store_cycleHoverPads(hPadIndex, 'prev');
                                }}
                            >
                                prev
                            </div>
                            {name}
                            <div
                                className='cursor-pointer'
                                onClick={() => {
                                    store_cycleHoverPads(hPadIndex, 'next');
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

const ConfigureOrnaments: FC<{}> = ({}) => {
    const selectedOrnaments = useZustand((store) => store.state.selected.ornaments);

    return (
        <div className='flex flex-col items-center justify-start'>
            <div className='mb-[--margin] self-start'>Ornaments:</div>

            {selectedOrnaments.map((ornamentIndex) => {
                const { name, description } = mockDb.Ornaments[ornamentIndex];

                return (
                    <div className='mb-[--margin] flex w-full flex-col items-center justify-start'>
                        <div className='flex w-full items-start justify-between'>
                            <div
                                className='cursor-pointer'
                                onClick={() => {
                                    store_cycleOrnaments(ornamentIndex, 'prev');
                                }}
                            >
                                prev
                            </div>
                            {name}
                            <div
                                className='cursor-pointer'
                                onClick={() => {
                                    store_cycleOrnaments(ornamentIndex, 'next');
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
