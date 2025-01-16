import { ChevronDownIcon } from '@heroicons/react/24/solid';
import { FC, ReactElement } from 'react';

export const ConfigurationCard: FC<{
    title: string;
    inputId: string;
    defaultChecked: boolean;
    handleChecked?: () => void;
    children: ReactElement;
}> = ({ title, inputId, defaultChecked, handleChecked, children }) => {
    return (
        <div className='shadow-sm'>
            <input
                name='configure-board-titles'
                id={inputId}
                type='radio'
                className='peer hidden'
                defaultChecked={defaultChecked}
                onChange={(ev) => ev.target.checked && handleChecked && handleChecked()}
            />
            <label
                htmlFor={inputId}
                className='flex cursor-pointer items-center justify-between self-start rounded-md bg-gray-700 px-2 py-0.5 [--unchecked:1] peer-checked:rounded-b-none peer-checked:[--unchecked:0]'
            >
                <div className='capitalize'>{title}:</div>
                <ChevronDownIcon className='h-5 rotate-[calc(90deg*var(--unchecked))] transition-transform' />
            </label>

            <div className='hidden flex-col items-center justify-start gap-y-4 rounded-b-md bg-gray-600 p-2 peer-checked:flex'>{children}</div>
        </div>
    );
};
