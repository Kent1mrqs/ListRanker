"use client";
import React from "react";
import Spotlight from "@/components/spotlight";
import {Stack} from "@mui/material";
import TemplateCard from "@/components/Template/TemplateCard";
import TierList from "@/public/images/tier_list.png";

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


export default function NumberedIntelligentDual() {


    function chooseCard() {

    }

    return (
        <Stack spacing={1} justifyContent='center'>
            <Spotlight
                className="group mx-auto grid max-w-sm mt-3 items-start justify-center gap-6 lg:max-w-none lg:grid-cols-2"
            >
                <div className="flex justify-center">
                    <TemplateCard title="" image={TierList} description="" onClick={chooseCard}/>
                </div>
                <div className="flex justify-center">
                    <TemplateCard title="" image={TierList} description="" onClick={chooseCard}/>
                </div>
            </Spotlight>
        </Stack>
    );
}
