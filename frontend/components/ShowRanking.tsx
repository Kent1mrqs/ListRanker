import {Stack, Typography} from "@mui/material";
import TemplateButton from "@/components/Template/TemplateButton";
import React, {useCallback, useState} from "react";
import {fetchData} from "@/app/api";
import {smoothScrollToElement} from "@/app/utils";
import {useNotification} from "@/app/NotificationProvider";
import {Item} from "@/components/Models/ModelsItems";
import {RankingItem} from "@/components/Models/ModelRankings";

export function ShowRanking({currentRankingItems, resetDuel}: {
    currentRankingItems: RankingItem[],
    resetDuel: () => void
}) {
    const {showNotification} = useNotification();
    const [currentItems, setCurrentItems] = useState<Item[]>([])
    const fetchItems = useCallback((list_id: number, redirect?: boolean) => {
        fetchData<Item[]>('items/' + list_id)
            .then(result => {
                if (redirect) {
                    smoothScrollToElement("step2")
                }
                setCurrentItems(result)
            })
            .catch(err => {
                showNotification("Error when fetching items : " + err.message, "error")
                console.error(err.message)
            });
    }, []);

    return (
        <Stack alignItems="center" spacing={3}>
            {currentRankingItems
                .sort((a, b) => a.rank > b.rank ? 1 : -1)
                .map((item) => (
                    <>
                        {/* <TemplateCard image={item.image} title={item.name}/>*/}
                        <Typography key={item.id}>{item.rank} : {item.name}</Typography>
                    </>
                ))}
            <TemplateButton text="Reset" onClick={resetDuel}/>

        </Stack>
    )
}