"use client";
import TemplatePage from "@/components/Template/TemplatePage";
import {NewRanking, RankingProps} from "@/app/(default)/workflow_creation/WorkflowCreation";
import ListSelection from "@/app/(default)/workflow_creation/ListSelection";
import ListCreation, {Lists} from "@/app/(default)/mylists/ListCreation";
import {useCallback, useState} from "react";
import {fetchData} from "@/app/api";

export default function ChooseList({setNewRanking}: RankingProps) {
    const [error, setError] = useState<string | null>(null);
    const [currentListId, setCurrentListId] = useState<number>(0)
    const [lists, setLists] = useState<Lists>([]);
    const fetchLists = useCallback(() => {
        fetchData<Lists>('lists', setLists).catch(err => setError(err.message));
    }, []);

    function SelectList(id: number) {
        setCurrentListId(id);
        setNewRanking((prevValue: NewRanking) => {
            return {
                ...prevValue,
                list_id: id,
            }
        })
    }

    return (
        <TemplatePage
            title="Step 1 : Choose a list"
            description="Select a list to base your ranking on. Choose from existing options or create a new list."
        >
            <ListSelection lists={lists}
                           fetchLists={fetchLists}
                           currentListId={currentListId}
                           setCurrentListId={SelectList}/>
            {currentListId === -1 && <ListCreation fetchLists={fetchLists}/>}
        </TemplatePage>
    );
}
