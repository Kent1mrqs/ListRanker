"use client";
import {Stack, Typography} from "@mui/material";
import {useCallback, useEffect, useState} from "react";
import {fetchData} from "@/app/api";
import Spotlight from "@/components/spotlight";
import {Item, Lists} from "@/app/(default)/list/ListCreation";
import TemplateButton from "@/components/Template/TemplateButton";
import TemplateLink from "@/components/Template/TemplateLink";

export const metadata = {
    title: "Home - Open PRO",
    description: "Page description",
};


export default function ListSelection() {
    const [currentListId, setCurrentListId] = useState<number>(0)
    const [error, setError] = useState<string | null>(null);
    const [currentItems, setCurrentItems] = useState<Item[]>([])
    const [lists, setLists] = useState<Lists>([]);
    const fetchLists = useCallback(() => {
        fetchData<Lists>('lists', setLists).catch(err => setError(err.message));
    }, []);
    useEffect(() => {
        fetchLists();
    }, [fetchLists]);
    const fetchItems = useCallback((list_id: number) => {
        fetchData<Lists>('items/' + list_id, setCurrentItems).catch(err => setError(err.message));
    }, []);
    if (error !== null) {
        console.error(error)
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
                                        onClick={() => {
                                            setCurrentListId(Number(li.list_id))
                                            setCurrentItems([])
                                            fetchItems(li.list_id)
                                        }}
                        />
                    ))}
                    <TemplateLink text='New list'
                                  variant='outlined'
                                  route='list'
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
