"use client";
import TemplatePage from "@/components/Template/TemplatePage";
import {NewRanking} from "@/app/(default)/workflow_creation/WorkflowCreation";
import TemplateInput from "@/components/Template/TemplateInput";
import {Stack} from "@mui/material";
import {isValidInput} from "@/app/(default)/mylists/ListCreation";
import TemplateButton from "@/components/Template/TemplateButton";

type SaveRankingProps = {
    newRanking: {
        user_id: number | null;
        list_id: number;
        name: string;
        ranking_type: string
    };
    saveRanking: () => void;
    setNewRanking: (newValue: (prevValue: NewRanking) => {
        user_id: number | null;
        list_id: number;
        name: string;
        ranking_type: string
    }) => void;
}

export default function RankingName({newRanking, saveRanking, setNewRanking}: SaveRankingProps) {

    function onClick() {
        if (isValidInput(newRanking.name)) {
            saveRanking()
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
                               variant="blue"
                               placeholder="ex: Meilleurs kdrama..."
                               onChange={(e) => setNewRanking((prevValue: NewRanking) => {
                                   return {
                                       ...prevValue,
                                       name: e.target.value,
                                   }
                               })}/>
                <TemplateButton onClick={onClick} text="Create" variant='blue'/>
            </Stack>
        </TemplatePage>
    );
}
