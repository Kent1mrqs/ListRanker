"use client";
import {Stack, Typography} from "@mui/material";
import React, {useCallback, useEffect, useState} from "react";
import {fetchData} from "@/app/api";
import Spotlight from "@/components/spotlight";
import {Item, Lists} from "@/app/(default)/mylists/ListCreation";
import TemplateButton from "@/components/Template/TemplateButton";

export type ListProps = {
    lists: Lists;
    fetchLists: () => void;
    currentListId: number;
    setCurrentListId: (id: number) => void;
};


export default function ListSelection({lists, fetchLists, currentListId, setCurrentListId}: ListProps) {
    const [error, setError] = useState<string | null>(null);
    const [currentItems, setCurrentItems] = useState<Item[]>([])

    useEffect(() => {
        fetchLists();
    }, [fetchLists]);
    const fetchItems = useCallback((list_id: number) => {
        fetchData<Lists>('items/' + list_id)
            .then(result => setCurrentItems(result))
            .catch(err => setError(err.message));
    }, []);
    if (error !== null) {
        console.error(error)
        setError(null);
    }

    function selectList(id: number) {
        setCurrentItems([])
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
                                        variant={li.list_id === currentListId ? "grey" : "blue"}
                                        onClick={() => selectList(Number(li.list_id))}
                        />
                    ))}
                    <TemplateButton text='New list'
                                    variant='outlined'
                                    onClick={() => selectList(-1)}
                    />
                </Spotlight>
            </Stack>
            <Stack spacing={1} justifyContent='center'>
                <Spotlight
                    className="group mx-auto grid max-w-sm items-start gap-6 lg:max-w-none lg:grid-cols-6"
                >
                    {currentItems?.map((el, index) => (
                        <div className="mx-auto max-w-3xl pb-12 text-center md:pb-20">
                            <Typography justifyContent='center' key={index}>{el.name}</Typography>
                        </div>
                    ))}
                </Spotlight>
            </Stack>
        </Stack>
    );
}
