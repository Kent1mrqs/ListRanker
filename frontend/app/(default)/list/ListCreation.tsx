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

const default_list: NewList = {
    user_id: 1,
    name: '',
    items: []
};


export default function ListCreation() {
    const [error, setError] = useState<string | null>(null);

    function isAlphabetic(value: string): boolean {
        return /^[a-zA-Z]+$/.test(value);
    }

    const [nameList, setNameList] = useState('');
    const [input, setInput] = useState('');
    const [newList, setNewList] = useState<NewList>(default_list);
    const [separator, setSeparator] = useState('\n');

    function onClick() {
        if (isAlphabetic(nameList)) {
            setError(null)
            const object: Item[] = input.split(separator).map(el => {
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
        <Stack>
            <Stack direction='row' spacing={5} justifyContent='center'>
                <Stack spacing={1}>
                    <TemplateInput
                        id='new_list'
                        placeholder='ex: Meilleurs Kdrama...'
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
                        label='Separator'
                    >
                        <option value={'\n'}>Saut de ligne</option>
                        <option value={','}>,</option>
                        <option value={';'}>;</option>
                        <option value={' '}>espace</option>
                    </TemplateSelect>
                    <Button disabled={!isAlphabetic(nameList)} onClick={onClick}>Validate</Button>
                </Stack>
                <Stack spacing={1}>
                    <Typography>items de la liste {newList.name}: </Typography>
                    {newList.items.map((el, index) => (
                        <Typography key={index}>{el.name}</Typography>
                    ))}
                    <Button onClick={saveList}>Save</Button>
                </Stack>
            </Stack>

        </Stack>
    );
}
