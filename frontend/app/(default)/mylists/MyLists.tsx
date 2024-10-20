"use client";
import ListCreation, {Lists} from "@/app/(default)/mylists/ListCreation";
import ListSelection from "@/app/(default)/mylists/ListSelection";
import {useCallback, useState} from "react";
import {fetchData} from "@/app/api";
import {useUserContext} from "@/app/UserProvider";

export default function MyLists() {
    const {userId} = useUserContext();
    const [currentListId, setCurrentListId] = useState<number>(0)
    const [creationMode, setCreationMode] = useState<boolean>(false)
    const [lists, setLists] = useState<Lists>([]);
    const fetchLists = useCallback(() => {
        fetchData<Lists>('lists/' + userId)
            .then(result => setLists(result))
            .catch(err => console.error(err.message));
    }, []);

    return (
        <>
            <ListSelection lists={lists}
                           creationMode={creationMode}
                           setCreationMode={setCreationMode}
                           fetchLists={fetchLists}
                           currentListId={currentListId}
                           setCurrentListId={setCurrentListId}/>
            {creationMode && <ListCreation fetchLists={fetchLists}/>}
        </>
    );
}
