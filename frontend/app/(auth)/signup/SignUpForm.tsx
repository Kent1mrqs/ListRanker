"use client";
import {postData} from "@/app/api";
import {useState} from "react";
import SignForm from "@/app/(auth)/SignForm";
import {useUserContext} from "@/app/UserProvider";
import {useRouter} from "next/navigation";

export const metadata = {
    title: "Sign Up - Open PRO",
    description: "Page description",
};

export interface NewUser {
    id: number,
    username: string,
    password_hash: string,
}

const default_user = {
    id: 0,
    username: '',
    password_hash: ''
}

export function validId(username: string, password: string) {
    return username.length > 3 && password.length > 5;
}

export default function SignUpForm() {
    const router = useRouter();
    const [newUser, setNewUser] = useState<NewUser>(default_user)
    const [error, setError] = useState<string | null>(null);
    const {setUserId} = useUserContext();

    async function onClick() {
        if (validId(newUser.username, newUser.password_hash)) {
            try {
                await postData<NewUser>('register', newUser).then((e) => {
                    setUserId(e.id.toString())
                    localStorage.setItem("userId", e.id.toString());
                    router.push("/myrankings");
                });
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError('An unknown error occurred');
                }
            }
        } else {
            setError("unvalid")
        }
    }

    if (error !== null) {
        console.error(error)
        setError(null);
    }

    return (
        <SignForm sign='up'
                  onClick={onClick}
                  inputs={[
                      {
                          label: 'Username',
                          placeholder: 'Your username',
                          id: 'username',
                          onChange: (e) => setNewUser(prevState => {
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
                          onChange: (e) => setNewUser(prevState => {
                              return {
                                  ...prevState,
                                  password_hash: e.target.value
                              }
                          })
                      }
                  ]}/>
    );
}
