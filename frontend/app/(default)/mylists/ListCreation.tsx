"use client";
import {Button, Stack, Typography} from "@mui/material";
import {useState} from "react";
import {postData} from "@/app/api";
import TemplateInput from "@/components/Template/TemplateInput";
import TemplateTextArea from "@/components/Template/TemplateTextArea";
import TemplateSelect from "@/components/Template/TemplateSelect";

export interface Item {
    name: string;
}

export interface NewList {
    user_id: number;
    name: string;
    items: Item[];
}

export interface ListDb {
    user_id: number;
    name: string;
    list_id: number;
}

export type Lists = ListDb[];

export interface Ranking {
    id: number;
    user_id: number;
    name: string;
    ranking_type: string;
}

export type Rankings = Ranking[]

const default_list: NewList = {
    user_id: 1,
    name: '',
    items: []
};

export type FetchListProps = {
    fetchLists: () => void;
};


export default function ListCreation({fetchLists}: FetchListProps) {
    const [error, setError] = useState<string | null>(null);

    function isValidInput(value: string): boolean {
        const hasInvalidCharacters = /[.,;]/.test(value)
        const input_length = value.trim().length;
        return !hasInvalidCharacters && input_length < 10 && input_length > 0;
    }


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
    }


    async function saveList() {
        try {
            await postData<NewList>('lists', newList).then(() => {
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

    const blue = "btn-sm bg-gradient-to-t from-indigo-600 to-indigo-500 bg-[length:100%_100%] bg-[bottom] py-[5px] text-white shadow-[inset_0px_1px_0px_0px_theme(colors.white/.16)] hover:bg-[length:100%_150%]"

    return (
        <Stack direction='row' spacing={5} justifyContent="center">
            <Stack spacing={1} alignItems="center">
                <TemplateInput
                    id='new_list'
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