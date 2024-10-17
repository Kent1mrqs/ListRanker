import Image from "next/image";
import TemplateChip from "@/components/Template/TemplateChip";

interface CardProps {
    title: string;
    image: any;
    selected: boolean;
    description: string;
    onClick: () => void;
}

const baseCardStyle = "group/card relative h-full overflow-hidden rounded-2xl bg-gray-800 p-px before:pointer-events-none before:absolute before:-left-40 before:-top-40 before:z-10 before:h-80 before:w-80 before:translate-x-[var(--mouse-x)] before:translate-y-[var(--mouse-y)] before:rounded-full before:bg-indigo-500/80 before:opacity-0 before:blur-3xl before:transition-opacity before:duration-500 after:pointer-events-none after:absolute after:-left-48 after:-top-48 after:z-30 after:h-64 after:w-64 after:translate-x-[var(--mouse-x)] after:translate-y-[var(--mouse-y)] after:rounded-full after:bg-indigo-500 after:opacity-0 after:blur-3xl after:transition-opacity after:duration-500 after:hover:opacity-20 before:group-hover:opacity-100";
const selectedCardAdditionalStyle = "border-4 border-indigo-500 bg-gray-700";

export default function TemplateCard({title, image, description, onClick, selected = false}: CardProps) {
    const cardStyle = `${baseCardStyle} ${selected ? selectedCardAdditionalStyle : ""}`;

    return (
        <div
            onClick={onClick}
            className={cardStyle}
        >
            <div onClick={onClick}
                 className="relative z-20 h-full overflow-hidden rounded-[inherit] bg-gray-950 after:absolute after:inset-0 after:bg-gradient-to-br after:from-gray-900/50 after:via-gray-800/25 after:to-gray-900/50">
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
