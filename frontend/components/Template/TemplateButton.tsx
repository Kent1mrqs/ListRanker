import React from "react";

const blue = "btn-sm bg-gradient-to-t from-indigo-600 text-center inline-flex items-center  to-indigo-500 bg-[length:100%_100%] bg-[bottom] py-[5px] text-white shadow-[inset_0px_1px_0px_0px_theme(colors.white/.16)] hover:bg-[length:100%_150%] max-w-[200px] w-full";
const grey = "btn-sm relative bg-gradient-to-b from-gray-800 to-gray-800/60 bg-[length:100%_100%] bg-[bottom] py-[5px] text-gray-300 before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(to_right,theme(colors.gray.800),theme(colors.gray.700),theme(colors.gray.800))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)] hover:bg-[length:100%_150%] max-w-[200px] w-full";
const outlined = "text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:outline-none font-medium rounded-lg text-sm px-5 py-[5px] text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 max-w-[200px] w-full";
const sign = "btn w-full bg-gradient-to-t from-indigo-600 to-indigo-500 bg-[length:100%_100%] bg-[bottom] text-white shadow-[inset_0px_1px_0px_0px_theme(colors.white/.16)] hover:bg-[length:100%_150%]"
const selectedAdditionalStyle = "border-2";
const error = "bg-red-50 border border-red-500 text-red-900 placeholder-red-700 text-sm rounded-lg focus:ring-red-500 dark:bg-gray-700 focus:border-red-500 block w-full p-2.5 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500"

const variants: { [key: string]: string } = {
    "blue": blue,
    "grey": grey,
    "outlined": outlined,
    "sign": sign,
    "error": error
}

type StylesProps = {
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
    onClickIcon?: () => void;
    text: String;
    variant?: keyof typeof variants;
    selected?: boolean;
    icon?: any;
};

export default function TemplateButton({
                                           onClick,
                                           text,
                                           variant = "blue",
                                           icon,
                                           onClickIcon,
                                           selected = false
                                       }: StylesProps) {
    const className = `${variants[variant]} ${selected ? selectedAdditionalStyle : ""} `;
    return (
        <>
            <button type="button"
                    onClick={onClick}
                    className={className}
            >
                {text}
                {selected ? <div
                    onClick={(event) => {
                        event.stopPropagation();
                        if (onClickIcon) {
                            onClickIcon()
                        }
                    }}
                    // className="group/button relative transform overflow-hidden cursor-pointer flex items-center justify-center rounded-full border border-gray-700/50 bg-gray-800/65 text-gray-200 opacity-0 transition-opacity duration-300 group-hover:opacity-100 h-6 w-6"
                    aria-hidden="true"
                >
                    {icon}
                </div> : null}
            </button>
        </>
    )
}
