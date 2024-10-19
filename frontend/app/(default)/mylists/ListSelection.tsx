"use client";
import {Stack, Typography} from "@mui/material";
import React, {useCallback, useEffect, useState} from "react";
import {fetchData} from "@/app/api";
import Spotlight from "@/components/spotlight";
import {Item, Lists} from "@/app/(default)/mylists/ListCreation";
import TemplateButton from "@/components/Template/TemplateButton";
import TemplateCard from "@/components/Template/TemplateCard";
import TemplateChip from "@/components/Template/TemplateChip";

export type ListProps = {
    lists: Lists;
    fetchLists: () => void;
    currentListId: number;
    setCurrentListId: (id: number) => void;
};


export default function ListSelection({lists, fetchLists, currentListId, setCurrentListId}: ListProps) {
    const [currentItems, setCurrentItems] = useState<Item[]>([])

    useEffect(() => {
        fetchLists();
    }, [fetchLists]);
    const fetchItems = useCallback((list_id: number) => {
        fetchData<Lists>('items/' + list_id)
            .then(result => setCurrentItems(result))
            .catch(err => console.error(err.message));
    }, []);

    function selectList(id: number) {
        if (id === currentListId) {
            setCurrentListId(0)
        } else {
            setCurrentListId(id)
            fetchItems(id)
        }
    }


    return (
        <Stack spacing={3} justifyContent='center'>
            <Stack spacing={1} justifyContent='center'>
                <Spotlight
                    className="group mx-auto grid max-w-sm items-start gap-6 lg:max-w-none lg:grid-cols-6"
                >
                    {lists.map((li, index) => (
                        <TemplateButton key={index}
                                        text={li.name}
                                        selected={li.list_id === currentListId}
                                        onClick={() => selectList(Number(li.list_id))}
                        />
                    ))}
                    <TemplateButton text='New list'
                                    variant='outlined'
                                    onClick={() => selectList(-1)}
                    />
                </Spotlight>
            </Stack>
            {!!currentListId && <Stack spacing={1} justifyContent='center'>
                {currentItems[0] ?
                    <Spotlight
                        className="group mx-auto grid max-w-sm items-start gap-6 lg:max-w-none lg:grid-cols-6"
                    >
                        {currentItems?.map((el, index) => (
                            <div className="mx-auto max-w-3xl pb-12 text-center md:pb-20">
                                {el.image ? <TemplateCard variant="item" title={el.name} image={el.image}/> :
                                    <TemplateChip>{el.name}</TemplateChip>}
                            </div>
                        ))}
                    </Spotlight> : <Typography>Empty list</Typography>}
			</Stack>}
        </Stack>
    );
}
