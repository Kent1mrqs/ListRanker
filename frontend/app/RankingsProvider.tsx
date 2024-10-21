"use client";
import React, {createContext, ReactNode, useContext, useState} from "react";
import {useUserContext} from "@/app/UserProvider";
import {Rankings} from "@/app/(default)/mylists/ListCreation";

interface RankingsContextType {
    rankings: Rankings;
    setRankings: React.Dispatch<React.SetStateAction<Rankings>>;
}

const RankingsContext = createContext<RankingsContextType | undefined>(undefined);

export const RankingsProvider = ({children}: { children: ReactNode }) => {
    const [rankings, setRankings] = useState<Rankings>([]);
    const {userId} = useUserContext();
    return (
        <RankingsContext.Provider value={{rankings: rankings, setRankings: setRankings}}>
            {children}
        </RankingsContext.Provider>
    );
};

export const useRankingsContext = () => {
    const context = useContext(RankingsContext);
    if (!context) {
        throw new Error("useRankingsContext must be used within a RankingsProvider");
    }
    return context;
};
