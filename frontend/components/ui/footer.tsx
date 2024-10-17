import Logo from "./logo";
import Image from "next/image";
import FooterIllustration from "@/public/images/footer-illustration.svg";

function TextLink({href, text}: { href: string; text: string }) {
    return (
        <a
            className="text-indigo-200/65 transition hover:text-indigo-500"
            href={href}
        >
            {text}
        </a>
    );
}

const openSourceLinks = [
    {text: "Contribute on GitHub", href: "https://github.com/Kent1mrqs/ListRanker"},
    {text: "Report an Issue", href: "https://github.com/your-repo/issues"},
    {text: "Contributors", href: "https://github.com/your-repo/graphs/contributors"},
    {text: "MIT License", href: "https://opensource.org/licenses/MIT"},
];

const documentationLinks = [
    {text: "Getting Started", href: "https://your-docs.com"},
    {text: "API Reference", href: "https://your-docs.com"},
    {text: "Tutorials", href: "https://your-docs.com"},
    {text: "Learn More", href: "https://your-docs.com"},
];

const communityLinks = [
    {text: "Follow on Twitter", href: "https://twitter.com/yourprofile"},
    {text: "Blog on Medium", href: "https://medium.com/@yourprofile"},
    {text: "Join Discussions", href: "https://github.com/your-repo/discussions"},
    {text: "Code of Conduct", href: "https://your-repo.com/code-of-conduct"},
];

const legalLinks = [
    {text: "Terms of Service", href: "https://your-repo.com/terms"},
    {text: "Privacy Policy", href: "https://your-repo.com/privacy"},
    {text: "License", href: "https://your-repo.com/license"},
];

export default function Footer() {
    return (
        <footer>
            <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
                <div
                    className="pointer-events-none absolute bottom-0 left-1/2 -z-10 -translate-x-1/2"
                    aria-hidden="true"
                >
                    <Image
                        className="max-w-none"
                        src={FooterIllustration}
                        width={1076}
                        height={378}
                        alt="Footer illustration"
                    />
                </div>

                <div
                    className="grid grid-cols-2 justify-center gap-12 py-8 sm:grid-rows-[auto_auto] md:grid-cols-4 md:grid-rows-[auto_auto] md:py-12 lg:grid-cols-[repeat(4,minmax(0,140px))_1fr] lg:grid-rows-1 xl:gap-20">
                    <div className="flex flex-col items-center space-y-2">
                        <h3 className="text-sm font-medium text-gray-200">Open Source</h3>
                        <ul className="space-y-2 text-sm text-center">
                            {openSourceLinks.map((link) => (
                                <li key={link.text}>
                                    <TextLink href={link.href} text={link.text}/>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="flex flex-col items-center space-y-2">
                        <h3 className="text-sm font-medium text-gray-200">Documentation</h3>
                        <ul className="space-y-2 text-sm text-center">
                            {documentationLinks.map((link) => (
                                <li key={link.text}>
                                    <TextLink href={link.href} text={link.text}/>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="flex flex-col items-center space-y-2">
                        <h3 className="text-sm font-medium text-gray-200">Community</h3>
                        <ul className="space-y-2 text-sm text-center">
                            {communityLinks.map((link) => (
                                <li key={link.text}>
                                    <TextLink href={link.href} text={link.text}/>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="flex flex-col items-center space-y-2">
                        <h3 className="text-sm font-medium text-gray-200">Legal</h3>
                        <ul className="space-y-2 text-sm text-center">
                            {legalLinks.map((link) => (
                                <li key={link.text}>
                                    <TextLink href={link.href} text={link.text}/>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="col-span-2 md:col-span-4 lg:col-span-1 lg:text-right flex flex-col items-center">
                        <div className="mb-3">
                            <Logo/>
                        </div>
                        <div className="text-sm text-center">
                            <p className="mb-3 text-indigo-200/65">
                                © 2024 ListRanker. Licensed under{" "}
                                <TextLink
                                    href="https://opensource.org/licenses/MIT"
                                    text="MIT"
                                />
                                .
                            </p>
                            <p className="mb-3 text-indigo-200/65">
                                Built with ❤️ using{" "}
                                <TextLink href="https://reactjs.org" text="React"/>,{" "}
                                <TextLink
                                    href="https://www.typescriptlang.org"
                                    text="TypeScript"
                                />{" "}
                                &{" "}
                                <TextLink href="https://tailwindcss.com" text="TailwindCSS"/>.
                            </p>
                            <ul className="inline-flex gap-1 justify-center">
                                <li>
                                    <a
                                        className="flex items-center justify-center text-indigo-500 transition hover:text-indigo-400"
                                        href="https://twitter.com/yourprofile"
                                        aria-label="Twitter"
                                    >
                                        <svg
                                            className="h-8 w-8 fill-current"
                                            viewBox="0 0 32 32"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path d="...Twitter Icon Path..."/>
                                        </svg>
                                    </a>
                                </li>
                                <li>
                                    <a
                                        className="flex items-center justify-center text-indigo-500 transition hover:text-indigo-400"
                                        href="https://medium.com/@yourprofile"
                                        aria-label="Medium"
                                    >
                                        <svg
                                            className="h-8 w-8 fill-current"
                                            viewBox="0 0 32 32"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path d="...Medium Icon Path..."/>
                                        </svg>
                                    </a>
                                </li>
                                <li>
                                    <a
                                        className="flex items-center justify-center text-indigo-500 transition hover:text-indigo-400"
                                        href="https://github.com/your-repo"
                                        aria-label="Github"
                                    >
                                        <svg
                                            className="h-8 w-8 fill-current"
                                            viewBox="0 0 32 32"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path d="...GitHub Icon Path..."/>
                                        </svg>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}