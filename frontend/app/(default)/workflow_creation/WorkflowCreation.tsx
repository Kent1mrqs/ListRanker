"use client";
import ChooseList from "@/app/(default)/workflow_creation/ChooseList";
import DisplaySelection from "@/app/(default)/workflow_creation/DisplaySelection";
import CreationMethod from "@/app/(default)/workflow_creation/CreationMethod";
import {useEffect, useState} from "react";
import {postData} from "@/app/api";
import RankingName from "@/app/(default)/workflow_creation/RankingName";
import {useUserContext} from "@/app/UserProvider";
import {fetchLists} from "@/app/(default)/mylists/ListServices";
import {useListsContext} from "@/app/ListsProvider";
import {useNotification} from "@/app/NotificationProvider";

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
    const {setLists} = useListsContext();
    const {showNotification} = useNotification();
    const {userId} = useUserContext();
    const default_ranking: NewRanking = {
        user_id: userId,
        creation_method: "",
        name: "",
        ranking_type: "",
        list_id: 0
    }
    const [newRanking, setNewRanking] = useState<NewRanking>(default_ranking)
    useEffect(() => {
        fetchLists(setLists);
    }, [fetchLists]);

    async function saveRanking() {
        try {
            await postData<NewRanking, NewRanking>('rankings', newRanking).then(() => {
                showNotification("Ranking created", "success")
                setNewRanking(default_ranking)
            });
        } catch (error) {
            if (error instanceof Error) {
                showNotification(error.message, "error")
            } else {
                showNotification('An unknown error occurred', "error")
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
