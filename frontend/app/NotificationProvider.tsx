"use client"
import React, {createContext, ReactNode, useContext, useState} from 'react';
import Toast from "@/components/ui/toast";
import IconSuccess from "@/components/Icons/IconSuccess";
import IconError from "@/components/Icons/IconError";

type Notification = {
    id: number;
    message: string;
    type: string;
};

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
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const showNotification = (msg: string, message_type: string) => {
        const id = Date.now();
        setNotifications((prev) => [...prev, {id, message: msg, type: message_type}]);

        setTimeout(() => {
            setNotifications((prev) => prev.filter((notification) => notification.id !== id));
        }, 3000);
    };

    const removeNotification = (id: number) => {
        setNotifications((prev) => prev.filter((notification) => notification.id !== id));
    };

    return (
        <NotificationContext.Provider value={{showNotification}}>
            {children}
            <div className="fixed bottom-4 right-4 space-y-2">
                {notifications.map((notification) => (
                    <Toast
                        key={notification.id}
                        message={notification.message}
                        icon={notification.type === "success" ? <IconSuccess/> : <IconError/>}
                        onClose={() => removeNotification(notification.id)}
                    />
                ))}
            </div>
        </NotificationContext.Provider>
    );
};

export default NotificationProvider;
