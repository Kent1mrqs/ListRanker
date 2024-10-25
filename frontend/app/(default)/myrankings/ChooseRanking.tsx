"use client";
import React from "react";
import {fetchData} from "@/app/api";
import Spotlight from "@/components/spotlight";
import TemplateButton from "@/components/Template/TemplateButton";
import {useRouter} from "next/navigation";
import {useUserContext} from "@/app/UserProvider";
import {useRankingsContext} from "@/app/RankingsProvider";
import {ChooseRankingProps, RankingItem} from "@/components/Models/ModelRankings";
import {Ranking} from "@/components/Models/ModelsItems";

export default function ChooseRanking({
                                          currentRanking,
                                          setCurrentRanking,
                                          setCurrentRankingItems,
                                      }: ChooseRankingProps) {

    const router = useRouter();
    const {userId} = useUserContext();
    const {rankings} = useRankingsContext();
    const default_ranking: Ranking = {
        id: 0,
        user_id: userId,
        name: "",
        ranking_type: "numbered",
        creation_method: "manual",
        list_id: 0
    }

    function selectRanking(ranking: Ranking) {
        setCurrentRanking(default_ranking)
        setCurrentRankingItems([])
        if (currentRanking.id !== ranking.id) {
            setCurrentRankingItems([])
            setCurrentRanking({...ranking, id: Number(ranking.id)})
            fetchData<RankingItem[]>('ranking-items/' + ranking.id)
                .then(result => setCurrentRankingItems(result))
        }
    }

    return (

        <Spotlight
            className="group mx-auto grid max-w-sm items-start pb-12 gap-6 lg:max-w-none lg:grid-cols-6"
        >
            {rankings.map((ra: Ranking, index: number) => (
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
    );
}
