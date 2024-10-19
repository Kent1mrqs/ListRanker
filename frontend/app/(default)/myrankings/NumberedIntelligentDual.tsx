"use client";
import React, {useCallback, useEffect, useState} from "react";
import Spotlight from "@/components/spotlight";
import {Stack, Typography} from "@mui/material";
import TemplateCard from "@/components/Template/TemplateCard";
import {fetchData, postData} from "@/app/api";
import {RankingItem} from "@/app/(default)/myrankings/ChooseRanking";

export interface Item {
    id: number;
    name: string,
    image: string,
}

const default_duel = [{
    id: 0,
    name: "",
    image: ''
}, {
    id: 0,
    name: "",
    image: ""
}];

interface DuelResponse {
    next_duel: Item[];
    duels_left: number
}

interface NextDuelData {
    NextDuelData: DuelResponse
}

interface BattleResult {
    ranking_id: number;
    loser: number;
    winner: number;
}

interface DuelProps {
    currentDual: Item[];
    duelsLeft: number;
    chooseCard: (winner: BattleResult) => void;
    ranking_id: number;
}

interface ComponentProps {
    currentRankingItems: RankingItem[];
    setCurrentRankingItems: (currentRankingItems: RankingItem[]) => void;
    ranking_id: number;
}

function ShowRanking({currentRankingItems}: { currentRankingItems: RankingItem[] }) {
    console.log(currentRankingItems)
    return (
        <Stack alignItems="center" spacing={3}>
            {currentRankingItems
                .sort((a, b) => a.rank > b.rank ? 1 : -1)
                .map((item) => (
                    <Typography key={item.id}>{item.rank} : {item.name}</Typography>
                ))}
        </Stack>
    )
}

function Duel({currentDual, chooseCard, ranking_id, duelsLeft}: DuelProps) {
    return (
        <Spotlight
            className="group mx-auto grid max-w-sm mt-3 items-start justify-center gap-6 lg:max-w-none lg:grid-cols-3 h-auto">

            <div className="flex justify-center">
                <TemplateCard title={currentDual[0].name} image={""} variant="duel"
                              onClick={() => chooseCard({
                                  ranking_id,
                                  winner: currentDual[0].id,
                                  loser: currentDual[1].id
                              })}/>
            </div>
            <div
                className="flex justify-center items-center relative z-20 h-full overflow-hidden rounded-[inherit] after:absolute after:inset-0 after:bg-gradient-to-br"
            >
                Duels left: {duelsLeft}
            </div>

            <div className="flex justify-center">
                <TemplateCard title={currentDual[1].name} image={""} variant="duel"
                              onClick={() => chooseCard({
                                  ranking_id,
                                  winner: currentDual[1].id,
                                  loser: currentDual[0].id
                              })}/>
            </div>
        </Spotlight>
    )
}

export default function NumberedIntelligentDual({
                                                    ranking_id,
                                                    setCurrentRankingItems,
                                                    currentRankingItems
                                                }: ComponentProps) {

    const [currentDual, setCurrentDual] = useState<Item[]>(default_duel)
    const [duelOver, setDuelOver] = useState<Boolean>(false)
    const [duelsLeft, setDuelsLeft] = useState<number>(currentRankingItems.length * (currentRankingItems.length - 1) / 2)
    console.log(duelOver)
    const fetchRankingItems = useCallback(() => {
        fetchData<RankingItem[]>('ranking-items/' + ranking_id)
            .then(result => setCurrentRankingItems(result))
    }, [])

    useEffect(() => {
        initDuel()
    }, []);

    function chooseCard(winner: BattleResult) {
        nextDuel(winner)
    }

    function endBattle() {
        fetchRankingItems()
        setDuelOver(true)
    }

    async function initDuel() {
        try {
            await fetchData<NextDuelData>('duels-init/' + ranking_id)
                .then(response => {
                    if (!response.NextDuelData) {
                        endBattle()
                    } else {
                        setCurrentDual(response.NextDuelData.next_duel)
                        setDuelsLeft(response.NextDuelData.duels_left)
                    }
                });
        } catch (e) {
            console.error(e)
        }
    }

    async function nextDuel(data_result: BattleResult) {
        try {
            await postData<BattleResult, NextDuelData>('duels-next/' + ranking_id, data_result).then((response: NextDuelData) => {
                if (!response.NextDuelData) {
                    endBattle()
                } else {
                    setCurrentDual(response.NextDuelData.next_duel)
                    setDuelsLeft(response.NextDuelData.duels_left)
                }
            });
        } catch (e) {
            console.error(e)
        }
    }

    console.log(duelOver)
    return (
        <Stack spacing={1} justifyContent='center'>
            {duelOver ?
                <ShowRanking
                    currentRankingItems={currentRankingItems}
                /> :
                <Duel currentDual={currentDual}
                      duelsLeft={duelsLeft}
                      chooseCard={chooseCard}
                      ranking_id={ranking_id}
                />}
        </Stack>
    );
}
