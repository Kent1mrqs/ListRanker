"use client";
import TemplatePage from "@/components/Template/TemplatePage";
import {NewRanking, RankingProps} from "@/app/(default)/workflow_creation/WorkflowCreation";
import ListSelection from "@/app/(default)/mylists/ListSelection";
import ListCreation, {Lists} from "@/app/(default)/mylists/ListCreation";
import {useCallback, useState} from "react";
import {fetchData} from "@/app/api";
import {useUserContext} from "@/app/UserProvider";

export interface List {
    name: string;
    id: number;
}

export default function ChooseList({setNewRanking}: RankingProps) {
    const {userId} = useUserContext();
    const [currentList, setCurrentList] = useState<List>({name: '', id: 0})
    const [creationMode, setCreationMode] = useState<boolean>(false)
    const [lists, setLists] = useState<Lists>([]);
    const fetchLists = useCallback(() => {
        fetchData<Lists>('lists/' + userId)
            .then(result => setLists(result))
            .catch(err => console.error(err.message));
    }, []);

    function SelectList(list: List) {
        setCurrentList(list);
        setNewRanking((prevValue: NewRanking) => {
            return {
                ...prevValue,
                list_id: list.id,
            }
        })
    }

    return (
        <TemplatePage
            title="Step 1 : Choose a list"
            description="Select a list to base your ranking on. Choose from existing options or create a new list."
        >
            <ListSelection lists={lists}
                           creationMode={creationMode}
                           setCreationMode={setCreationMode}
                           fetchLists={fetchLists}
                           currentList={currentList.id}
                           setCurrentList={SelectList}/>
            {creationMode && <ListCreation fetchLists={fetchLists}/>}
        </TemplatePage>
    );
}
