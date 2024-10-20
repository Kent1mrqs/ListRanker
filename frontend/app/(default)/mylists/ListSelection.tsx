"use client";
import {Stack, Typography} from "@mui/material";
import React, {useCallback, useEffect, useState} from "react";
import {fetchData} from "@/app/api";
import Spotlight from "@/components/spotlight";
import {Item, Lists} from "@/app/(default)/mylists/ListCreation";
import TemplateButton from "@/components/Template/TemplateButton";
import {TemplateEditionItemCardOrChip, TemplateItemCardOrChip} from "@/components/Template/TemplateCard";
import IconEdit from "@/components/Icons/IconEdit";

export type ListProps = {
    lists: Lists;
    fetchLists: () => void;
    currentListId: number;
    setCurrentListId: (id: number) => void;
    creationMode: boolean;
    setCreationMode: (bool: boolean) => void;
};


export default function ListSelection({
                                          lists,
                                          fetchLists,
                                          setCreationMode,
                                          creationMode,
                                          currentListId,
                                          setCurrentListId
                                      }: ListProps) {
    const [currentItems, setCurrentItems] = useState<Item[]>([])
    const [editionMode, setEditionMode] = useState<boolean>(false)

    useEffect(() => {
        fetchLists();
    }, [fetchLists]);
    const fetchItems = useCallback((list_id: number) => {
        fetchData<Lists>('items/' + list_id)
            .then(result => setCurrentItems(result))
            .catch(err => console.error(err.message));
    }, []);

    function selectList(id: number) {
        setEditionMode(false)
        setCreationMode(false)
        if (id === currentListId) {
            setCurrentListId(0)
        } else {
            setCurrentListId(id)
            fetchItems(id)
        }
    }


    return (
        <Stack spacing={3} justifyContent='center' mb={4}>
            <Stack spacing={1} justifyContent='center'>
                <Spotlight
                    className="group mx-auto grid max-w-sm items-start gap-6 lg:max-w-none lg:grid-cols-6"
                >
                    {lists.map((li, index) => (
                        <TemplateButton key={index}
                                        text={li.name}
                                        icon={<IconEdit/>}
                                        onClickIcon={() => setEditionMode(!editionMode)}
                                        selected={li.list_id === currentListId}
                                        onClick={() => selectList(Number(li.list_id))}
                        />
                    ))}
                    <TemplateButton text='New list'
                                    variant='outlined'
                                    onClick={() => {
                                        setEditionMode(false)
                                        setCreationMode(true)
                                    }}
                    />
                </Spotlight>
            </Stack>
            {!!currentListId && !creationMode && <Stack spacing={1} justifyContent='center'>
                {currentItems[0] ?
                    <Spotlight
                        className="group mx-auto grid max-w-sm items-start gap-6 lg:max-w-none lg:grid-cols-6"
                    >
                        {currentItems?.map((el, index) => (
                            <div className="mx-auto max-w-3xl pb-12 text-center md:pb-20">
                                {editionMode ? <TemplateEditionItemCardOrChip title={el.name} image={el.image}/> :
                                    <TemplateItemCardOrChip title={el.name} image={el.image}/>}
                            </div>
                        ))}
                    </Spotlight> : <Typography>Empty list</Typography>}
			</Stack>}
        </Stack>
    );
}
