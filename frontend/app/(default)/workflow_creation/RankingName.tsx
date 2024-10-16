"use client";
import TemplatePage from "@/components/Template/TemplatePage";
import {NewRanking} from "@/app/(default)/workflow_creation/WorkflowCreation";
import TemplateInput from "@/components/Template/TemplateInput";
import {Stack} from "@mui/material";
import TemplateLink from "@/components/Template/TemplateLink";

type SaveRankingProps = {
    saveRanking: () => void;
    setNewRanking: (newValue: (prevValue: NewRanking) => {
        list_id: number;
        name: string;
        ranking_type: string
    }) => void;
}

export default function RankingName({saveRanking, setNewRanking}: SaveRankingProps) {
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
                <TemplateLink onClick={saveRanking} text="Create" variant='blue' route='myrankings'/>
            </Stack>
        </TemplatePage>
    );
}
