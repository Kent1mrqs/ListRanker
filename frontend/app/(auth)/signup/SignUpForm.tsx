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
        <div className="py-12 md:py-20">
            <div className="pb-12 text-center">
                <h1 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,theme(colors.gray.200),theme(colors.indigo.200),theme(colors.gray.50),theme(colors.indigo.300),theme(colors.gray.200))] bg-[length:200%_auto] bg-clip-text font-nacelle text-3xl font-semibold text-transparent md:text-4xl">
                    Create an account
                </h1>
            </div>
            <form className="mx-auto max-w-[400px]">
                <div className="space-y-5">
                    <div>
                        <label
                            className="mb-1 block text-sm font-medium text-indigo-200/65"
                            htmlFor="name"
                        >
                            Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            onChange={(e) => setNewUser(prevState => {
                                return {
                                    ...prevState,
                                    username: e.target.value
                                }
                            })}
                            id="name"
                            type="text"
                            className="form-input w-full"
                            placeholder="Your full name"
                            required
                        />
                    </div>
                    <div>
                        <label
                            className="block text-sm font-medium text-indigo-200/65"
                            htmlFor="password"
                        >
                            Password <span className="text-red-500">*</span>
                        </label>
                        <input
                            onChange={(e) => setNewUser(prevState => {
                                return {
                                    ...prevState,
                                    password_hash: e.target.value
                                }
                            })}
                            id="password"
                            type="password"
                            className="form-input w-full"
                            placeholder="Password (at least 10 characters)"
                        />
                    </div>
                </div>
                <div className="mt-6 space-y-5">
                    <button
                        onClick={onClick}
                        className="btn w-full bg-gradient-to-t from-indigo-600 to-indigo-500 bg-[length:100%_100%] bg-[bottom] text-white shadow-[inset_0px_1px_0px_0px_theme(colors.white/.16)] hover:bg-[length:100%_150%]">
                        Register
                    </button>
                </div>
            </form>
            <div className="mt-6 text-center text-sm text-indigo-200/65">
                Already have an account?{" "}
                <Link className="font-medium text-indigo-500" href="/signin">
                    Sign in
                </Link>
            </div>
        </div>
    );
}
