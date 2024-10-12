"use client";
import {Button, MenuItem, Select, Stack, TextField, Typography} from "@mui/material";
import {useCallback, useEffect, useState} from "react";
import {fetchData, postData} from "@/app/api";

interface List {
    name: string;
    elements: string[];
}

type Lists = List[];

const default_list: List = {
    name: '',
    elements: [],
};

export default function ListCreation() {
    const [error, setError] = useState<string | null>(null);
    const [lists, setLists] = useState<Lists>([]);

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
        setNewList({name: nameList, elements: input.split(separator)});
        setInput('');
    }

    async function saveList() {
        try {
            await postData<List>('lists', newList);
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
                <TextField onChange={e => setNameList(e.target.value)}/>
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
                    <Typography key={index}>{el}</Typography>
                ))}
                <Button onClick={saveList}>Save</Button>
            </Stack>
            <Stack>
                <Typography>Mes listes</Typography>
                {lists.map((li, index) => (
                    <MenuItem key={index}>{li.name}</MenuItem>
                ))}
            </Stack>
        </Stack>
    );
}
