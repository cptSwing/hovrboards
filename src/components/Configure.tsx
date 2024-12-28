import { FC, useState } from 'react';
import { useZustand } from '../zustand';
import { ArrowLeftCircleIcon, ArrowRightCircleIcon } from '@heroicons/react/24/solid';

import mockDb from '../mockApi/mockDb.json';

const { store_cycleBoards, store_cycleEngines, store_cycleHoverPads, store_cycleOrnaments } = useZustand.getState().methods;

const Configure: FC<{}> = ({}) => {
    const [menuOpen, setMenuOpen] = useState([true, false, false, false]);

    return (
        <div className='space-y-4 [--margin:theme(spacing.4)] first:mt-[--margin]'>
            <ConfigureBoard
                isOpen={menuOpen[0]}
                handleClick={() => {
                    setMenuOpen((oldArr) => {
                        const newArr = [...oldArr];
                        newArr.splice(0, 1, !oldArr[0]);
                        return newArr;
                    });
                }}
            />
            <ConfigureEngine
                isOpen={menuOpen[1]}
                handleClick={() => {
                    setMenuOpen((oldArr) => {
                        const newArr = [...oldArr];
                        newArr.splice(1, 1, !oldArr[1]);
                        return newArr;
                    });
                }}
            />
            <ConfigureHoverPads
                isOpen={menuOpen[2]}
                handleClick={() => {
                    setMenuOpen((oldArr) => {
                        const newArr = [...oldArr];
                        newArr.splice(2, 1, !oldArr[2]);
                        return newArr;
                    });
                }}
            />
            <ConfigureOrnaments
                isOpen={menuOpen[3]}
                handleClick={() => {
                    setMenuOpen((oldArr) => {
                        const newArr = [...oldArr];
                        newArr.splice(3, 1, !oldArr[3]);
                        return newArr;
                    });
                }}
            />
        </div>
    );
};

const ConfigureBoard: FC<{ isOpen: boolean; handleClick: () => void }> = ({ isOpen, handleClick }) => {
    const selectedBoard = useZustand((store) => store.state.selected.board);
    const { name, description } = mockDb.Boards[selectedBoard];

    return (
        <div className='flex flex-col items-center justify-start'>
            <div className='w-full cursor-pointer self-start bg-gray-700 px-1' onClick={handleClick}>
                {isOpen ? '-' : ' +'} Board:
            </div>
            {isOpen && (
                <>
                    <div className='mt-[--margin] flex w-full items-center justify-between'>
                        <ArrowLeftCircleIcon
                            className='size-8 cursor-pointer'
                            onClick={() => {
                                store_cycleBoards('prev');
                            }}
                        />
                        {name}
                        <ArrowRightCircleIcon
                            className='size-8 cursor-pointer'
                            onClick={() => {
                                store_cycleBoards('next');
                            }}
                        />
                    </div>
                    <div className='mt-[--margin]'>{description}</div>
                </>
            )}
        </div>
    );
};

const ConfigureEngine: FC<{ isOpen: boolean; handleClick: () => void }> = ({ isOpen, handleClick }) => {
    const selectedEngine = useZustand((store) => store.state.selected.engine);
    const { name, description } = mockDb.Engines[selectedEngine];

    return (
        <div className='flex flex-col items-center justify-start'>
            <div className='w-full cursor-pointer self-start bg-gray-700 px-1' onClick={handleClick}>
                {isOpen ? '-' : ' +'} Engine:
            </div>
            {isOpen && (
                <>
                    <div className='mt-[--margin] flex w-full items-start justify-between'>
                        <ArrowLeftCircleIcon
                            className='size-8 cursor-pointer'
                            onClick={() => {
                                store_cycleEngines('prev');
                            }}
                        />
                        {name}
                        <ArrowRightCircleIcon
                            className='size-8 cursor-pointer'
                            onClick={() => {
                                store_cycleEngines('next');
                            }}
                        />
                    </div>
                    <div className='mt-[--margin]'>{description}</div>
                </>
            )}
        </div>
    );
};

const ConfigureHoverPads: FC<{ isOpen: boolean; handleClick: () => void }> = ({ isOpen, handleClick }) => {
    const selectedHoverPads = useZustand((store) => store.state.selected.hoverPads);

    return (
        <div className='flex flex-col items-center justify-start'>
            <div className='w-full cursor-pointer self-start bg-gray-700 px-1' onClick={handleClick}>
                {isOpen ? '-' : ' +'} Hover Pads:
            </div>

            {isOpen &&
                selectedHoverPads.map((hoverPadIndex, idx) => {
                    const { name, description } = mockDb.HoverPads[hoverPadIndex];

                    return (
                        <div key={name + idx} className='my-[--margin] flex w-full flex-col items-center justify-start'>
                            <div className='flex w-full items-start justify-between'>
                                <ArrowLeftCircleIcon
                                    className='size-8 cursor-pointer'
                                    onClick={() => {
                                        store_cycleHoverPads(idx, 'prev');
                                    }}
                                />
                                {name}
                                <ArrowRightCircleIcon
                                    className='size-8 cursor-pointer'
                                    onClick={() => {
                                        store_cycleHoverPads(idx, 'next');
                                    }}
                                />
                            </div>
                            <div className='mt-[--margin]'>{description}</div>
                        </div>
                    );
                })}
        </div>
    );
};

const ConfigureOrnaments: FC<{ isOpen: boolean; handleClick: () => void }> = ({ isOpen, handleClick }) => {
    const selectedOrnaments = useZustand((store) => store.state.selected.ornaments);

    return (
        <div className='flex flex-col items-center justify-start'>
            <div className='w-full cursor-pointer self-start bg-gray-700 px-1' onClick={handleClick}>
                {isOpen ? '-' : ' +'} Ornaments:
            </div>

            {isOpen &&
                selectedOrnaments.map((ornamentIndex, idx) => {
                    const { name, description } = mockDb.Ornaments[ornamentIndex];

                    return (
                        <div key={name + idx} className='my-[--margin] flex w-full flex-col items-center justify-start'>
                            <div className='flex w-full items-start justify-between'>
                                <ArrowLeftCircleIcon
                                    className='size-8 cursor-pointer'
                                    onClick={() => {
                                        store_cycleOrnaments(idx, 'prev');
                                    }}
                                />
                                {name}
                                <ArrowRightCircleIcon
                                    className='size-8 cursor-pointer'
                                    onClick={() => {
                                        store_cycleOrnaments(idx, 'next');
                                    }}
                                />
                            </div>
                            <div className='mt-[--margin]'>{description}</div>
                        </div>
                    );
                })}
        </div>
    );
};

export default Configure;
