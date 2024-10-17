"use client";
import ListCreation, {Lists} from "@/app/(default)/mylists/ListCreation";
import ListSelection from "@/app/(default)/workflow_creation/ListSelection";
import {useCallback, useState} from "react";
import {fetchData} from "@/app/api";
import {useUserContext} from "@/app/UserProvider";

export const metadata = {
    title: "Home - Open PRO",
    description: "Page description",
};


export default function MyLists() {
    const {userId} = useUserContext();
    const [error, setError] = useState<string | null>(null);
    const [currentListId, setCurrentListId] = useState<number>(0)
    const [lists, setLists] = useState<Lists>([]);
    const fetchLists = useCallback(() => {
        fetchData<Lists>('lists/' + userId, setLists).catch(err => setError(err.message));
    }, []);

    console.error(error)
    return (
        <>
            <ListSelection lists={lists}
                           fetchLists={fetchLists}
                           currentListId={currentListId}
                           setCurrentListId={setCurrentListId}/>
            {currentListId === -1 && <ListCreation fetchLists={fetchLists}/>}
        </>
    );
}
