"use client";
import TemplatePage from "@/components/Template/TemplatePage";
import TemplateInput from "@/components/Template/TemplateInput";
import {Stack} from "@mui/material";
import TemplateButton from "@/components/Template/TemplateButton";
import {useRouter} from "next/navigation";
import {useState} from "react";
import {useNotification} from "@/app/NotificationProvider";
import {isValidInput} from "@/app/utils";
import {NewRanking} from "@/components/Models/ModelRankings";

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
    const router = useRouter();
    const [error, setError] = useState(false);
    const {showNotification} = useNotification();

    function onClick() {
        if (isValid(newRanking)) {
            saveRanking()
            router.push("myrankings")
        } else {
            setError(true)
            showNotification("invalid input : " + newRanking, "error")
            console.error("invalid input : ", newRanking)
        }
    }

    return (
        <TemplatePage
            id="step4"
            title="Step 4 : Ranking Name"
            description="Choose a name for your ranking."
        >
            <Stack spacing={2} alignItems="center">
                <TemplateInput label='Title'
                               id='ranking_title'
                               error={error}
                               variant={'blue'}
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
