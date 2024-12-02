"use client";
import {Button, Stack, Typography} from "@mui/material";
import React, {useCallback, useState} from "react";
import {deleteData, editData, fetchData, postData} from "@/app/api";
import Spotlight from "@/components/spotlight";
import ListCreation, {InputItem, Item, NewRankings} from "@/app/(default)/mylists/ListCreation";
import TemplateButton from "@/components/Template/TemplateButton";
import {TemplateEditionCard, TemplateItemCardOrChip} from "@/components/Template/TemplateCard";
import {List} from "@/app/(default)/workflow_creation/ChooseList";
import {useUserContext} from "@/app/UserProvider";
import {useListsContext} from "@/app/ListsProvider";
import {fetchLists, saveList} from "@/app/(default)/mylists/ListServices";
import TemplateInput from "@/components/Template/TemplateInput";
import {useNotification} from "@/app/NotificationProvider";
import {smoothScrollToElement} from "@/app/utils";
import {usePathname, useRouter} from "next/navigation";

export type ListProps = {
    currentList: List;
    setCurrentList: (list: List) => void;
};

type ListItems = {
    name: string,
    id: number,
    items: InputItem[]
}


export default function ListSelection({
                                          currentList,
                                          setCurrentList
                                      }: ListProps) {
    const {userId} = useUserContext();
    const [creationMode, setCreationMode] = useState<boolean>(true)
    const [currentItems, setCurrentItems] = useState<Item[]>([])
    const [editionMode, setEditionMode] = useState<boolean>(false)
    const [editedList, setEditedList] = useState<ListItems>({name: "", id: 0, items: []})
    const {lists, setLists} = useListsContext();
    const {showNotification} = useNotification();
    const router = useRouter();
    const pathname = usePathname()

    const fetchItems = useCallback((list_id: number, redirect?: boolean) => {
        fetchData<Item[]>('items/' + list_id)
            .then(result => {
                if (redirect) {
                    smoothScrollToElement("step2")
                }
                setCurrentItems(result)
            })
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
        showNotification(currentList.name + " list downloaded", "success")

    };


    async function deleteList() {
        deleteData("list/" + currentList.id)
            .then(() => {
                fetchLists(setLists)
                setCurrentItems([])
                setCurrentList({name: '', id: 0})
                showNotification("List deleted", "success")
            })
            .catch((e) => showNotification('Error : ' + e.message, "error"))

    }

    function newList() {
        if (pathname !== '/mylists') {
            router.push('/mylists')
        } else {
            setCurrentItems([])
            setCurrentList({name: '', id: 0})
            setEditionMode(false)
            setCreationMode(true)
        }
    }

    async function saveEditedList() {
        editData("list-edit/" + currentList.id, editedList)
            .then(() => {
                setEditionMode(false)
                fetchLists(setLists)
                showNotification("List edited", "success")
            })
            .catch((e) => showNotification('Error : ' + e.message, "error"))
    }


    const importList = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) {
            showNotification('No file', "error")
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const result = e?.target?.result;
            if (typeof result === 'string') {
                try {
                    const jsonData: NewRankings = JSON.parse(result);
                    saveList({...jsonData, user_id: userId}).then(() => {
                        showNotification('List imported', "success")
                        fetchLists(setLists);
                    });
                } catch (error) {
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
            fetchItems(list.id, true)
        }
    }

    function addItem() {
        postData("item-create/" + currentList.id, {name: "", image: ""})
            .then(() => {
                showNotification('Item created', "success")
                fetchItems(currentList.id)
            })
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
                                                selected={li.list_id === currentList.id}
                                                onClick={() => selectList({name: li.name, id: li.list_id})}
                                />}
                        </>
                    ))}
                    <TemplateButton text='New list'
                                    variant='outlined'
                                    onClick={newList}
                    />
                    <Button onClick={() => document.getElementById('file-input')?.click()}>Import list</Button>
                    <input
                        id="file-input"
                        className="hidden"
                        type="file"
                        accept=".json"
                        onChange={importList}/>
                </Spotlight>
                {!creationMode && pathname === '/mylists' && <ShowActionButtons
					setEditedList={setEditedList}
					currentList={currentList}
					saveEditedList={saveEditedList}
					deleteList={deleteList}
					importList={importList}
					addItem={addItem}
					currentItems={currentItems}
					editionMode={editionMode}
					setEditionMode={setEditionMode}
					handleDownload={handleDownload}
				/>}
            </Stack>
            {!!currentList.id && !creationMode &&
				<ShowItems fetchItems={fetchItems} currentItems={currentItems} editionMode={editionMode}/>}
            {creationMode && pathname === '/mylists' && <ListCreation/>}
        </Stack>
    );
}

type ActionProps = {
    currentList: List,
    setEditedList: (list: ListItems) => void,
    setEditionMode: (bool: boolean) => void,
    editionMode: boolean,
    deleteList: () => void,
    saveEditedList: () => void,
    importList: (event: React.ChangeEvent<HTMLInputElement>) => void,
    addItem: () => void,
    currentItems: Item[],
    handleDownload: () => void
}

function ShowActionButtons({
                               currentList,
                               setEditedList,
                               setEditionMode,
                               editionMode,
                               deleteList,
                               saveEditedList,
                               importList,
                               addItem,
                               currentItems,
                               handleDownload
                           }: ActionProps
) {
    return (
        <Stack direction="row" justifyContent="center" spacing={3}>
            <Button disabled={!currentList.id}
                    onClick={() => {
                        setEditedList({id: currentList.id, name: currentList.name, items: currentItems})
                        setEditionMode(!editionMode)
                    }}>Edit list</Button>
            <Button disabled={!currentList.id} onClick={deleteList}>Delete list</Button>
            <Button disabled={!editionMode} onClick={saveEditedList}>Save
                list</Button>
            <Button disabled={!currentList.id} onClick={handleDownload}>Download list</Button>

            <Button
                disabled={!editionMode}
                onClick={addItem}
            >
                Add item
            </Button>
        </Stack>
    )
}


function ShowItems({fetchItems, currentItems, editionMode}: {
    currentItems: Item[],
    fetchItems: (lid_id: number) => void,
    editionMode: boolean
}) {
    const {showNotification} = useNotification();

    function editItem(item: Item, key: string, value: string) {
        editData('item-edit/' + item.id, {...item, [key]: value})
            .then(() => {
                showNotification("Item edited", "success")

                if (item.list_id) {
                    fetchItems(item.list_id)
                }
            })

    }

    function deleteItem(item: Item) {
        deleteData('item-delete/' + item.id)
            .then(() => {
                showNotification("Item " + item.name + " deleted from list", "success")
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