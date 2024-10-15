import ListCreation from "@/app/(default)/list/ListCreation";
import ListSelection from "@/app/(default)/ranking/ListSelection";
import TemplatePage from "@/components/Template/TemplatePage";

export const metadata = {
    title: "Home - Open PRO",
    description: "Page description",
};


export default function List() {

    return (
        <TemplatePage title='My lists' description=''>
            <ListSelection/>
            <ListCreation/>
        </TemplatePage>
    );
}
