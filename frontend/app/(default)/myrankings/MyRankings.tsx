"use client";
import ChooseRanking, {EditRanking, RankingItem} from "@/app/(default)/myrankings/ChooseRanking";
import NumberedManualExchange from "@/app/(default)/myrankings/NumberedManualExchange";
import TemplatePage from "@/components/Template/TemplatePage";
import {useEffect, useState} from "react";
import {Ranking} from "@/app/(default)/mylists/ListCreation";
import {useUserContext} from "@/app/UserProvider";
import {postData} from "@/app/api";
import NumberedIntelligentDual from "@/app/(default)/myrankings/NumberedIntelligentDual";
import {useRankingsContext} from "@/app/RankingsProvider";
import {useNotification} from "@/app/NotificationProvider";
import {fetchRankings} from "@/app/(default)/myrankings/RankingsServices";

export default function MyRankings() {
    const {userId} = useUserContext();
    const {setRankings} = useRankingsContext();
    const {showNotification} = useNotification();
    const default_ranking: Ranking = {
        id: 0,
        user_id: userId,
        name: "",
        ranking_type: "numbered",
        creation_method: "manual",
        list_id: 0
    }
    const [currentRanking, setCurrentRanking] = useState<Ranking>(default_ranking)
    const [currentRankingItems, setCurrentRankingItems] = useState<RankingItem[]>([])

    useEffect(() => {
        fetchRankings(setRankings)
    }, [fetchRankings]);


    async function saveRanking(editRanking: EditRanking[], setEditRanking: (editRanking: EditRanking[]) => void) {

        try {
            await postData<EditRanking[], EditRanking[]>('ranking-items', editRanking).then(() => {
                showNotification("Ranking created", "success")

                setEditRanking([]);
                fetchRankings(setRankings);
            });
        } catch (error) {
            if (error instanceof Error) {
                showNotification(error.message, "error")
                console.error(error.message);
            } else {
                showNotification('An unknown error occurred', "error")
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
                currentRanking.creation_method === "manual" &&
                currentRankingItems[0] &&
				<NumberedManualExchange
					saveRanking={saveRanking}
					currentRankingItems={currentRankingItems}
					setCurrentRankingItems={setCurrentRankingItems}
				/>}
            {currentRanking.ranking_type === 'numbered' &&
                currentRanking.creation_method === "duels" &&
                currentRankingItems[0] &&
				<NumberedIntelligentDual
					currentRankingItems={currentRankingItems}
					ranking_id={currentRanking.id}
					setCurrentRankingItems={setCurrentRankingItems}
				/>}
        </TemplatePage>
    );
}
