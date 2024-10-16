"use client";
import {postData} from "@/app/api";
import {useState} from "react";
import SignForm from "@/app/(auth)/SignForm";

export const metadata = {
    title: "Sign Up - Open PRO",
    description: "Page description",
};

export interface NewUser {
    username: string,
    password_hash: string,
}

const default_user = {
    username: '',
    password_hash: ''
}

export default function SignUpForm() {

    const [newUser, setNewUser] = useState<NewUser>(default_user)
    const [error, setError] = useState<string | null>(null);

    async function onClick() {
        try {
            await postData<NewUser>('register', newUser).then((e) => {
                console.log(e)
            });
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('An unknown error occurred');
            }
        }
    }

    if (error !== null) {
        console.error(error)
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
                                  hashed_password: e.target.value
                              }
                          })
                      }
                  ]}/>
    );
}
