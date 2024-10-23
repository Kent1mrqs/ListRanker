import React from "react";

type StylesProps = {
    children: React.ReactNode;
    className?: string,
};

export default function TemplateChip({children, className}: StylesProps) {
    return (
        <span
            style={{maxWidth: '100%', whiteSpace: 'normal', overflow: 'hidden', wordWrap: 'break-word'}}
            className="btn-sm relative rounded-full bg-gray-800/40 px-2.5 py-0.5 text-xs font-normal before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(to_bottom,theme(colors.gray.700/.15),theme(colors.gray.700/.5))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)] hover:bg-gray-800/60">
            <span className="bg-gradient-to-r from-indigo-500 to-indigo-200 bg-clip-text text-transparent">
                {children}
            </span>
        </span>
    )
}
