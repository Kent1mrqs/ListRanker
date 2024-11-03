"use client";
import React, {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {Lists} from "@/app/(default)/mylists/ListCreation";
import {fetchLists} from "@/app/(default)/mylists/ListServices";

interface ListsContextType {
    lists: Lists;
    setLists: React.Dispatch<React.SetStateAction<Lists>>;
}

const ListsContext = createContext<ListsContextType | undefined>(undefined);

export const ListsProvider = ({children}: { children: ReactNode }) => {
    const [lists, setLists] = useState<Lists>([]);

    useEffect(() => {
        fetchLists(setLists);
    }, [fetchLists]);

    return (
        <ListsContext.Provider value={{lists, setLists}}>
            {children}
        </ListsContext.Provider>
    );
};

export const useListsContext = () => {
    const context = useContext(ListsContext);
    if (!context) {
        throw new Error("useListsContext must be used within a ListsProvider");
    }
    return context;
};
