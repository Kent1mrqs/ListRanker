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

    const filter = currentRankingItems.reduce<Record<number, RankingItem[]>>((result, currentItem) => {
        const rank = currentItem.rank
        if (!result[rank]) {
            result[rank] = [];
        }
        result[rank].push(currentItem);
        return result
    }, {})
    console.log(Object.values(filter))
    return (
        <Stack alignItems="center" spacing={3}>
            {currentRankingItems
                .sort((a, b) => a.rank > b.rank ? 1 : -1)
                .map((item) => (
                    <Typography key={item.id}>{item.rank} : {item.name}</Typography>
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
    const [tournament, setTournament] = useState<Round>(default_round)
    const [currentDuel, setCurrentDuel] = useState<DuelItem>(default_duel)
    const [tournamentOver, setTournamentOver] = useState<Boolean>(false)
    const [duelsLeft, setDuelsLeft] = useState<number>(currentRankingItems.length * (currentRankingItems.length - 1) / 2)
    const {showNotification} = useNotification();
    const [losers, setLosers] = useState<number[]>([])
    const fetchRankingItems = useCallback(() => {
        fetchData<RankingItem[]>('ranking-items/' + ranking_id)
            .then(result => setCurrentRankingItems(result))
    }, [])

    useEffect(() => {
        initTournament()
        console.log("INIT ONCE")
    }, []);

    function chooseCard(result: BattleResult) {
        const new_losers = [...losers, result.loser]
        setLosers(new_losers)
        console.log('losers', losers.length)
        console.log('round', currentRound.length)
        if (currentRound.length === 2) {
            endTournament()
        } else {
            if (losers.length + 1 === currentRound.length) {
                sendRoundResult(losers)
                console.log('losers : ', losers)
            } else {
                setCurrentDuel(currentRound[losers.length + 1])
                console.log('new duel between : ', currentRound[losers.length])
            }
        }
    }

    function endTournament() {
        fetchRankingItems()
        setTournamentOver(true)
    }

    function resetTournament() {
        postData<{}, String>("tournament-reset/" + ranking_id, {})
            .then(() => {
                fetchTournamentInit()
                showNotification("Tournament reset", "success")
                setTournamentOver(false)
            })
    }

    const fetchTournamentInit = useCallback(() => {
        fetchData<Round>('tournament-init/' + ranking_id)
            .then(response => {
                //    if (!response.NextDuelData) {
                //        endBattle()
                //    } else {
                console.log('received', response)
                setTournament(response)
                setLosers([])
                setCurrentRound(response)
                setCurrentDuel(response[0])
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
                setCurrentRound(response);
                setCurrentDuel(response[0])
                setLosers([]);
            });
        } catch (e) {
            showNotification("error", "error")
            console.error(e)
        }
    }

    return (
        <Stack spacing={1} justifyContent='center'>
            {tournamentOver &&
				<ShowTournament
					resetDuel={resetTournament}
					currentRankingItems={currentRankingItems}
				/>}
            {!tournamentOver &&
                currentDuel &&
                currentDuel[0] &&
				<Duel currentDual={currentDuel}
				      resetDuel={resetTournament}
				      duelsLeft={duelsLeft}
				      chooseCard={chooseCard}
				      ranking_id={ranking_id}
				/>}
        </Stack>
    );
}
