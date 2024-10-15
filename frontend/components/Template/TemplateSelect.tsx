import React from "react";

interface SelectProps {
    label: string;
    id: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    children: React.ReactNode;
}

export default function TemplateSelect({label, id, onChange, children}: SelectProps) {
    return (
        <form className="max-w-sm mx-auto">
            <label htmlFor="countries"
                   className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
                {label}
            </label>
            <select id={id}
                    onChange={onChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
                {children}
            </select>
        </form>
    )
}
