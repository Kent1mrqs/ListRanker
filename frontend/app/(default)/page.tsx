import ChooseList from "@/app/(default)/workflow_creation/ChooseList";
import DisplaySelection from "@/app/(default)/workflow_creation/DisplaySelection";
import CreationMethod from "@/app/(default)/workflow_creation/CreationMethod";

export const metadata = {
    title: "Home - Open PRO",
    description: "Page description",
};

export default function Home() {
    return (
        <>
            <ChooseList/>
            <DisplaySelection/>
            <CreationMethod/>
        </>
    );
}
