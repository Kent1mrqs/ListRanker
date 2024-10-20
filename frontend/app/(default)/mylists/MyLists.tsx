"use client";
import ListCreation from "@/app/(default)/mylists/ListCreation";
import ListSelection from "@/app/(default)/mylists/ListSelection";
import {useEffect, useState} from "react";
import {useUserContext} from "@/app/UserProvider";
import {List} from "@/app/(default)/workflow_creation/ChooseList";
import {useListsContext} from "@/app/ListsProvider";
import {fetchLists} from "@/app/(default)/mylists/ListServices";

export default function MyLists() {
    const {userId} = useUserContext();
    const [currentList, setCurrentList] = useState<List>({name: "", id: 0})
    const [creationMode, setCreationMode] = useState<boolean>(false)
    const {setLists} = useListsContext();

    useEffect(() => {
        fetchLists(userId, setLists);
    }, [fetchLists]);

    return (
        <>
            <ListSelection creationMode={creationMode}
                           setCreationMode={setCreationMode}
                           currentList={currentList}
                           setCurrentList={setCurrentList}/>
            {creationMode && <ListCreation/>}
        </>
    );
}
