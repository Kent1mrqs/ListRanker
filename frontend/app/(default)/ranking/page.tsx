import ListSelection from "@/app/(default)/ranking/ListSelection";
import DisplaySelection from "@/app/(default)/ranking/DisplaySelection";
import CreationMethod from "@/app/(default)/ranking/CreationMethod";

export const metadata = {
    title: "Home - Open PRO",
    description: "Page description",
};


export default function Ranking() {

    return (
        <>
            <ListSelection/>
            <DisplaySelection/>
            <CreationMethod/>
        </>
    );
}
