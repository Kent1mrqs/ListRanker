import Image from "next/image";
import TemplateChip from "@/components/Template/TemplateChip";
import React from "react";
import TemplateInput from "@/components/Template/TemplateInput";

interface CardProps {
    title: string;
    image: any;
    selected?: boolean;
    disabled?: boolean;
    description?: string;
    onClick?: () => void;
    variant?: "duel" | "basic" | "item";
}

const baseCardStyle = "group/card relative h-full overflow-hidden rounded-2xl bg-gray-800 p-px before:pointer-events-none before:absolute before:-left-40 before:-top-40 before:z-10 before:h-80 before:w-80 before:translate-x-[var(--mouse-x)] before:translate-y-[var(--mouse-y)] before:rounded-full before:bg-indigo-500/80 before:opacity-0 before:blur-3xl before:transition-opacity before:duration-500 after:pointer-events-none after:absolute after:-left-48 after:-top-48 after:z-30 after:h-64 after:w-64 after:translate-x-[var(--mouse-x)] after:translate-y-[var(--mouse-y)] after:rounded-full after:bg-indigo-500 after:opacity-0 after:blur-3xl after:transition-opacity after:duration-500 after:hover:opacity-20 before:group-hover:opacity-100";
const selectedCardAdditionalStyle = "border-4 border-indigo-500 bg-gray-700";
const disabledCardStyle = "opacity-50 cursor-not-allowed bg-gray-700 rounded-2xl hover:opacity-50 before:opacity-0 after:opacity-0";
const duelStyle = `${baseCardStyle} w-80 h-96 cursor-pointer`
const item_image = "group/card relative h-full overflow-hidden rounded-2xl bg-gray-800 p-px before:pointer-events-none before:absolute before:-left-40 before:-top-40 before:z-10 before:h-80 before:w-80 before:translate-x-[var(--mouse-x)] before:translate-y-[var(--mouse-y)] before:rounded-full before:bg-indigo-500/80 before:opacity-0 before:blur-3xl before:transition-opacity before:duration-500 after:pointer-events-none after:absolute after:-left-48 after:-top-48 after:z-30 after:h-64 after:w-64 after:translate-x-[var(--mouse-x)] after:translate-y-[var(--mouse-y)] after:rounded-full after:bg-indigo-500 after:opacity-0 after:blur-3xl after:transition-opacity after:duration-500 after:hover:opacity-20 before:group-hover:opacity-100";

export default function TemplateCard({
                                         title,
                                         image,
                                         description = "",
                                         onClick,
                                         disabled = false,
                                         selected = false,
                                         variant = "basic",
                                     }: CardProps) {
    const basicCardStyle = `${baseCardStyle} ${selected && !disabled ? selectedCardAdditionalStyle : ""}${disabled ? disabledCardStyle : " cursor-pointer"} `;

    const cardVariants = {
        duel: duelStyle,
        basic: basicCardStyle,
        item: item_image
    }
    return (
        <div
            onClick={() => {
                if (!disabled && onClick) {
                    onClick()
                }
            }}
            className={cardVariants[variant]}
        >
            <div
                className="relative z-20 h-full overflow-hidden rounded-[inherit] bg-gray-950 after:absolute after:bg-gradient-to-br after:from-gray-900/50 after:via-gray-800/25 after:to-gray-900/50"
            >
                {/* <div
                    onClick={(event) => {
                        event.stopPropagation(); // Empêche la propagation du clic au parent
                        console.log("edit");
                    }}
                    className="absolute cursor-pointer right-3 bottom-12 flex h-8 w-8 items-center justify-center rounded-full border border-gray-700/50 bg-gray-800/65 text-gray-200 opacity-0 transition-opacity group-hover/card:opacity-100"
                    aria-hidden="true"
                >
                    <IconEdit/>
                </div>*/}
                <Image
                    className="inline-flex"
                    src={image}
                    width={350}
                    height={200}
                    alt={title}
                />
                <div className="p-6">
                    <div className="mb-3">
                        <TemplateChip>
                            {title}
                        </TemplateChip>
                    </div>
                    <p className="text-indigo-200/65">
                        {description}
                    </p>
                </div>
            </div>

        </div>
    )
}

export function TemplateEditionCard({
                                        title,
                                        image,
                                    }: CardProps) {
    return (
        <div className={item_image}
        >
            <div
                className="relative z-20 h-full overflow-hidden rounded-[inherit] bg-gray-950 after:absolute after:bg-gradient-to-br after:from-gray-900/50 after:via-gray-800/25 after:to-gray-900/50"
            >
                <Image
                    className="inline-flex cursor-pointer"
                    src={image}
                    width={350}
                    height={200}
                    alt={title}
                />
                <div className="p-6">
                    <div className="mb-3">
                        <TemplateInput placeholder={title}/>
                    </div>
                </div>
            </div>

        </div>
    )
}

export function TemplateEditionItemCardOrChip({
                                                  title,
                                                  image,
                                              }: CardProps) {
    return (
        <>
            {image ?
                <TemplateEditionCard variant="item" title={title} image={image}/> :
                <TemplateInput/>
            }
        </>
    )
}

export function TemplateItemCardOrChip({
                                           title,
                                           image,
                                       }: CardProps) {
    return (
        <>
            {image ?
                <TemplateCard variant="item" title={title} image={image}/> :
                <TemplateChip>{title}</TemplateChip>
            }
        </>
    )
}

export function TemplateDuelCard({
                                     title,
                                     image,
                                     onClick
                                 }: CardProps) {

    return (
        <div className={duelStyle}
             onClick={() => {
                 if (onClick) {
                     onClick()
                 }
             }}
        >
            <div
                className="relative z-20 h-full overflow-hidden rounded-[inherit] bg-gray-950 after:absolute after:bg-gradient-to-br after:from-gray-900/50 after:via-gray-800/25 after:to-gray-900/50"
            >
                <Image
                    className="inline-flex"
                    src={image}
                    width={350}
                    height={200}
                    alt={title}
                />
                <div className="p-6">
                    <div className="mb-3">
                        <TemplateChip>
                            {title}
                        </TemplateChip>
                    </div>
                </div>
            </div>
        </div>
    )
}