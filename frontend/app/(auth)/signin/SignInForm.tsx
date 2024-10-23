"use client";
import {postData} from "@/app/api";
import {useState} from "react";
import SignForm from "@/app/(auth)/SignForm";
import {useUserContext} from "@/app/UserProvider";
import {useRouter} from "next/navigation";
import {validId} from "@/app/(auth)/signup/SignUpForm";
import {useNotification} from "@/app/NotificationProvider";

export const metadata = {
    title: "Sign Up - Open PRO",
    description: "Page description",
};

export interface NewUser {
    id: number;
    username: string,
    password_hash: string,
}

const default_user = {
    id: 0,
    username: '',
    password_hash: ''
}

export default function SignInForm() {

    const router = useRouter();
    const [user, setUser] = useState<NewUser>(default_user)
    const {setUserId} = useUserContext();
    const {showNotification} = useNotification();

    async function onClick() {
        if (validId(user.username, user.password_hash)) {
            try {
                await postData<NewUser, NewUser>('login', user).then((e) => {
                    setUserId(e.id)
                    showNotification("Login success", "success")
                    localStorage.setItem("userId", String(e.id));
                    router.push("/myrankings");
                });
            } catch (error) {
                if (error instanceof Error) {
                    showNotification(error.message, "error")
                    console.error(error.message);
                } else {
                    showNotification('An unknown error occurred', "error")
                    console.error('An unknown error occurred');
                }
            }
        } else {
            showNotification("unvalid", "error")
            console.error("unvalid")
        }
    }

    return (
        <SignForm sign='in'
                  onClick={onClick}
                  inputs={[
                      {
                          label: 'Username',
                          placeholder: 'Your username',
                          id: 'username',
                          onChange: (e) => setUser(prevState => {
                              return {
                                  ...prevState,
                                  username: e.target.value
                              }
                          })
                      },
                      {
                          label: 'Password',
                          placeholder: 'Your password',
                          id: 'password',
                          onChange: (e) => setUser(prevState => {
                              return {
                                  ...prevState,
                                  password_hash: e.target.value
                              }
                          })
                      }
                  ]}/>
    );
}
