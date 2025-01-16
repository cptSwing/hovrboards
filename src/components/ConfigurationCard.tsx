import { ChevronDownIcon } from '@heroicons/react/24/solid';
import { FC, ReactElement } from 'react';

export const ConfigurationCard: FC<{
    title: string;
    group: string;
    defaultChecked: boolean;
    handleChecked?: () => void;
    children: ReactElement;
}> = ({ title, group, defaultChecked, handleChecked, children }) => {
    const inputId = `${group}-${title}`;
    return (
        <div className='shadow-sm'>
            <input
                name={group}
                id={inputId}
                type='radio'
                className='peer hidden'
                defaultChecked={defaultChecked}
                onChange={(ev) => ev.target.checked && handleChecked && handleChecked()}
            />
            <label
                htmlFor={inputId}
                className='flex cursor-pointer select-none items-center justify-between self-start rounded-md bg-slate-700 px-2 py-0.5 text-white/75 transition-colors duration-100 [--unchecked:1] hover:bg-slate-600 active:bg-slate-600 peer-checked:rounded-b-none peer-checked:bg-slate-500 peer-checked:font-medium peer-checked:text-slate-800 peer-checked:[--unchecked:0]'
            >
                <div className='capitalize'>{title}:</div>
                <ChevronDownIcon className='h-5 rotate-[calc(90deg*var(--unchecked))] transition-transform' />
            </label>

            <div className='pointer-events-none max-h-0 rounded-b-md bg-slate-600 opacity-0 transition-[max-height,opacity] duration-[150ms,300ms] peer-checked:pointer-events-auto peer-checked:max-h-[32rem] peer-checked:opacity-100'>
                {children}
            </div>
        </div>
    );
};
