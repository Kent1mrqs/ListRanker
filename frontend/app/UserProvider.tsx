"use client";
import React, {createContext, ReactNode, useContext, useEffect, useState} from "react";

interface UserContextType {
    userId: number | null;
    setUserId: React.Dispatch<React.SetStateAction<number | null>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({children}: { children: ReactNode }) => {
    const [userId, setUserId] = useState<number | null>(null);

    useEffect(() => {
        const storedUserId = Number(localStorage.getItem("userId"));
        if (storedUserId) {
            setUserId(storedUserId);
        }
    }, []);

    return (
        <UserContext.Provider value={{userId, setUserId}}>
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUserContext must be used within a UserProvider");
    }
    return context;
};
