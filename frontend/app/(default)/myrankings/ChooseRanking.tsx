"use client";
import React, {useCallback, useEffect, useState} from "react";
import {fetchData} from "@/app/api";
import {Ranking, Rankings} from "@/app/(default)/mylists/ListCreation";
import TemplatePage from "@/components/Template/TemplatePage";
import Spotlight from "@/components/spotlight";
import TemplateButton from "@/components/Template/TemplateButton";
import {useUserContext} from "@/app/UserProvider";
import {useRouter} from "next/navigation";
import {Stack, Typography} from "@mui/material";

export const metadata = {
    title: "Home - Open PRO",
    description: "Page description",
};

interface rankprops {
    currentRanking: Ranking;
    setCurrentRanking: (ranking: Ranking) => void;
}

interface RankingItem {
    id: number,
    ranking_id: number,
    item_id: number,
    rank: number,
    name: string,
}


export default function ChooseRanking() {
    const {userId} = useUserContext();
    const default_ranking: Ranking = {
        id: 0,
        user_id: userId,
        name: "",
        ranking_type: "",
        list_id: 0
    }
    const router = useRouter();
    const [currentRanking, setCurrentRanking] = useState<Ranking>(default_ranking)
    const [error, setError] = useState<string | null>(null);
    const [rankings, setRankings] = useState<Rankings>([]);
    const fetchLists = useCallback(() => {
        fetchData<Rankings>('rankings/' + userId, setRankings).catch(err => setError(err.message));
    }, []);
    useEffect(() => {
        fetchLists();
    }, [fetchLists]);

    if (error !== null) {
        console.error(error)
        setError(null);
    }
    const [currentRankingItems, setCurrentRankingItems] = useState<RankingItem[]>([])

    function selectRanking(ranking: Ranking) {
        console.log(currentRanking.id, ranking.id);
        if (currentRanking.id === ranking.id) {
            setCurrentRanking({...ranking, id: 0})
        } else {
            setCurrentRanking({...ranking, id: Number(ranking.id)})
            fetchData('ranking-items/' + ranking.id, setCurrentRankingItems).then(() => console.log('currentItems', currentRankingItems))
        }
    }

    console.log(currentRankingItems)
    return (
        <TemplatePage
            title="My Rankings"
            description=" "
        >
            <Spotlight
                className="group mx-auto grid max-w-sm items-start gap-6 lg:max-w-none lg:grid-cols-6"
            >
                {rankings.map((ra, index) => (
                    <TemplateButton key={index}
                                    text={ra.name}
                                    variant={ra.id === currentRanking.id ? "grey" : "blue"}
                                    onClick={() => selectRanking(ra)}
                    />
                ))}
                <TemplateButton text='New Ranking'
                                variant='outlined'
                                onClick={() => router.push('/')}
                />
            </Spotlight>
            {currentRanking.id !== 0 && <Stack spacing={1} justifyContent='center'>
				<Spotlight
					className="group mx-auto grid max-w-sm items-start gap-6 lg:max-w-none lg:grid-cols-6"
				>
                    {currentRankingItems?.map((el, index) => (
                        <div className="mx-auto max-w-3xl pb-12 text-center md:pb-20">
                            <Typography justifyContent='center' key={index}>{el.name}</Typography>
                            <Typography justifyContent='center' key={index}>{el.rank}</Typography>
                        </div>
                    ))}
				</Spotlight>
			</Stack>}
        </TemplatePage>
    );
}
