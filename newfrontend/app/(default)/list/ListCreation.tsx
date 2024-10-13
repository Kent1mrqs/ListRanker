"use client";
import {Button, MenuItem, Select, Stack, TextField, Typography} from "@mui/material";
import {useCallback, useEffect, useState} from "react";
import {fetchData, postData} from "@/app/api";

interface Item {
    name: string;
}

interface List {
    user_id: number;
    name: string;
    elements: Item[];
}

type Lists = List[];

const default_list: List = {
    user_id: 1,
    name: '',
    elements: [],
};

export default function ListCreation() {
    const [error, setError] = useState<string | null>(null);
    const [lists, setLists] = useState<Lists>([]);

    const [currentList, setCurrentList] = useState<List>(default_list)
    const fetchLists = useCallback(() => {
        fetchData<Lists>('lists', setLists).catch(err => setError(err.message));
    }, []);

    useEffect(() => {
        fetchLists();
    }, [fetchLists]);

    const [nameList, setNameList] = useState('');
    const [input, setInput] = useState('');
    const [newList, setNewList] = useState<List>(default_list);
    const [separator, setSeparator] = useState('\n');

    function onClick() {
        const object: Item[] = input.split(separator).map(el => {
            return {name: el};
        });
        setNewList({...newList, name: nameList, elements: object});
        setInput('');
    }

    console.log(lists)

    async function saveList() {
        try {
            await postData<List>('lists', newList).then(() => setNewList(default_list));
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('An unknown error occurred');
            }
        }
    }

    return (
        <Stack direction='row' spacing={3}>
            <Stack spacing={1}>
                <Typography>Nom de la liste</Typography>
                <TextField
                    onChange={e => setNameList(e.target.value)}
                />
                <TextField
                    id="outlined-multiline-flexible"
                    label="Multiline"
                    multiline
                    onChange={e => setInput(e.target.value)}
                    value={input}
                    maxRows={4}
                />
                <Select value={separator} onChange={event => setSeparator(event.target.value as string)}>
                    <MenuItem value={'\n'}>Saut de ligne</MenuItem>
                    <MenuItem value={','}>,</MenuItem>
                    <MenuItem value={';'}>;</MenuItem>
                    <MenuItem value={' '}>espace</MenuItem>
                </Select>
                <Button onClick={onClick}>Validate</Button>
            </Stack>
            <Stack spacing={1}>
                <Typography>Elements de la liste {newList.name}: </Typography>
                {newList.elements.map((el, index) => (
                    <Typography key={index}>{el.name}</Typography>
                ))}
                <Button onClick={saveList}>Save</Button>
            </Stack>
            <Stack>
                <Typography>Mes listes</Typography>
                {lists.map((li, index) => (
                    <Button key={index} onClick={() => setCurrentList(li)}>{li.name}</Button>
                ))}
            </Stack>
            <Stack>
                <Typography>{currentList.name}</Typography>
                {currentList?.elements && currentList?.elements.map((el, index) => (
                    <Typography key={index}>{el.name}</Typography>
                ))}
            </Stack>
        </Stack>
    );
}
