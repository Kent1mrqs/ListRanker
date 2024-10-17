"use client";
import ChooseList from "@/app/(default)/workflow_creation/ChooseList";
import DisplaySelection from "@/app/(default)/workflow_creation/DisplaySelection";
import CreationMethod from "@/app/(default)/workflow_creation/CreationMethod";
import {useState} from "react";
import {postData} from "@/app/api";
import RankingName from "@/app/(default)/workflow_creation/RankingName";
import {useUserContext} from "@/app/UserProvider";
import {useRouter} from "next/navigation";

export interface NewRanking {
    method_creation: string;
    user_id: number | null;
    name: string;
    ranking_type: string;
    list_id: number;
}


export type RankingProps = {
    newRanking: {
        method_creation: string;
        user_id: number | null;
        list_id: number;
        name: string;
        ranking_type: string
    },
    setNewRanking: (newValue: (prevValue: NewRanking) => {
        user_id: number | null;
        method_creation: string;
        list_id: number;
        name: string;
        ranking_type: string
    }) => void;
}

export default function WorkflowCreation() {
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const {userId} = useUserContext();
    console.log("userId", userId)
    const default_ranking: NewRanking = {
        user_id: userId,
        method_creation: "",
        name: "",
        ranking_type: "",
        list_id: 0
    }
    const [newRanking, setNewRanking] = useState<NewRanking>(default_ranking)
    if (error !== null) {
        console.error(error)
        setError(null);
    }

    async function saveRanking() {
        try {
            await postData<NewRanking>('rankings', newRanking).then(() => {
                setNewRanking(default_ranking)
                router.push("/myrankings");
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
            <ChooseList newRanking={newRanking} setNewRanking={setNewRanking}/>
            <DisplaySelection newRanking={newRanking} setNewRanking={setNewRanking}/>
            <CreationMethod newRanking={newRanking} setNewRanking={setNewRanking}/>
            <RankingName newRanking={newRanking} saveRanking={saveRanking} setNewRanking={setNewRanking}/>
        </>
    );
}
