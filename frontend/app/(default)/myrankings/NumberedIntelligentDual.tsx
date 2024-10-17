"use client";
import React, {useState} from "react";
import Spotlight from "@/components/spotlight";
import {Stack} from "@mui/material";
import TemplateCard from "@/components/Template/TemplateCard";

export interface Item {
    id_item: number;
    name: string,
    image: string,
}


export default function NumberedIntelligentDual() {

    const [currentDual, setCurrentDual] = useState<Item[]>([{
        id_item: 1,
        name: "tom",
        image: ''
    }, {
        id_item: 3,
        name: "jerry",
        image: ""
    }])

    function chooseCard(item_id: number) {

        sendResult(item_id)
        nextDual()
    }

    function nextDual() {
        const new_duel = [{
            id_item: 2,
            name: "titi",
            image: ''
        }, {
            id_item: 4,
            name: "grominet",
            image: ''
        }];
        setCurrentDual(new_duel)
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
                    <TemplateCard title={currentDual[0].name} image={currentDual[0].image} description=""
                                  onClick={() => chooseCard(currentDual[0].id_item)}/>
                </div>
                <div className="flex justify-center">
                    <TemplateCard title={currentDual[1].name} image={currentDual[1].image} description=""
                                  onClick={() => chooseCard(currentDual[1].id_item)}/>
                </div>
            </Spotlight>
        </Stack>
    );
}
