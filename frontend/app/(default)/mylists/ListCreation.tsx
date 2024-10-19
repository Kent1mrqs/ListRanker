"use client";
import {Button, Stack, Typography} from "@mui/material";
import React, {useState} from "react";
import {postData} from "@/app/api";
import TemplateInput from "@/components/Template/TemplateInput";
import TemplateTextArea from "@/components/Template/TemplateTextArea";
import TemplateSelect from "@/components/Template/TemplateSelect";
import {useUserContext} from "@/app/UserProvider";
import Spotlight from "@/components/spotlight";
import TemplateCard from "@/components/Template/TemplateCard";
import TemplateChip from "@/components/Template/TemplateChip";

export interface Item {
    name: string;
    image?: string;
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

const blue = "btn-sm bg-gradient-to-t from-indigo-600 to-indigo-500 bg-[length:100%_100%] bg-[bottom] py-[5px] text-white shadow-[inset_0px_1px_0px_0px_theme(colors.white/.16)] hover:bg-[length:100%_150%] max-w-[200px] w-full";

export default function ListCreation({fetchLists}: FetchListProps) {
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
            const object: Item[] = input
                .split(separator)
                .filter(item => item && item.trim() !== "")
                .map(el => {
                    return {name: el, image: ""};
                });
            setNewList({...newList, name: nameList, items: object});
        } else {
            console.error('invalid input')
        }
    }

    async function saveList() {
        console.log("save", newList)
        try {
            await postData<NewList, NewList>('lists', newList).then(() => {
                setNewList(default_list)
                fetchLists()
            });
        } catch (error) {
            if (error instanceof Error) {
                console.error(error.message);
            } else {
                console.error('An unknown error occurred');
            }
        }
    }


    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, id: number) => {
        const file = event.target.files?.[0];
        const newObject = newList.items[id]
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const newImage = reader.result as string;

                setNewList((prevList) => {
                    const updatedItems = prevList.items.map((item, index) => {
                        if (index === id) {
                            return {...item, image: newImage};
                        }
                        return item;
                    });
                    return {
                        ...prevList,
                        items: updatedItems,
                    };
                });
            };
            reader.readAsDataURL(file);
        }
    };


    const handleFileReset = (id: number) => {
        setNewList((prevList) => {
            const updatedItems = prevList.items.map((item, index): Item => {
                if (index === id) {
                    return {...item, image: undefined};
                }
                return item;
            });
            return {
                ...prevList,
                items: updatedItems,
            };
        });
    };

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
            <Stack spacing={1}>
                <Typography>items de la liste {newList.name}: </Typography>
                <Spotlight
                    className="group mx-auto grid justify-center max-w-sm items-start gap-6 lg:max-w-none lg:grid-cols-3"
                >
                    {
                        newList.items.map((el, index) => (
                            <Stack direction="row" spacing={3}>
                                {
                                    el.image ?
                                        <TemplateCard title={el.name} image={el.image}/> :
                                        <TemplateChip>
                                            {el.name}
                                        </TemplateChip>
                                }
                                <div>
                                    <input
                                        className="btn-sm bg-gradient-to-t from-indigo-600 to-indigo-500 bg-[length:100%_100%] bg-[bottom] py-[5px] text-white shadow-[inset_0px_1px_0px_0px_theme(colors.white/.16)] hover:bg-[length:100%_150%] max-w-[200px] w-full"
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleFileChange(e, index)}/>
                                    {el.image && <Button onClick={() => handleFileReset(index)}>
										Remove
									</Button>}
                                </div>
                            </Stack>
                        ))
                    }
                </Spotlight>
                <Button onClick={saveList}>Save</Button>
            </Stack>
        </Stack>
    );
}
