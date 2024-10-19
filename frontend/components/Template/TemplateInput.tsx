import React from "react";

interface I {
    label?: string;
    id?: string;
    key?: number;
    type?: string;
    error?: boolean;
    placeholder?: string;
    value?: number;
    variant?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const sign = "form-input w-full";
const blue = "btn-sm bg-gradient-to-t from-indigo-600 to-indigo-500 bg-[length:100%_100%] bg-[bottom] py-[5px] text-white shadow-[inset_0px_1px_0px_0px_theme(colors.white/.16)] hover:bg-[length:100%_150%] placeholder-white/50";
const error = `${blue} border border-red-500`;

const variantsInput: { [key: string]: string } = {
    "blue": blue,
    "sign": sign,
    "error": error
};

const variantsLabels: { [key: string]: string } = {
    "blue": "block mb-2 text-sm font-medium text-gray-900 dark:text-white",
    "sign": "block text-sm font-medium text-indigo-200/65",
};

export default function TemplateInput({
                                          label,
                                          type = 'text',
                                          id,
                                          value,
                                          error = false,
                                          placeholder,
                                          onChange,
                                          onBlur,
                                          variant = 'blue'
                                      }: I) {
    return (
        <div className="mb-4">
            <label htmlFor={id} className={variantsLabels[variant]}>
                {label}
            </label>
            <input
                type={type}
                id={id}
                value={value}
                className={`${variantsInput[error ? "error" : variant]} mt-1 block w-full`}
                placeholder={placeholder}
                onChange={onChange}
                onBlur={onBlur}
                required
            />
        </div>
    );
}
