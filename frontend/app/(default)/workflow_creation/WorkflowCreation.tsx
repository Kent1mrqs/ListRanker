"use client";
import ChooseList from "@/app/(default)/workflow_creation/ChooseList";
import DisplaySelection from "@/app/(default)/workflow_creation/DisplaySelection";
import CreationMethod from "@/app/(default)/workflow_creation/CreationMethod";
import {useState} from "react";
import {postData} from "@/app/api";
import RankingName from "@/app/(default)/workflow_creation/RankingName";
import {useUserContext} from "@/app/UserProvider";
import {useRouter} from "next/navigation";

export const metadata = {
    title: "Home - Open PRO",
    description: "Page description",
};

export interface NewRanking {
    user_id: number | null;
    name: string;
    ranking_type: string;
    list_id: number;
}


export type RankingProps = {
    setNewRanking: (newValue: (prevValue: NewRanking) => {
        user_id: number | null;
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
            <ChooseList setNewRanking={setNewRanking}/>
            <DisplaySelection setNewRanking={setNewRanking}/>
            <CreationMethod setNewRanking={setNewRanking}/>
            <RankingName newRanking={newRanking} saveRanking={saveRanking} setNewRanking={setNewRanking}/>
        </>
    );
}
