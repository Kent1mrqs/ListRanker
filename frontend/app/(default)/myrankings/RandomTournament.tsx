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

interface RoundResponse {
    next_duel: Round,
    duels_left: number,
}

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
        if (!currentDuel[0].id) {
            initTournament()
        }
    }, []);

    function chooseCard(result: BattleResult) {
        setDuelsLeft(prevState => prevState - 1)
        setLosers((prevLosers) => {
            const newLosers = [...prevLosers, result.loser];
            if (newLosers.length === currentRound.length) {
                sendRoundResult(newLosers);
            } else {
                setCurrentDuel(currentRound[newLosers.length]);
            }
            if (currentRound.length === 2) {
                endTournament();
            }
            return newLosers;
        });
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
        fetchData<RoundResponse>('tournament-init/' + ranking_id)
            .then(response => {
                //    if (!response.NextDuelData) {
                //        endBattle()
                //    } else {
                console.log('received', response)
                setTournament(response.next_duel)
                setLosers([])
                setCurrentRound(response.next_duel)
                setDuelsLeft(response.duels_left)
                setCurrentDuel(response.next_duel[0])
                //setDuelsLeft(response)
                //    }
            });
    }, [setCurrentRound])

    async function initTournament() {
        fetchTournamentInit()
    }

    async function sendRoundResult(data_result: number[]) {
        console.log('next round')
        try {
            await postData<number[], RoundResponse>('tournament-next/' + ranking_id, data_result).then((response: RoundResponse) => {
                setCurrentRound(response.next_duel);
                console.log('response', response);
                setCurrentDuel(response.next_duel[0])
                setDuelsLeft(response.duels_left)
                setLosers([]);
            });
        } catch (e) {
            showNotification("error", "error")
            console.error(e)
        }
    }

    console.log(currentRound)
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
