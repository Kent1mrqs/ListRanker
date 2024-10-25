"use client";
import React, {useCallback, useEffect, useState} from "react";
import Spotlight from "@/components/spotlight";
import {Stack, Typography} from "@mui/material";
import {fetchData, postData} from "@/app/api";
import {RankingItem} from "@/app/(default)/myrankings/ChooseRanking";
import TemplateButton from "@/components/Template/TemplateButton";
import {TemplateDuelCard} from "@/components/Template/TemplateCard";
import {useNotification} from "@/app/NotificationProvider";

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


function ShowTournament({currentRankingItems, resetDuel}: {
    currentRankingItems: RankingItem[],
    resetDuel: () => void
}) {
    return (
        <Stack alignItems="center" spacing={3}>
            {currentRankingItems
                .sort((a, b) => a.rank > b.rank ? 1 : -1)
                .map((item) => (
                    <Typography key={item.id}>{item.rank} : {item.name})</Typography>
                ))}
            <TemplateButton text="Reset" onClick={resetDuel}/>

        </Stack>
    )
}

function ShowTournamentPreview() {
    return (
        <></>
    )
}

function Duel({currentDual, resetDuel, chooseCard, ranking_id, duelsLeft}: DuelProps) {


    return (
        <Spotlight
            className="group mx-auto grid max-w-sm mt-3 items-start justify-center gap-6 lg:max-w-none lg:grid-cols-3 h-auto">
            <div className="flex justify-center">
                <TemplateDuelCard title={currentDual[0].name}
                                  image={currentDual[0].image}
                                  variant="duel"
                                  onClick={() => chooseCard({
                                      ranking_id,
                                      winner: currentDual[0].id,
                                      loser: currentDual[1].id
                                  })}/>
            </div>
            <div
                className="flex justify-center items-center relative z-20 h-full overflow-hidden rounded-[inherit]"
            >
                <div>
                    <div>Duels left: {duelsLeft}</div>
                    <TemplateButton text="Reset" onClick={resetDuel}/>
                </div>

            </div>

            <div className="flex justify-center">
                <TemplateDuelCard title={currentDual[1].name}
                                  image={currentDual[1].image}
                                  variant="duel"
                                  onClick={() => chooseCard({
                                      ranking_id,
                                      winner: currentDual[1].id,
                                      loser: currentDual[0].id
                                  })}/>
            </div>
        </Spotlight>
    )
}

export default function RandomTournament({
                                             ranking_id,
                                             setCurrentRankingItems,
                                             currentRankingItems
                                         }: ComponentProps) {

    const [currentDual, setCurrentDual] = useState<Item[]>(default_duel)
    const [duelOver, setDuelOver] = useState<Boolean>(false)
    const [duelsLeft, setDuelsLeft] = useState<number>(currentRankingItems.length * (currentRankingItems.length - 1) / 2)
    const {showNotification} = useNotification();

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

    const fetchTournamentInit = useCallback(() => {
        fetchData<NextDuelData>('tournament-init/' + ranking_id)
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
        fetchTournamentInit()
    }

    async function nextDuel(data_result: BattleResult) {
        try {
            await postData<BattleResult, NextDuelData>('tournament-next/' + ranking_id, data_result).then((response: NextDuelData) => {
                if (!response.NextDuelData) {
                    endBattle()
                } else {
                    setCurrentDual(response.NextDuelData.next_duel)
                    setDuelsLeft(response.NextDuelData.duels_left)
                }
            });
        } catch (e) {
            showNotification("error", "error")
            console.error(e)
        }
    }

    return (
        <Stack spacing={1} justifyContent='center'>
            <ShowTournamentPreview/>
            {duelOver ?
                <ShowTournament
                    resetDuel={fetchTournamentInit}
                    currentRankingItems={currentRankingItems}
                /> :
                <Duel currentDual={currentDual}
                      resetDuel={fetchTournamentInit}
                      duelsLeft={duelsLeft}
                      chooseCard={chooseCard}
                      ranking_id={ranking_id}
                />}
        </Stack>
    );
}
