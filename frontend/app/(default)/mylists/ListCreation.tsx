"use client";
import {Button, Stack, Typography} from "@mui/material";
import React, {ChangeEvent, useState} from "react";
import {postData} from "@/app/api";
import TemplateInput from "@/components/Template/TemplateInput";
import {useUserContext} from "@/app/UserProvider";
import Spotlight from "@/components/spotlight";
import {TemplateEditionCard} from "@/components/Template/TemplateCard";
import {fetchLists} from "@/app/(default)/mylists/ListServices";
import {useListsContext} from "@/app/ListsProvider";
import {useNotification} from "@/app/NotificationProvider";
import TemplateTextArea from "@/components/Template/TemplateTextArea";

export interface Item {
    list_id?: number;
    id: number;
    name: string;
    image?: string;
}

export interface InputItem {
    name: string;
    image?: string;
}

export interface NewList {
    user_id: number | null;
    name: string;
    items: InputItem[];
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
    ranking_type: "numbered" | "tier_list" | "tournament";
    creation_method: "manual" | "intelligent_dual";
    list_id: number;
}

export type Rankings = Ranking[]

export function isValidInput(value: string): boolean {
    const hasInvalidCharacters = /[.,;]/.test(value)
    const input_length = value.trim().length;
    return !hasInvalidCharacters && input_length < 25 && input_length > 0;
}

const blue = "btn-sm bg-gradient-to-t from-indigo-600 to-indigo-500 bg-[length:100%_100%] bg-[bottom] py-[5px] text-white shadow-[inset_0px_1px_0px_0px_theme(colors.white/.16)] hover:bg-[length:100%_150%] max-w-[200px] w-full";

export default function ListCreation() {
    const {userId} = useUserContext();
    const {setLists} = useListsContext();
    const {showNotification} = useNotification();

    const default_list: NewList = {
        user_id: userId,
        name: '',
        items: []
    };

    const [newList, setNewList] = useState<NewList>(default_list);
    const [loading, setLoading] = useState<boolean>(false);

    async function saveList() {
        setLoading(true)
        postData<NewList, NewList>('lists', newList).then(() => {
            setLoading(false)
            setNewList(default_list)
            fetchLists(userId, setLists)
            showNotification("New list created", "success")
        });
    }

    const addImagesAsItems = async (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const fileArray = Array.from(event.target.files);
            console.log(fileArray);
            const fileDataPromises = fileArray.map(async (file) => {
                const base64 = await convertToBase64(file);
                return {
                    name: file.name.split('.')[0].replaceAll('_', ' '),
                    image: base64,
                };
            });

            const filesData = await Promise.all(fileDataPromises);
            setNewList({...newList, items: [...newList.items, ...filesData]});
        }
    };
    const addTextAsItems = (event: ChangeEvent<HTMLTextAreaElement>) => {
        const items = event.target.value
            .split('\n')
            .filter((item: string) => item && item.trim() !== "")
            .map((el: any) => {
                return {name: el, image: ""};
            });
        event.target.value = ''
        setNewList({...newList, items: [...newList.items, ...items]});
    };

    function editItem(id: number, e: React.ChangeEvent<HTMLInputElement>) {
        const newName = e.target.value
        setNewList((prevList: NewList) => {
            const updatedItems = prevList.items.map((item, index) => {
                if (index === id) {
                    return {...item, name: newName};
                }
                return item;
            });

            return {
                ...prevList,
                items: updatedItems,
            };
        });
    }

    function removeItem(index: number) {
        const items = newList.items
        items.splice(index, 1)
        setNewList({...newList, items})
    }

    const convertToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
    };

    const importImage = (event: React.ChangeEvent<HTMLInputElement>, id: number) => {
        const file = event.target.files?.[0];
        const MAX_FILE_SIZE = 1024 * 1024;
        if (file) {
            if (file.size > MAX_FILE_SIZE) {
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                const newImage = reader.result as string;

                setNewList((prevList: NewList) => {
                    const updatedItems = prevList.items.map((item, index) => {
                        if (index === id) {
                            return {...item, image: newImage};
                        }
                        return item;
                    });

                    // Include all properties of prevList when returning the new state
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
        setNewList((prevList: NewList) => {
            const updatedItems = prevList.items.map((item, index): InputItem => {
                if (index === id) {
                    return {...item, image: ""};
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
                    onBlur={e => setNewList({...newList, name: e.target.value})}
                />
                <TemplateTextArea
                    id='list_items'
                    placeholder='Vincenzo...'
                    rows={4}
                    onBlur={addTextAsItems}
                />
                <Button onClick={() => document.getElementById('add-items')?.click()}>Import images</Button>
                <input
                    id="add-items"
                    className="hidden"
                    multiple={true}
                    type="file"
                    accept="image/*"
                    onChange={addImagesAsItems}/>
            </Stack>
            <Stack spacing={1}>
                <Typography>items de la liste {newList.name}: </Typography>
                <Spotlight
                    className="group mx-auto grid justify-center max-w-sm items-start gap-6 lg:max-w-none lg:grid-cols-5"
                >
                    {
                        newList.items.map((el, index) => (
                            <Stack direction="row" spacing={3} key={"stack" + index}>
                                <TemplateEditionCard imageOnClick={(e) => importImage(e, index)}
                                                     onBlur={(e) => editItem(index, e)}
                                                     index={index}
                                                     title={el.name}
                                                     deleteOnClick={() => removeItem(index)}
                                                     image={el.image}
                                />
                            </Stack>
                        ))
                    }
                    {/* <TemplateEditionCard
                        onBlur={(e) => addItem(e)}
                        title={''}
                        image={''}
                    />*/}
                </Spotlight>
                <Button disabled={loading} onClick={saveList}>Save</Button>
            </Stack>
        </Stack>
    );
}
