import {Lists, NewRankings} from "@/app/(default)/mylists/ListCreation";
import {fetchData, postData} from "@/app/api";

export function fetchLists(setLists: (lists: Lists) => void) {
    fetchData<Lists>('get-lists')
        .then(result => setLists(result))
        .catch(err => console.error(err.message));
}

export async function saveList(newList: NewRankings) {
    postData<NewRankings, NewRankings>('new-list', newList);
}
