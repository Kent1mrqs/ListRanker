import DisplaySelection from "@/app/(default)/ranking/DisplaySelection";
import CreationMethod from "@/app/(default)/ranking/CreationMethod";
import ChooseList from "@/app/(default)/ranking/ChooseList";

export const metadata = {
    title: "Home - Open PRO",
    description: "Page description",
};


export default function Ranking() {

    return (
        <>
            <ChooseList/>
            <DisplaySelection/>
            <CreationMethod/>
        </>
    );
}
