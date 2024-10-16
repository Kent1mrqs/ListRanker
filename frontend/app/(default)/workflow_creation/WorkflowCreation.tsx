"use client";
import ChooseList from "@/app/(default)/workflow_creation/ChooseList";
import DisplaySelection from "@/app/(default)/workflow_creation/DisplaySelection";
import CreationMethod from "@/app/(default)/workflow_creation/CreationMethod";
import {useState} from "react";
import {postData} from "@/app/api";
import RankingName from "@/app/(default)/workflow_creation/RankingName";

export const metadata = {
    title: "Home - Open PRO",
    description: "Page description",
};

export interface NewRanking {
    name: string;
    ranking_type: string;
    list_id: number;
}

const default_ranking: NewRanking = {
    name: "",
    ranking_type: "",
    list_id: 0
}

export type RankingProps = {
    setNewRanking: (newValue: (prevValue: NewRanking) => {
        list_id: number;
        name: string;
        ranking_type: string
    }) => void;
}

export default function WorkflowCreation() {
    const [error, setError] = useState<string | null>(null);
    const [newRanking, setNewRanking] = useState<NewRanking>(default_ranking)
    if (error !== null) {
        console.error(error)
        setError(null);
    }
    console.log(newRanking)

    async function saveRanking() {
        try {
            await postData<NewRanking>('rankings', newRanking).then(() => {
                setNewRanking(default_ranking)
            });
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('An unknown error occurred');
            }
        }
    }

    return (
        <>
            <ChooseList setNewRanking={setNewRanking}/>
            <DisplaySelection setNewRanking={setNewRanking}/>
            <CreationMethod setNewRanking={setNewRanking}/>
            <RankingName saveRanking={saveRanking} setNewRanking={setNewRanking}/>
        </>
    );
}
