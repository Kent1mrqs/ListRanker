"use client";
import {Button, Stack, Typography} from "@mui/material";
import {useState} from "react";
import {postData} from "@/app/api";
import TemplateInput from "@/components/Template/TemplateInput";
import TemplateTextArea from "@/components/Template/TemplateTextArea";
import TemplateSelect from "@/components/Template/TemplateSelect";
import {useUserContext} from "@/app/UserProvider";

export interface Item {
    name: string;
}

export interface NewList {
    user_id: number | null;
    name: string;
    items: Item[];
}

export interface ListDb {
    user_id: number | null;
    name: string;
    list_id: number;
}

export type Lists = ListDb[];

export interface Ranking {
    id: number;
    user_id: number | null;
    name: string;
    ranking_type: "numbered" | "tier_list";
    creation_method: "manual_exchange" | "intelligent_dual";
    list_id: number;
}

export type Rankings = Ranking[]


export type FetchListProps = {
    fetchLists: () => void;
};

export function isValidInput(value: string): boolean {
    const hasInvalidCharacters = /[.,;]/.test(value)
    const input_length = value.trim().length;
    return !hasInvalidCharacters && input_length < 25 && input_length > 0;
}

export default function ListCreation({fetchLists}: FetchListProps) {
    const [error, setError] = useState<string | null>(null);
    const {userId} = useUserContext();


    const default_list: NewList = {
        user_id: userId,
        name: '',
        items: []
    };

    const [nameList, setNameList] = useState('');
    const [input, setInput] = useState('');
    const [newList, setNewList] = useState<NewList>(default_list);
    const [separator, setSeparator] = useState('\n');

    function onClick() {
        if (isValidInput(nameList)) {
            setError(null)
            const object: Item[] = input
                .split(separator)
                .filter(item => item && item.trim() !== "")
                .map(el => {
                    return {name: el};
                });
            setNewList({...newList, name: nameList, items: object});
        } else {
            setError('ee')
        }
    }

    if (error !== null) {
        console.error(error)
        setError(null);
    }


    async function saveList() {
        try {
            await postData<NewList, NewList>('lists', newList).then(() => {
                setNewList(default_list)
                fetchLists()
            });
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('An unknown error occurred');
            }
        }
    }
    
    return (
        <Stack direction='row' spacing={5} justifyContent="center">
            <Stack spacing={1} alignItems="center">
                <TemplateInput
                    id='new_list'
                    variant="blue"
                    placeholder='ex: Kdrama...'
                    label='Nouvelle liste'
                    onChange={e => setNameList(e.target.value)}
                />
                <TemplateTextArea
                    id='list_items'
                    placeholder='Vincenzo...'
                    rows={4}
                    onChange={e => setInput(e.target.value)}
                />
                <TemplateSelect
                    onChange={event => setSeparator(event.target.value as string)}
                    id='e'
                    label='Separator : '
                >
                    <option value={'\n'}>Saut de ligne</option>
                    <option value={','}>,</option>
                    <option value={';'}>;</option>
                    <option value={' '}>espace</option>
                </TemplateSelect>
                <Button disabled={!isValidInput(nameList)} onClick={onClick}>Validate</Button>
            </Stack>
            <Stack spacing={1} justifyContent='center'>
                <Typography>items de la liste {newList.name}: </Typography>
                {newList.items.map((el, index) => (
                    <Typography key={index}>{el.name}</Typography>
                ))}
                <Button onClick={saveList}>Save</Button>
            </Stack>
        </Stack>
    );
}
