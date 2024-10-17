import TemplatePage from "@/components/Template/TemplatePage";
import MyLists from "@/app/(default)/mylists/MyLists";

export const metadata = {
    title: "List Ranker - My lists",
    description: "Page description",
};


export default function List() {

    return (
        <TemplatePage title='My lists' description=''>
            <MyLists/>
        </TemplatePage>
    );
}
