"use client";
import ChooseRanking, {EditRanking, RankingItem} from "@/app/(default)/myrankings/ChooseRanking";
import RankingMaker from "@/app/(default)/myrankings/RankingMaker";
import TemplatePage from "@/components/Template/TemplatePage";
import {useCallback, useEffect, useState} from "react";
import {Ranking, Rankings} from "@/app/(default)/mylists/ListCreation";
import {useUserContext} from "@/app/UserProvider";
import {fetchData, postData} from "@/app/api";

export default function MyRankings() {
    const {userId} = useUserContext();
    const default_ranking: Ranking = {
        id: 0,
        user_id: userId,
        name: "",
        ranking_type: "",
        list_id: 0
    }
    const [error, setError] = useState<string | null>(null);
    if (error !== null) {
        console.error(error)
        setError(null);
    }
    const [rankings, setRankings] = useState<Rankings>([]);
    const [currentRanking, setCurrentRanking] = useState<Ranking>(default_ranking)
    const [currentRankingItems, setCurrentRankingItems] = useState<RankingItem[]>([])
    const fetchRankings = useCallback(() => {
        fetchData<Rankings>('rankings/' + userId, setRankings).catch(err => setError(err.message));
    }, []);
    useEffect(() => {
        fetchRankings();
    }, [fetchRankings]);


    async function saveRanking(editRanking: EditRanking[], setEditRanking: (editRanking: EditRanking[]) => void) {
        try {
            await postData<EditRanking[]>('ranking-items', editRanking).then(() => {
                setEditRanking([]);
                fetchRankings();
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
        <TemplatePage
            title="My Rankings"
            description=" "
        >
            <ChooseRanking
                rankings={rankings}
                currentRankingItems={currentRankingItems}
                setCurrentRankingItems={setCurrentRankingItems}
                currentRanking={currentRanking}
                setCurrentRanking={setCurrentRanking}
            />
            {currentRanking.id !== 0 && <RankingMaker
				saveRanking={saveRanking}
				currentRankingItems={currentRankingItems}
				setCurrentRankingItems={setCurrentRankingItems}
			/>}
        </TemplatePage>
    );
}
