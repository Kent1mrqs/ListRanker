"use client";
import TemplatePage from "@/components/Template/TemplatePage";
import ListSelection from "@/app/(default)/mylists/ListSelection";
import {useState} from "react";
import {List} from "@/components/Models/ModelsList";
import {NewRanking, RankingProps} from "@/components/Models/ModelRankings";


export default function ChooseList({setNewRanking}: RankingProps) {
    const [currentList, setCurrentList] = useState<List>({name: '', id: 0})

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
            <ListSelection currentList={currentList}
                           setCurrentList={SelectList}/>
        </TemplatePage>
    );
}
