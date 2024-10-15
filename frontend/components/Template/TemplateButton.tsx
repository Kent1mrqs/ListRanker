import React from "react";
import Link from "next/link";

type StylesProps = {
    route: String;
    text: String;
    variant: keyof typeof variants;
};
const blue = "btn-sm bg-gradient-to-t from-indigo-600 to-indigo-500 bg-[length:100%_100%] bg-[bottom] py-[5px] text-white shadow-[inset_0px_1px_0px_0px_theme(colors.white/.16)] hover:bg-[length:100%_150%]"
const grey = "btn-sm relative bg-gradient-to-b from-gray-800 to-gray-800/60 bg-[length:100%_100%] bg-[bottom] py-[5px] text-gray-300 before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(to_right,theme(colors.gray.800),theme(colors.gray.700),theme(colors.gray.800))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)] hover:bg-[length:100%_150%]"

const variants: { [key: string]: string } = {
    "blue": blue,
    "grey": grey,
}

export default function TemplateButton({route, text, variant}: StylesProps) {
    return (
        <Link
            href={"/" + route.toLowerCase()}
            className={variants[variant]}
        >
            {text}
        </Link>
    )
}
