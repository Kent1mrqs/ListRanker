"use client";
import {Button, Stack, Typography} from "@mui/material";
import {useCallback, useEffect, useState} from "react";
import {fetchData, postData} from "@/app/api";
import TemplateInput from "@/components/Template/TemplateInput";
import TemplateTextArea from "@/components/Template/TemplateTextArea";
import TemplateSelect from "@/components/Template/TemplateSelect";
import TemplateButton from "@/components/Template/TemplateButton";

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
    const [lists, setLists] = useState<Lists>([]);

    const [currentList, setCurrentList] = useState<string>('')
    const [currentItems, setCurrentItems] = useState<Item[]>([])

    const fetchLists = useCallback(() => {
        fetchData<Lists>('lists', setLists).catch(err => setError(err.message));
    }, []);

    const fetchItems = useCallback((list_id: number) => {
        fetchData<Lists>('items/' + list_id, setCurrentItems).catch(err => setError(err.message));
    }, []);

    useEffect(() => {
        fetchLists();
    }, [fetchLists]);

    const [nameList, setNameList] = useState('');
    const [input, setInput] = useState('');
    const [newList, setNewList] = useState<NewList>(default_list);
    const [separator, setSeparator] = useState('\n');

    function onClick() {
        const object: Item[] = input.split(separator).map(el => {
            return {name: el};
        });
        setNewList({...newList, name: nameList, items: object});
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

    console.log(currentItems)
    return (
        <Stack direction='row' spacing={3}>
            <Stack spacing={1}>
                <TemplateInput
                    id='new_list'
                    placeholder='ex: Animés Automne 2024...'
                    label='Nouvelle liste'
                    onChange={e => setNameList(e.target.value)}
                />
                <TemplateTextArea
                    id='list_items'
                    placeholder='item1\nj'
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
                <Button onClick={onClick}>Validate</Button>
            </Stack>
            <Stack spacing={1}>
                <Typography>items de la liste {newList.name}: </Typography>
                {newList.items.map((el, index) => (
                    <Typography key={index}>{el.name}</Typography>
                ))}
                <Button onClick={saveList}>Save</Button>
            </Stack>
            <Stack spacing={1}>
                <Typography>Mes listes</Typography>
                {lists.map((li, index) => (
                    <TemplateButton
                        key={index}
                        variant='blue'
                        text={li.name}
                        onClick={() => {
                            setCurrentList(li.name)
                            setCurrentItems([])
                            fetchItems(li.list_id)
                        }}/>
                ))}
            </Stack>
            {currentList &&
				<Stack>
					<Typography>{currentList}</Typography>
                    {currentItems[0] ? currentItems?.map((el, index) => (
                        <Typography key={index}>{el.name}</Typography>
                    )) : <Typography>Aucun élément</Typography>}
				</Stack>
            }
        </Stack>
    );
}
