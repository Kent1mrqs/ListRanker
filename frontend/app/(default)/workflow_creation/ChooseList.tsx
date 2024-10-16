"use client";
import {useCallback, useEffect, useState} from "react";
import {fetchData} from "@/app/api";
import ListCreation, {Lists} from "@/app/(default)/mylists/ListCreation";
import TemplatePage from "@/components/Template/TemplatePage";
import ListSelection from "@/app/(default)/workflow_creation/ListSelection";

export const metadata = {
    title: "Home - Open PRO",
    description: "Page description",
};


export default function ChooseList() {
    const [currentListId, setCurrentListId] = useState<number>(0)
    const [error, setError] = useState<string | null>(null);
    // const [currentItems, setCurrentItems] = useState<Item[]>([])
    const [lists, setLists] = useState<Lists>([]);
    const fetchLists = useCallback(() => {
        fetchData<Lists>('lists', setLists).catch(err => setError(err.message));
    }, []);
    useEffect(() => {
        fetchLists();
    }, [fetchLists]);
    /*    const fetchItems = useCallback((list_id: number) => {
            fetchData<Lists>('items/' + list_id, setCurrentItems).catch(err => setError(err.message));
        }, []);*/
    console.log(lists)
    if (error !== null) {
        console.error(error)
    }
    return (
        <TemplatePage
            title="Step 1 : Choose a list"
            description="Select a list to base your ranking on. Choose from existing options or create a new list."
        >
            <ListSelection currentListId={currentListId} setCurrentListId={setCurrentListId}/>
            {currentListId === -1 && <ListCreation/>}
        </TemplatePage>
    );
}
