"use client";
import ListSelection from "@/app/(default)/mylists/ListSelection";
import {useEffect, useState} from "react";
import {useUserContext} from "@/app/UserProvider";
import {List} from "@/app/(default)/workflow_creation/ChooseList";
import {useListsContext} from "@/app/ListsProvider";
import {fetchLists} from "@/app/(default)/mylists/ListServices";

export default function MyLists() {
    const {userId} = useUserContext();
    const [currentList, setCurrentList] = useState<List>({name: "", id: 0})
    const {setLists} = useListsContext();

    useEffect(() => {
        fetchLists(userId, setLists);
    }, [fetchLists]);

    return (
        <>
            <ListSelection currentList={currentList}
                           setCurrentList={setCurrentList}/>
        </>
    );
}
