import React from "react";

interface SelectProps {
    label: string;
    id: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    children: React.ReactNode;
}

const blueSelect = "appearance-none btn-sm bg-gradient-to-t from-indigo-600 to-indigo-500 bg-[length:100%_100%] bg-[bottom] py-[5px] text-white shadow-[inset_0px_1px_0px_0px_theme(colors.white/.16)] hover:bg-[length:100%_150%] placeholder-white/50 border-none rounded-md focus:outline-none";

export default function TemplateSelect({label, id, onChange, children}: SelectProps) {
    return (
        <form className="flex flex-row items-center space-x-2">
            <label htmlFor={id}
                   className="block text-sm font-medium text-gray-900 dark:text-white"
            >
                {label}
            </label>
            <select id={id}
                    onChange={onChange}
                    className={blueSelect}
            >
                {children}
            </select>
        </form>
    );
}
