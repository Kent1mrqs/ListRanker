"use client";
import {Button, Stack, Typography} from "@mui/material";
import {useCallback, useEffect, useState} from "react";
import {fetchData} from "@/app/api";
import {Item, Lists} from "@/app/(default)/list/ListCreation";
import Styles from "@/app/(default)/ranking/Style";

export const metadata = {
    title: "Home - Open PRO",
    description: "Page description",
};


export default function ListSelection() {
    const [currentList, setCurrentList] = useState<string>('')
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
    console.error(error)
    return (
        <Styles>
            <Stack direction='row' spacing={3}>
                <Stack>
                    <Typography>Mes listes</Typography>
                    {lists.map((li, index) => (
                        <Button key={index} onClick={() => {
                            setCurrentList(li.name)
                            setCurrentItems([])
                            fetchItems(li.list_id)
                        }}>{li.name}</Button>
                    ))}
                </Stack>
                <Stack>
                    <Typography>{currentList}</Typography>
                    {currentItems?.map((el, index) => (
                        <Typography key={index}>{el.name}</Typography>
                    ))}
                </Stack>
            </Stack>
        </Styles>
    );
}
