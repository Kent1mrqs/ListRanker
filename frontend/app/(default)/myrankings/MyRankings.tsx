"use client";
import ChooseRanking, {EditRanking, RankingItem} from "@/app/(default)/myrankings/ChooseRanking";
import NumberedManualExchange from "@/app/(default)/myrankings/NumberedManualExchange";
import TemplatePage from "@/components/Template/TemplatePage";
import {useCallback, useEffect, useState} from "react";
import {Ranking, Rankings} from "@/app/(default)/mylists/ListCreation";
import {useUserContext} from "@/app/UserProvider";
import {fetchData, postData} from "@/app/api";
import NumberedIntelligentDual from "@/app/(default)/myrankings/NumberedIntelligentDual";
import {useRankingsContext} from "@/app/RankingsProvider";

export default function MyRankings() {
    const {userId} = useUserContext();
    const {setRankings} = useRankingsContext();
    const default_ranking: Ranking = {
        id: 0,
        user_id: userId,
        name: "",
        ranking_type: "numbered",
        creation_method: "manual_exchange",
        list_id: 0
    }
    const [currentRanking, setCurrentRanking] = useState<Ranking>(default_ranking)
    const [currentRankingItems, setCurrentRankingItems] = useState<RankingItem[]>([])
    const fetchRankings = useCallback(() => {
        fetchData<Rankings>('rankings/' + userId)
            .then(result => setRankings(result))
            .catch(err => console.error(err.message));
    }, []);
    useEffect(() => {
        fetchRankings();
    }, [fetchRankings]);


    async function saveRanking(editRanking: EditRanking[], setEditRanking: (editRanking: EditRanking[]) => void) {

        try {
            await postData<EditRanking[], EditRanking[]>('ranking-items', editRanking).then(() => {
                setEditRanking([]);
                fetchRankings();
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
        <TemplatePage
            title="My Rankings"
            description=" "
        >
            <ChooseRanking
                setCurrentRankingItems={setCurrentRankingItems}
                currentRanking={currentRanking}
                setCurrentRanking={setCurrentRanking}
            />
            {currentRanking.ranking_type === 'numbered' &&
                currentRanking.creation_method === "manual_exchange" &&
                currentRankingItems[0] &&
				<NumberedManualExchange
					saveRanking={saveRanking}
					currentRankingItems={currentRankingItems}
					setCurrentRankingItems={setCurrentRankingItems}
				/>}
            {currentRanking.ranking_type === 'numbered' &&
                currentRanking.creation_method === "intelligent_dual" &&
                currentRankingItems[0] &&
				<NumberedIntelligentDual
					currentRankingItems={currentRankingItems}
					ranking_id={currentRanking.id}
					setCurrentRankingItems={setCurrentRankingItems}
				/>}
        </TemplatePage>
    );
}
