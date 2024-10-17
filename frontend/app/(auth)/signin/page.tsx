import SignInForm from "@/app/(auth)/signin/SignInForm";

export const metadata = {
    title: "Sign In - Open PRO",
    description: "Page description",
};

export default function SignIn() {
    return (
        <section>
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
                <SignInForm/>
            </div>
        </section>
    );
}
