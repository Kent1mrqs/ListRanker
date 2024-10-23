"use client"
import React, {createContext, ReactNode, useContext, useState} from 'react';
import Toast from "@/components/ui/toast";
import IconSuccess from "@/components/Icons/IconSuccess";
import IconError from "@/components/Icons/IconError";

type NotificationContextType = {
    showNotification: (message: string, message_type: string) => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};

const NotificationProvider: React.FC<{ children: ReactNode }> = ({children}) => {
    const [message, setMessage] = useState<string | null>(null);
    const [icon, setIcon] = useState<string | null>("success");


    const showNotification = (msg: string, message_type: string) => {
        setMessage(msg);
        setIcon(message_type);
        setTimeout(() => {
            setMessage(null);
        }, 3000);
    };

    return (
        <NotificationContext.Provider value={{showNotification}}>
            {children}
            {message && (
                <div className="fixed bottom-4 right-4">
                    <Toast message={message}
                           icon={icon === "success" ? <IconSuccess/> : <IconError/>}
                           onClose={() => setMessage(null)}/>
                </div>
            )}
        </NotificationContext.Provider>
    );
};

export default NotificationProvider;
