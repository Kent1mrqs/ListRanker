"use client";
import {Button, Stack, Typography} from "@mui/material";
import React, {useCallback, useEffect, useState} from "react";
import {fetchData, postData} from "@/app/api";
import Spotlight from "@/components/spotlight";
import {Item, Lists, NewList} from "@/app/(default)/mylists/ListCreation";
import TemplateButton from "@/components/Template/TemplateButton";
import {TemplateEditionItemCardOrChip, TemplateItemCardOrChip} from "@/components/Template/TemplateCard";
import IconEdit from "@/components/Icons/IconEdit";
import {List} from "@/app/(default)/workflow_creation/ChooseList";
import {useUserContext} from "@/app/UserProvider";

export type ListProps = {
    lists: Lists;
    fetchLists: () => void;
    currentList: List;
    setCurrentList: (list: List) => void;
    creationMode: boolean;
    setCreationMode: (bool: boolean) => void;
};


export default function ListSelection({
                                          lists,
                                          fetchLists,
                                          setCreationMode,
                                          creationMode,
                                          currentList,
                                          setCurrentList
                                      }: ListProps) {
    const {userId} = useUserContext();
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

    async function saveList(newList: NewList) {
        try {
            await postData<NewList, NewList>('lists', newList).then(() => {
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

    async function deleteList() {

    }

    const importList = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) {
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const result = e?.target?.result;
            console.log(result)
            if (typeof result === 'string') {
                try {
                    const jsonData: NewList = JSON.parse(result);
                    saveList({...jsonData, user_id: userId});
                } catch (error) {
                    console.error("Erreur lors de l'analyse du JSON :", error);
                    alert("Le fichier sélectionné n'est pas un JSON valide.");
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
                        <TemplateButton key={index}
                                        text={li.name}
                                        icon={<IconEdit/>}
                                        onClickIcon={() => setEditionMode(!editionMode)}
                                        selected={li.list_id === currentList.id}
                                        onClick={() => selectList({name: li.name, id: li.list_id})}
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
                <Stack direction="row" justifyContent="center" spacing={3}>
                    <Button onClick={() => deleteList()}>Delete list</Button>
                    <Button onClick={() => handleDownload()}>Download list</Button>
                    <input
                        className="btn-sm bg-gradient-to-t from-indigo-600 to-indigo-500 bg-[length:100%_100%] bg-[bottom] py-[5px] text-white shadow-[inset_0px_1px_0px_0px_theme(colors.white/.16)] hover:bg-[length:100%_150%] max-w-[200px] w-full"
                        type="file"
                        accept=".json"
                        onChange={importList}/>
                </Stack>
            </Stack>
            {!!currentList.id && !creationMode && <Stack spacing={1} justifyContent='center'>
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
			</Stack>}
        </Stack>
    );
}
