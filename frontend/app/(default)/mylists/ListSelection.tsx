"use client";
import {Button, Stack, Typography} from "@mui/material";
import React, {useCallback, useState} from "react";
import {deleteData, editData, fetchData, postData} from "@/app/api";
import Spotlight from "@/components/spotlight";
import {InputItem, Item, NewList} from "@/app/(default)/mylists/ListCreation";
import TemplateButton from "@/components/Template/TemplateButton";
import {TemplateEditionCard, TemplateItemCardOrChip} from "@/components/Template/TemplateCard";
import {List} from "@/app/(default)/workflow_creation/ChooseList";
import {useUserContext} from "@/app/UserProvider";
import {useListsContext} from "@/app/ListsProvider";
import {fetchLists, saveList} from "@/app/(default)/mylists/ListServices";
import TemplateInput from "@/components/Template/TemplateInput";
import {useNotification} from "@/app/NotificationProvider";

export type ListProps = {
    currentList: List;
    setCurrentList: (list: List) => void;
    creationMode: boolean;
    setCreationMode: (bool: boolean) => void;
};

type ListItems = {
    name: string,
    id: number,
    items: InputItem[]
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
    const {showNotification} = useNotification();

    const fetchItems = useCallback((list_id: number) => {
        fetchData<Item[]>('items/' + list_id)
            .then(result => setCurrentItems(result))
            .catch(err => {
                showNotification("Error when fetching items : " + err.message, "error")
                console.error(err.message)
            });
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
                showNotification("List deleted", "success")
            })
            .catch((e) => showNotification('Error : ' + e.message, "error"))

    }

    async function saveEditedList() {
        editData("list-edit/" + currentList.id, editedList)
            .then(() => {
                setEditionMode(false)
                fetchLists(userId, setLists)
                showNotification("List edited", "success")
            })
            .catch((e) => showNotification('Error : ' + e.message, "error"))
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
                    showNotification('Error', "error")
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

    function addItem() {
        postData("item-create/" + currentList.id, {name: "", image: ""})
            .then(() => fetchItems(currentList.id))
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
                                <TemplateInput
                                    placeholder={li.name}
                                    onChange={(e) => setEditedList(prevState => {
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
                            onClick={() => {
                                setEditedList({id: currentList.id, name: currentList.name, items: currentItems})
                                setEditionMode(!editionMode)
                            }}>Edit list</Button>
                    <Button disabled={!currentList.id} onClick={() => deleteList()}>Delete list</Button>
                    <Button disabled={!editionMode} onClick={() => saveEditedList()}>Save
                        list</Button>
                    <Button onClick={() => handleDownload()}>Download list</Button>
                    <Button onClick={() => document.getElementById('file-input')?.click()}>Import list</Button>
                    <input
                        id="file-input"
                        className="hidden"
                        type="file"
                        accept=".json"
                        onChange={importList}/>
                    <Button
                        disabled={!editionMode}
                        onClick={addItem}
                    >
                        Add item
                    </Button>
                </Stack>
            </Stack>
            {!!currentList.id && !creationMode &&
				<ShowItems fetchItems={fetchItems} currentItems={currentItems} editionMode={editionMode}/>}
        </Stack>
    );
}


function ShowItems({fetchItems, currentItems, editionMode}: {
    currentItems: Item[],
    fetchItems: (lid_id: number) => void,
    editionMode: boolean
}) {
    function editItem(item: Item, key: string, value: string) {
        editData('item-edit/' + item.id, {...item, [key]: value})
            .then(() => {
                if (item.list_id) {
                    fetchItems(item.list_id)
                }
            })

    }

    function deleteItem(item: Item) {
        deleteData('item-delete/' + item.id)
            .then(() => {
                if (item.list_id) {
                    fetchItems(item.list_id)
                }
            })

    }

    const importImage = (event: React.ChangeEvent<HTMLInputElement>, el: Item) => {
        const file = event.target.files?.[0];
        const MAX_FILE_SIZE = 1024 * 1024;
        if (file) {
            if (file.size > MAX_FILE_SIZE) {
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                const newImage = reader.result as string;

                editItem(el, "image", newImage);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <>
            <Stack spacing={1} justifyContent='center'>
                {currentItems[0] ?
                    <Spotlight
                        className="group mx-auto grid max-w-sm items-start gap-6 lg:max-w-none lg:grid-cols-6"
                    >
                        {currentItems
                            .sort((a, b) => a.id > b.id ? 1 : -1)
                            .map((el, index) => (
                                <div className="mx-auto max-w-3xl text-center">
                                    {editionMode ?
                                        <TemplateEditionCard imageOnClick={(e) => importImage(e, el)}
                                                             onBlur={(e) => editItem(el, "name", e.target.value)}
                                                             index={index}
                                                             title={el.name}
                                                             deleteOnClick={() => deleteItem(el)}
                                                             image={el.image}/> :
                                        <TemplateItemCardOrChip title={el.name} image={el.image}/>}
                                </div>
                            ))}
                    </Spotlight> : <Typography>Empty list</Typography>}
            </Stack>
        </>
    )
}