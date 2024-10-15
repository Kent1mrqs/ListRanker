"use client";

import React from "react";
import TemplateTitle from "@/components/Template/TemplateTitle";

export const metadata = {
    title: "Home - Open PRO",
    description: "Page description",
};

type StylesProps = {
    title: string;
    description: string;
    children: React.ReactNode;
};

export default function TemplatePage({title, description, children}: StylesProps) {

    return (
        <section>
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
                <div className="pb-12 md:pb-20">
                    <TemplateTitle
                        title={title}
                        description={description}
                    />
                    {children}
                </div>
            </div>
        </section>
    );
}

