"use client";
import {postData} from "@/app/api";
import Link from "next/link";
import {useState} from "react";

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

export default function SignInForm() {

    const [user, setUser] = useState<NewUser>(default_user)
    const [error, setError] = useState<string | null>(null);

    async function onClick() {
        try {
            await postData<NewUser>('login', user).then((e) => {
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
        <div className="py-12 md:py-20">
            <div className="pb-12 text-center">
                <h1 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,theme(colors.gray.200),theme(colors.indigo.200),theme(colors.gray.50),theme(colors.indigo.300),theme(colors.gray.200))] bg-[length:200%_auto] bg-clip-text font-nacelle text-3xl font-semibold text-transparent md:text-4xl">
                    Welcome back
                </h1>
            </div>
            <form className="mx-auto max-w-[400px]">
                <div className="space-y-5">
                    <div>
                        <label
                            className="mb-1 block text-sm font-medium text-indigo-200/65"
                            htmlFor="username"
                        >
                            Username
                        </label>
                        <input
                            onChange={(e) => setUser(prevState => {
                                return {
                                    ...prevState,
                                    username: e.target.value
                                }
                            })}
                            id="username"
                            type="username"
                            className="form-input w-full"
                            placeholder="Your username"
                        />
                    </div>
                    <div>
                        <div className="mb-1 flex items-center justify-between gap-3">
                            <label
                                className="block text-sm font-medium text-indigo-200/65"
                                htmlFor="password"
                            >
                                Password
                            </label>
                            <Link
                                className="text-sm text-gray-600 hover:underline"
                                href="/reset-password"
                            >
                                Forgot?
                            </Link>
                        </div>
                        <input
                            onChange={(e) => setUser(prevState => {
                                return {
                                    ...prevState,
                                    password_hash: e.target.value
                                }
                            })}
                            id="password"
                            type="password"
                            className="form-input w-full"
                            placeholder="Your password"
                        />
                    </div>
                </div>
                <div className="mt-6 space-y-5">
                    <button
                        onClick={onClick}
                        className="btn w-full bg-gradient-to-t from-indigo-600 to-indigo-500 bg-[length:100%_100%] bg-[bottom] text-white shadow-[inset_0px_1px_0px_0px_theme(colors.white/.16)] hover:bg-[length:100%_150%]">
                        Sign in
                    </button>
                </div>
            </form>
            <div className="mt-6 text-center text-sm text-indigo-200/65">
                Don't you have an account?{" "}
                <Link className="font-medium text-indigo-500" href="/signup">
                    Sign Up
                </Link>
            </div>
        </div>
    );
}
