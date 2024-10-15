"use client";
import {Stack, Typography} from "@mui/material";
import {useCallback, useEffect, useState} from "react";
import {fetchData} from "@/app/api";
import Spotlight from "@/components/spotlight";
import {Item, Lists} from "@/app/(default)/list/ListCreation";
import TemplatePage from "@/components/Template/TemplatePage";
import TemplateButton from "@/components/Template/TemplateButton";

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
        <TemplatePage
            title="My Lists"
            description="Select a list to base your ranking on. Choose from existing options or create a new list."
        >
            <Stack spacing={1} justifyContent='center'>
                <Spotlight
                    className="group mx-auto grid max-w-sm items-start gap-6 lg:max-w-none lg:grid-cols-6"
                >
                    {lists.map((li, index) => (
                        <TemplateButton key={index}
                                        text={li.name}
                                        variant="blue"
                                        onClick={() => {
                                            setCurrentList(li.name)
                                            setCurrentItems([])
                                            fetchItems(li.list_id)
                                        }}
                        />
                    ))}
                </Spotlight>
            </Stack>
            <Stack>
                <Typography>{currentList}</Typography>
                {currentItems?.map((el, index) => (
                    <Typography key={index}>{el.name}</Typography>
                ))}
            </Stack>
        </TemplatePage>
    );
}
