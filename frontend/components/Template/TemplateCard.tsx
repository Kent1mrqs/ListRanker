import Image from "next/image";
import TemplateChip from "@/components/Template/TemplateChip";

interface CardProps {
    title: string;
    image: any;
    description: string;
    onClick: () => void;
}

export default function TemplateCard({title, image, description, onClick}: CardProps) {
    return (
        <div onClick={onClick}
             className="relative z-20 h-full overflow-hidden rounded-[inherit] bg-gray-950 after:absolute after:inset-0 after:bg-gradient-to-br after:from-gray-900/50 after:via-gray-800/25 after:to-gray-900/50">
            <div
                className="absolute right-6 top-6 flex h-8 w-8 items-center justify-center rounded-full border border-gray-700/50 bg-gray-800/65 text-gray-200 opacity-0 transition-opacity group-hover/card:opacity-100"
                aria-hidden="true"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={9}
                    height={8}
                    fill="none"
                >
                    <path
                        fill="#F4F4F5"
                        d="m4.92 8-.787-.763 2.733-2.68H0V3.443h6.866L4.133.767 4.92 0 9 4 4.92 8Z"
                    />
                </svg>
            </div>
            {/* Image */}
            <Image
                className="inline-flex"
                src={image}
                width={350}
                height={200}
                alt={title}
            />
            {/* Content */}
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
    )
}
