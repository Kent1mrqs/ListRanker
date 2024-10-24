import React from "react";

interface TextAreaProps {
    id: string;
    placeholder?: string;
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onBlur?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    rows?: number;
}

const blue = "w-full btn-sm bg-gradient-to-t from-indigo-600 to-indigo-500 bg-[length:100%_100%] bg-[bottom] py-[5px] text-white shadow-[inset_0px_1px_0px_0px_theme(colors.white/.16)] hover:bg-[length:100%_150%] placeholder-white/50";

export default function TemplateTextArea({id, placeholder, rows = 4, onBlur, onChange}: TextAreaProps) {
    return (
        <div className="w-full">
            <textarea
                id={id}
                className={blue}
                placeholder={placeholder}
                onChange={onChange}
                onBlur={onBlur}
                rows={rows}
                required
            />
        </div>
    );
}
