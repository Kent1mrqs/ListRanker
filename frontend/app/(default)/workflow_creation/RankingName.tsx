"use client";
import TemplatePage from "@/components/Template/TemplatePage";
import {NewRanking} from "@/app/(default)/workflow_creation/WorkflowCreation";
import TemplateInput from "@/components/Template/TemplateInput";
import {Stack} from "@mui/material";
import {isValidInput} from "@/app/(default)/mylists/ListCreation";
import TemplateButton from "@/components/Template/TemplateButton";
import {useState} from "react";
import {useRouter} from "next/navigation";

type SaveRankingProps = {
    newRanking: {
        creation_method: string;
        user_id: number | null;
        list_id: number;
        name: string;
        ranking_type: string
    };
    saveRanking: () => void;
    setNewRanking: (newValue: (prevValue: NewRanking) => {
        list_id: number;
        user_id: number | null;
        name: string;
        creation_method: string;
        ranking_type: string
    }) => void;
}

function isValid(ranking: NewRanking) {
    return isValidInput(ranking.name) && ranking.ranking_type && ranking.creation_method && ranking.list_id
}

export default function RankingName({newRanking, saveRanking, setNewRanking}: SaveRankingProps) {
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    function onClick() {
        if (isValid(newRanking)) {
            saveRanking()
            setError(null)
            router.push("myrankings")
        } else {
            setError("err")
        }
    }

    return (
        <TemplatePage
            title="Step 4 : Ranking Name"
            description="Choose a name for your ranking."
        >
            <Stack spacing={2} alignItems="center">
                <TemplateInput label='Title'
                               id='ranking_title'
                               variant={error === null ? 'blue' : "error"}
                               placeholder="ex: Meilleurs kdrama..."
                               onChange={(e) => setNewRanking((prevValue: NewRanking) => {
                                   return {
                                       ...prevValue,
                                       name: e.target.value,
                                   }
                               })}/>
                {/*                <Typography>List : {newRanking.list_id}</Typography>
                <Typography>List : {newRanking.ranking_type}</Typography>
                <Typography>List : {newRanking.creation_method}</Typography>*/}
                <TemplateButton onClick={onClick} text="Create" variant={'blue'}/>

            </Stack>
        </TemplatePage>
    );
}
