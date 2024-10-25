"use client";
import Link from "next/link";
import TemplateInput from "@/components/Template/TemplateInput";
import TemplateButton from "@/components/Template/TemplateButton";

export const metadata = {
    title: "Sign Up - Open PRO",
    description: "Page description",
};

interface Input {
    label: string;
    id: string;
    placeholder: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

type Inputs = Input[]

interface SignProps {
    inputs: Inputs;
    sign: string;
    onClick: () => void;
}

const redirect: { [key: string]: string } = {
    in: "signup",
    up: "signin"
}

const message: { [key: string]: string } = {
    in: "Don't you have an account?  ",
    up: "Already have an account?  "
}
const title: { [key: string]: string } = {
    in: "Welcome back",
    up: "Create an account"
}
const button: { [key: string]: string } = {
    in: "Sign in",
    up: "Sign up"
}

export default function SignForm({sign, inputs, onClick}: SignProps) {

    return (
        <div className="py-12 md:py-20">
            <div className="pb-12 text-center">
                <h1 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,theme(colors.gray.200),theme(colors.indigo.200),theme(colors.gray.50),theme(colors.indigo.300),theme(colors.gray.200))] bg-[length:200%_auto] bg-clip-text font-nacelle text-3xl font-semibold text-transparent md:text-4xl">
                    {title[sign]}
                </h1>
            </div>
            <form className="mx-auto max-w-[400px]">
                <div className="space-y-5">
                    {inputs.map((el, index) => (
                        <TemplateInput key={index}
                                       id={el.id}
                                       placeholder={el.placeholder}
                                       onChange={el.onChange}
                                       label={el.label}
                                       variant="sign"
                        />
                    ))}
                </div>
                <div className="mt-6 space-y-5">
                    <TemplateButton onClick={onClick} text={button[sign]} variant='sign'/>
                </div>
            </form>
            <div className="mt-6 text-center text-sm text-indigo-200/65">
                {message[sign]}
                <Link className="font-medium text-indigo-500" href={"/" + redirect[sign]}>
                    {button[sign === 'in' ? 'up' : 'in']}
                </Link>
            </div>
        </div>
    );
}
