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

export interface ItemId {
    id: number;
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

export default function NumberedIntelligentDual({rankingId}: { rankingId: number }) {

    const [currentDual, setCurrentDual] = useState<Item[]>(default_duel)

    useEffect(() => {
        initDuel()
    }, []);

    function chooseCard(winnerId: number) {
        nextDuel(winnerId)
    }

    async function initDuel() {
        try {
            await fetchData<Item[]>('duels-init/' + rankingId, setCurrentDual).then(() => {
            });
        } catch (e) {
            console.error(e)
        }
    }

    async function nextDuel(winnerId: number) {
        try {
            await postData<ItemId, DuelResponse>('duels-next/' + rankingId, {id: winnerId}).then((response: DuelResponse) => {
                setCurrentDual(response.NextDuel)
            });
        } catch (e) {
            console.error(e)
        }
    }

    function sendResult(item_id: number) {
        console.log(item_id + ' wins');
    }

    return (
        <Stack spacing={1} justifyContent='center'>
            <Spotlight
                className="group mx-auto grid max-w-sm mt-3 items-start justify-center gap-6 lg:max-w-none lg:grid-cols-2"
            >
                <div className="flex justify-center">
                    <TemplateCard title={currentDual[0].name} image={""} variant="duel"
                                  onClick={() => chooseCard(currentDual[0].id)}/>
                </div>
                <div className="flex justify-center">
                    <TemplateCard title={currentDual[1].name} image={""} variant="duel"
                                  onClick={() => chooseCard(currentDual[1].id)}/>
                </div>
            </Spotlight>
        </Stack>
    );
}
