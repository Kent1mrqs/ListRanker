import SignUpForm from "@/app/(auth)/signup/SignUpForm";

export const metadata = {
    title: "Sign Up - Open PRO",
    description: "Page description",
};

export default function SignUpPage() {

    return (
        <section>
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
                <SignUpForm/>
            </div>
        </section>
    );
}
