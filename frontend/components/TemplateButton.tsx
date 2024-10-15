import React from "react";
import Link from "next/link";

type StylesProps = {
    route: String;
};

export default function TemplateButton({route}: StylesProps) {
    return (
        <Link
            href={"/" + route.toLowerCase()}
            className="btn-sm bg-gradient-to-t from-indigo-600 to-indigo-500 bg-[length:100%_100%] bg-[bottom] py-[5px] text-white shadow-[inset_0px_1px_0px_0px_theme(colors.white/.16)] hover:bg-[length:100%_150%]"
        >
            {route}
        </Link>
    )
}
