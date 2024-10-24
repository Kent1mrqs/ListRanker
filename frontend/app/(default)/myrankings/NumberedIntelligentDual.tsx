"use client";
import React, {useCallback, useEffect, useState} from "react";
import {Stack} from "@mui/material";
import {fetchData, postData} from "@/app/api";
import {RankingItem} from "@/app/(default)/myrankings/ChooseRanking";
import {useNotification} from "@/app/NotificationProvider";
import {ShowRanking} from "@/components/ShowRanking";
import {Duel} from "@/components/DuelCards";

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

export interface BattleResult {
    ranking_id: number;
    loser: number;
    winner: number;
}

interface DuelProps {
    currentDual: Item[];
    duelsLeft: number;
    resetDuel: () => void;
    chooseCard: (winner: BattleResult) => void;
    ranking_id: number;
}

interface ComponentProps {
    currentRankingItems: RankingItem[];
    setCurrentRankingItems: (currentRankingItems: RankingItem[]) => void;
    ranking_id: number;
}


export default function NumberedIntelligentDual({
                                                    ranking_id,
                                                    setCurrentRankingItems,
                                                    currentRankingItems
                                                }: ComponentProps) {

    const [currentDual, setCurrentDual] = useState<Item[]>(default_duel)
    const {showNotification} = useNotification();
    const [duelOver, setDuelOver] = useState<Boolean>(false)
    const [duelsLeft, setDuelsLeft] = useState<number>(currentRankingItems.length * (currentRankingItems.length - 1) / 2)
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

    const fetchDuelInit = useCallback(() => {
        fetchData<NextDuelData>('duels-init/' + ranking_id)
            .then(response => {
                if (!response.NextDuelData) {
                    endBattle()
                } else {
                    setCurrentDual(response.NextDuelData.next_duel)
                    setDuelsLeft(response.NextDuelData.duels_left)
                }
            });
    }, [setDuelsLeft, endBattle, setCurrentDual])

    async function initDuel() {
        fetchDuelInit()
    }

    async function nextDuel(data_result: BattleResult) {
        try {
            await postData<BattleResult, NextDuelData>('duels-next/' + ranking_id, data_result).then((response: NextDuelData) => {
                if (!response.NextDuelData) {
                    endBattle()
                } else {
                    showNotification("Battle result sent", "success")
                    setCurrentDual(response.NextDuelData.next_duel)
                    setDuelsLeft(response.NextDuelData.duels_left)
                }
            });
        } catch (e) {
            showNotification("error", "error");
        }
    }

    function resetDuel() {
        postData<{}, String>("duels-reset/" + ranking_id, {})
            .then(() => {
                fetchDuelInit()
                showNotification("duel reset", "success")
                setDuelOver(false)
            })
    }

    return (
        <Stack spacing={1} justifyContent='center'>
            {duelOver ?
                <ShowRanking
                    resetDuel={resetDuel}
                    currentRankingItems={currentRankingItems}
                /> :
                <Duel currentDual={currentDual}
                      resetDuel={resetDuel}
                      duelsLeft={duelsLeft}
                      chooseCard={chooseCard}
                      ranking_id={ranking_id}
                />}
        </Stack>
    );
}
