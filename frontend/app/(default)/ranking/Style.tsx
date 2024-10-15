"use client";

import React from "react";
import TemplateTitle from "@/components/Template/TemplateTitle";

export const metadata = {
    title: "Home - Open PRO",
    description: "Page description",
};

type StylesProps = {
    children: React.ReactNode;
};

export default function Styles({children}: StylesProps) {

    return (
        <section>
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
                <div className="pb-12 md:pb-20">
                    <TemplateTitle
                        title='Lists'
                        description="Simple and elegant interface to start collaborating with your team
                            in minutes. It seamlessly integrates with your code and your
                            favorite programming languages."
                    />
                    {children}
                </div>
            </div>
        </section>
    );
}

