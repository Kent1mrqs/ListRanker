"use client";
import ChooseList from "@/app/(default)/workflow_creation/ChooseList";
import DisplaySelection from "@/app/(default)/workflow_creation/DisplaySelection";
import CreationMethod from "@/app/(default)/workflow_creation/CreationMethod";
import {useState} from "react";
import {postData} from "@/app/api";
import RankingName from "@/app/(default)/workflow_creation/RankingName";
import {useUserContext} from "@/app/UserProvider";

export interface NewRanking {
    creation_method: string;
    user_id: number | null;
    name: string;
    ranking_type: string;
    list_id: number;
}


export type RankingProps = {
    newRanking: {
        creation_method: string;
        user_id: number | null;
        list_id: number;
        name: string;
        ranking_type: string
    },
    setNewRanking: (newValue: (prevValue: NewRanking) => {
        user_id: number | null;
        creation_method: string;
        list_id: number;
        name: string;
        ranking_type: string
    }) => void;
}

export default function WorkflowCreation() {
    const {userId} = useUserContext();
    const default_ranking: NewRanking = {
        user_id: userId,
        creation_method: "",
        name: "",
        ranking_type: "",
        list_id: 0
    }
    const [newRanking, setNewRanking] = useState<NewRanking>(default_ranking)

    async function saveRanking() {
        console.log(newRanking)
        try {
            await postData<NewRanking, NewRanking>('rankings', newRanking).then(() => {
                setNewRanking(default_ranking)
            });
        } catch (error) {
            if (error instanceof Error) {
                console.error(error.message);
            } else {
                console.error('An unknown error occurred');
            }
        }
    }

    return (
        <>
            <ChooseList newRanking={newRanking} setNewRanking={setNewRanking}/>
            <DisplaySelection newRanking={newRanking} setNewRanking={setNewRanking}/>
            <CreationMethod newRanking={newRanking} setNewRanking={setNewRanking}/>
            <RankingName newRanking={newRanking} saveRanking={saveRanking} setNewRanking={setNewRanking}/>
        </>
    );
}
