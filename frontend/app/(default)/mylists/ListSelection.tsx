"use client";
import {Button, Stack, Typography} from "@mui/material";
import React, {useCallback, useState} from "react";
import {deleteData, editData, fetchData} from "@/app/api";
import Spotlight from "@/components/spotlight";
import {Item, Lists, NewList} from "@/app/(default)/mylists/ListCreation";
import TemplateButton from "@/components/Template/TemplateButton";
import {TemplateEditionItemCardOrChip, TemplateItemCardOrChip} from "@/components/Template/TemplateCard";
import {List} from "@/app/(default)/workflow_creation/ChooseList";
import {useUserContext} from "@/app/UserProvider";
import {useListsContext} from "@/app/ListsProvider";
import {fetchLists, saveList} from "@/app/(default)/mylists/ListServices";
import TemplateInput from "@/components/Template/TemplateInput";

export type ListProps = {
    currentList: List;
    setCurrentList: (list: List) => void;
    creationMode: boolean;
    setCreationMode: (bool: boolean) => void;
};

type ListItems = {
    name: string,
    id: number,
    items: Item[]
}


export default function ListSelection({
                                          setCreationMode,
                                          creationMode,
                                          currentList,
                                          setCurrentList
                                      }: ListProps) {
    const {userId} = useUserContext();
    const [currentItems, setCurrentItems] = useState<Item[]>([])
    const [editionMode, setEditionMode] = useState<boolean>(false)
    const [editedList, setEditedList] = useState<ListItems>({name: "", id: 0, items: []})
    const {lists, setLists} = useListsContext();

    const fetchItems = useCallback((list_id: number) => {
        fetchData<Lists>('items/' + list_id)
            .then(result => setCurrentItems(result))
            .catch(err => console.error(err.message));
    }, []);

    const handleDownload = () => {
        const data = {
            name: currentList.name,
            items: currentItems
        }
        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], {type: "application/json"});
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = "data.json";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


    async function deleteList() {
        deleteData("list/" + currentList.id)
            .then(() => {
                fetchLists(userId, setLists)
                setCurrentItems([])
                setCurrentList({name: '', id: 0})
            })
    }

    async function saveEditedList() {
        editData("list-edit/" + currentList.id, editedList)
            .then(() => {
                setEditionMode(false)
                fetchLists(userId, setLists)
            })
    }


    const importList = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) {
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const result = e?.target?.result;
            if (typeof result === 'string') {
                try {
                    const jsonData: NewList = JSON.parse(result);
                    saveList({...jsonData, user_id: userId}, userId, setLists);
                } catch (error) {
                    console.error("Error when analysing json", error);
                    alert("Selected file is not a valid json");
                }
            }
        };
        reader.readAsText(file);
    };

    function selectList(list: List) {
        setEditionMode(false)
        setCreationMode(false)
        if (list.id === currentList.id) {
            setCurrentList({name: "", id: 0})
        } else {
            setCurrentList(list)
            fetchItems(list.id)
        }
    }


    return (
        <Stack spacing={3} justifyContent='center' mb={4}>
            <Stack spacing={1} justifyContent='center'>
                <Spotlight
                    className="group mx-auto grid max-w-sm items-start gap-6 lg:max-w-none lg:grid-cols-6"
                >
                    {lists.map((li, index) => (
                        <>
                            {editionMode && li.list_id === currentList.id ?
                                <TemplateInput placeholder={li.name} onChange={(e) => setEditedList(prevState => {
                                    return {
                                        ...prevState,
                                        name: e.target.value
                                    }
                                })}/> :
                                <TemplateButton key={index}
                                                text={li.name}
                                    //icon={<IconEdit/>}
                                    // onClickIcon={() => setEditionMode(!editionMode)}
                                                selected={li.list_id === currentList.id}
                                                onClick={() => selectList({name: li.name, id: li.list_id})}
                                />}
                        </>
                    ))}
                    <TemplateButton text='New list'
                                    variant='outlined'
                                    onClick={() => {
                                        setEditionMode(false)
                                        setCreationMode(true)
                                    }}
                    />
                </Spotlight>
                <Stack direction="row" justifyContent="center" spacing={3}>
                    <Button disabled={!currentList.id}
                            onClick={() => setEditionMode(!editionMode)}>Edit list</Button>
                    <Button disabled={!currentList.id} onClick={() => deleteList()}>Delete list</Button>
                    <Button disabled={!editionMode || !currentList.id} onClick={() => saveEditedList()}>Save
                        list</Button>
                    <Button onClick={() => handleDownload()}>Download list</Button>
                    <Button onClick={() => document.getElementById('file-input')?.click()}>Import list</Button>
                    <input
                        id="file-input"
                        className="hidden"
                        type="file"
                        accept=".json"
                        onChange={importList}/>
                </Stack>
            </Stack>
            {!!currentList.id && !creationMode && <ShowItems currentItems={currentItems} editionMode={editionMode}/>}
        </Stack>
    );
}


function ShowItems({currentItems, editionMode}: { currentItems: Item[], editionMode: boolean }) {
    return (
        <>
            <Stack spacing={1} justifyContent='center'>
                {currentItems[0] ?
                    <Spotlight
                        className="group mx-auto grid max-w-sm items-start gap-6 lg:max-w-none lg:grid-cols-6"
                    >
                        {currentItems?.map((el) => (
                            <div className="mx-auto max-w-3xl pb-12 text-center md:pb-20">
                                {editionMode ? <TemplateEditionItemCardOrChip title={el.name} image={el.image}/> :
                                    <TemplateItemCardOrChip title={el.name} image={el.image}/>}
                            </div>
                        ))}
                    </Spotlight> : <Typography>Empty list</Typography>}
            </Stack>
        </>
    )
}