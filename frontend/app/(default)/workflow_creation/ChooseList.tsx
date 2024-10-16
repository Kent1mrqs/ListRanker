"use client";
import TemplatePage from "@/components/Template/TemplatePage";
import MyLists from "@/app/(default)/mylists/MyLists";

export const metadata = {
    title: "Home - Open PRO",
    description: "Page description",
};


export default function ChooseList() {
    return (
        <TemplatePage
            title="Step 1 : Choose a list"
            description="Select a list to base your ranking on. Choose from existing options or create a new list."
        >
            <MyLists/>
        </TemplatePage>
    );
}
