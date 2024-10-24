"use client";
import TemplatePage from "@/components/Template/TemplatePage";
import {NewRanking, RankingProps} from "@/app/(default)/workflow_creation/WorkflowCreation";
import ListSelection from "@/app/(default)/mylists/ListSelection";
import {useState} from "react";

export interface List {
    name: string;
    id: number;
}

export default function ChooseList({setNewRanking}: RankingProps) {
    const [currentList, setCurrentList] = useState<List>({name: '', id: 0})
    const [creationMode, setCreationMode] = useState<boolean>(false)


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
            id="step1"
            title="Step 1 : Choose a list"
            description="Select a list to base your ranking on. Choose from existing options or create a new list."
        >
            <ListSelection creationMode={creationMode}
                           setCreationMode={setCreationMode}
                           currentList={currentList}
                           setCurrentList={SelectList}/>
        </TemplatePage>
    );
}
