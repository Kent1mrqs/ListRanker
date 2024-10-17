"use client";
import React, {useState} from "react";
import Spotlight from "@/components/spotlight";
import {Button, Stack, Typography} from "@mui/material";
import TemplateInput from "@/components/Template/TemplateInput";

interface RankingItem {
    id: number,
    ranking_id: number,
    item_id: number,
    rank: number,
    name: string,
}

interface EditRanking {
    id: number,
    new_rank: number,
}

export interface RankingMakerProps {
    currentRankingItems: RankingItem[],
    saveRanking: (editRanking: EditRanking[], setEditRanking: (editRanking: EditRanking[]) => void) => void,
    setCurrentRankingItems: (currentRankingItems: RankingItem[]) => void,
}


export default function RankingMaker({
                                         saveRanking,
                                         currentRankingItems,
                                         setCurrentRankingItems,
                                     }: RankingMakerProps) {


    const [editRanking, setEditRanking] = useState<EditRanking[]>([])

    function exchangeRanks(id: number, new_rank: number) {
        const target = currentRankingItems.filter(item => item.rank === new_rank)[0]
        const self = currentRankingItems.filter(item => item.id === id)[0]

        const new_target = {...target, rank: self.rank}
        const new_self = {...self, rank: target.rank}
        const updatedRankingItems = currentRankingItems.map(item => {
            if (item.id === new_target.id) {
                return new_target;
            }
            if (item.id === new_self.id) {
                return new_self;
            }
            return item;
        });
        setCurrentRankingItems(updatedRankingItems);
    }

    function moveRank(id: number, new_rank: number) {
        exchangeRanks(id, new_rank);
        setEditRanking(prevState => {
            return [...prevState, {id, new_rank}]
        })
    }

    return (
        <Stack spacing={1} justifyContent='center'>
            <Spotlight
                className="group mx-auto grid max-w-sm items-start gap-6 lg:max-w-none lg:grid-cols-6"
            >
                {currentRankingItems.sort((a, b) => a.rank > b.rank ? 1 : -1)?.map((el, index) => (
                    <div className="mx-auto max-w-3xl pb-12 text-center md:pb-20">
                        <Typography justifyContent='center' key={index}>{el.name}</Typography>
                        <Typography justifyContent='center' key={index}>{el.rank}</Typography>
                        <TemplateInput label='rank'
                                       type='number'
                                       id={'rank' + index}
                                       key={index}
                                       variant='blue'
                                       placeholder={String(el.rank)}
                                       onBlur={(e) => {
                                           const number_value = Number(e.target.value);
                                           if (number_value <= currentRankingItems.length && number_value !== 0) {
                                               moveRank(el.id, Number(e.target.value))
                                           }
                                           e.target.value = ''
                                       }}
                        />
                    </div>
                ))}
            </Spotlight>
            <Button onClick={() => saveRanking(editRanking, setEditRanking)}>Save</Button>
        </Stack>
    );
}
