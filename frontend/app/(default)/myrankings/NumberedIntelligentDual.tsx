"use client";
import React, {useEffect, useState} from "react";
import Spotlight from "@/components/spotlight";
import {Stack} from "@mui/material";
import TemplateCard from "@/components/Template/TemplateCard";
import {fetchData, postData} from "@/app/api";

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
    NextDuel: Item[];
}

interface BattleResult {
    ranking_id: number;
    loser: number;
    winner: number;
}

export default function NumberedIntelligentDual({ranking_id}: { ranking_id: number }) {

    const [currentDual, setCurrentDual] = useState<Item[]>(default_duel)
    console.log(currentDual)
    useEffect(() => {
        initDuel()
    }, []);

    function chooseCard(winner: BattleResult) {
        nextDuel(winner)
    }

    async function initDuel() {
        try {
            await fetchData<Item[]>('duels-init/' + ranking_id, setCurrentDual).then(() => {
            });
        } catch (e) {
            console.error(e)
        }
    }

    async function nextDuel(data_result: BattleResult) {
        try {
            await postData<BattleResult, DuelResponse>('duels-next/' + ranking_id, data_result).then((response: DuelResponse) => {
                setCurrentDual(response.NextDuel)
            });
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <Stack spacing={1} justifyContent='center'>
            <Spotlight
                className="group mx-auto grid max-w-sm mt-3 items-start justify-center gap-6 lg:max-w-none lg:grid-cols-2"
            >
                <div className="flex justify-center">
                    <TemplateCard title={currentDual[0].name} image={""} variant="duel"
                                  onClick={() => chooseCard({
                                      ranking_id,
                                      winner: currentDual[0].id,
                                      loser: currentDual[1].id
                                  })}/>
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
        </Stack>
    );
}
