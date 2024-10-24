"use client";

import React from "react";
import TemplateTitle from "@/components/Template/TemplateTitle";

export const metadata = {
    title: "List Ranker -Open PRO",
    description: "Page description",
};

type StylesProps = {
    id?: string;
    title: string;
    description: string;
    children: React.ReactNode;
};

export default function TemplatePage({id, title, description, children}: StylesProps) {

    return (
        <section id={id}>
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

