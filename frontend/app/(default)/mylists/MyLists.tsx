"use client";
import ListCreation from "@/app/(default)/mylists/ListCreation";
import ListSelection from "@/app/(default)/workflow_creation/ListSelection";
import {useState} from "react";

export const metadata = {
    title: "Home - Open PRO",
    description: "Page description",
};


export default function MyLists() {
    const [currentListId, setCurrentListId] = useState<number>(0)
    return (
        <>
            <ListSelection currentListId={currentListId} setCurrentListId={setCurrentListId}/>
            {currentListId === -1 && <ListCreation/>}
        </>
    );
}
