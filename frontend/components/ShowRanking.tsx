import {RankingItem} from "@/app/(default)/myrankings/ChooseRanking";
import {Stack, Typography} from "@mui/material";
import TemplateButton from "@/components/Template/TemplateButton";
import React from "react";

export function ShowRanking({currentRankingItems, resetDuel}: {
    currentRankingItems: RankingItem[],
    resetDuel: () => void
}) {
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