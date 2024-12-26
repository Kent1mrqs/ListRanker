import {Rankings} from "@/app/(default)/mylists/ListCreation";
import {fetchData, postData} from "@/app/api";
import {NewRanking} from "@/app/(default)/workflow_creation/WorkflowCreation";

export function fetchRankings(setRankings: (rankings: Rankings) => void) {
    fetchData<Rankings>('get-rankings')
        .then(result => setRankings(result))
        .catch(err => console.error(err.message));
}

export async function saveRanking(newRanking: NewRanking) {
    postData<NewRanking, NewRanking>('new-ranking', newRanking);
}
