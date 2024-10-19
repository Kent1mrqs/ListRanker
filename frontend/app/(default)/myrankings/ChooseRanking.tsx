"use client";
import React from "react";
import {fetchData} from "@/app/api";
import {Ranking, Rankings} from "@/app/(default)/mylists/ListCreation";
import Spotlight from "@/components/spotlight";
import TemplateButton from "@/components/Template/TemplateButton";
import {useRouter} from "next/navigation";
import {useUserContext} from "@/app/UserProvider";

export interface RankingItem {
    id: number,
    ranking_id: number,
    item_id: number,
    rank: number,
    name: string,
    score: number,
}

export interface EditRanking {
    id: number,
    new_rank: number,
}

export interface ChooseRankingProps {
    rankings: Rankings,
    currentRanking: Ranking,
    setCurrentRanking: (currentRanking: Ranking) => void,
    setCurrentRankingItems: (currentRankingItems: RankingItem[]) => void,
}


export default function ChooseRanking({
                                          rankings,
                                          currentRanking,
                                          setCurrentRanking,
                                          setCurrentRankingItems,
                                      }: ChooseRankingProps) {

    const router = useRouter();
    const {userId} = useUserContext();
    const default_ranking: Ranking = {
        id: 0,
        user_id: userId,
        name: "",
        ranking_type: "numbered",
        creation_method: "manual_exchange",
        list_id: 0
    }

    function selectRanking(ranking: Ranking) {
        if (currentRanking.id === ranking.id) {
            setCurrentRanking({...default_ranking, id: 0})
            setCurrentRankingItems([])
        } else {
            setCurrentRankingItems([])
            setCurrentRanking(ranking)
            fetchData<RankingItem[]>('ranking-items/' + ranking.id)
                .then(result => setCurrentRankingItems(result))
        }
    }

    return (

        <Spotlight
            className="group mx-auto grid max-w-sm items-start pb-12 gap-6 lg:max-w-none lg:grid-cols-6"
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
    );
}
