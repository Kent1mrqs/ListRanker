"use client";
import React, {useCallback, useEffect, useState} from "react";
import {Stack, Typography} from "@mui/material";
import {fetchData, postData} from "@/app/api";
import TemplateButton from "@/components/Template/TemplateButton";
import {useNotification} from "@/app/NotificationProvider";
import {BattleResult} from "@/components/Models/ModelsDuels";
import {ComponentProps, Item} from "@/components/Models/ModelsItems";
import {RankingItem} from "@/components/Models/ModelRankings";
import {Duel} from "@/components/DuelCards";


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

function ShowTournamentPreview({currentRound}: { currentRound: Round }) {
    return (
        <>
            {currentRound}

        </>
    )
}

type DuelItem = Item[]
type Round = DuelItem[]

const default_duel = [{name: "", id: 0, image: ""}, {name: "", id: 0, image: ""}]
const default_round = [default_duel]


export default function RandomTournament({
                                             ranking_id,
                                             setCurrentRankingItems,
                                             currentRankingItems
                                         }: ComponentProps) {

    const [currentRound, setCurrentRound] = useState<Round>(default_round)
    const [currentDuel, setCurrentDuel] = useState<DuelItem>(default_duel)
    const [tournamentOver, setTournamentOver] = useState<Boolean>(false)
    const [duelsLeft, setDuelsLeft] = useState<number>(currentRankingItems.length * (currentRankingItems.length - 1) / 2)
    const {showNotification} = useNotification();
    const [losers, setLosers] = useState<number[]>([])
    const fetchRankingItems = useCallback(() => {
        fetchData<RankingItem[]>('ranking-items/' + ranking_id)
            .then(result => setCurrentRankingItems(result))
    }, [])
    const roundOver = false
    useEffect(() => {
        initTournament()
    }, []);

    function chooseCard(result: BattleResult) {
        setLosers([...losers, result.loser])
        if (losers.length === currentRound.length) {
            sendRoundResult(losers)
        } else {
            setCurrentDuel(currentRound[losers.length])
        }
    }

    function endBattle() {
        fetchRankingItems()
        setTournamentOver(true)
    }

    const fetchTournamentInit = useCallback(() => {
        fetchData<Round>('tournament-init/' + ranking_id)
            .then(response => {
                //    if (!response.NextDuelData) {
                //        endBattle()
                //    } else {
                setCurrentRound(response)
                //setDuelsLeft(response)
                //    }
            });
    }, [setCurrentRound])

    async function initTournament() {
        fetchTournamentInit()
    }

    async function sendRoundResult(data_result: number[]) {
        try {
            await postData<number[], Round>('tournament-next/' + ranking_id, data_result).then((response: Round) => {
                //       if (!response.NextDuelData) {
                //            endBattle()
                //        } else {
                setCurrentRound(response);
                setLosers([]);
                //     setDuelsLeft(response.NextDuelData.duels_left)
                //       }
            });
        } catch (e) {
            showNotification("error", "error")
            console.error(e)
        }
    }

    return (
        <Stack spacing={1} justifyContent='center'>
            <ShowTournamentPreview currentRound={currentRound}/>
            {tournamentOver ?
                <ShowTournament
                    resetDuel={fetchTournamentInit}
                    currentRankingItems={currentRankingItems}
                /> :
                <Duel currentDual={currentDuel}
                      resetDuel={fetchTournamentInit}
                      duelsLeft={duelsLeft}
                      chooseCard={chooseCard}
                      ranking_id={ranking_id}
                />}
        </Stack>
    );
}
