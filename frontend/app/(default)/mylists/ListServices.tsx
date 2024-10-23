import {Lists, NewList} from "@/app/(default)/mylists/ListCreation";
import {fetchData, postData} from "@/app/api";

export function fetchLists(userId: number | null, setLists: (lists: Lists) => void) {
    fetchData<Lists>('lists/' + userId)
        .then(result => setLists(result))
        .catch(err => console.error(err.message));
}

export async function saveList(newList: NewList, userId: number | null, setLists: (lists: Lists) => void) {
    postData<NewList, NewList>('lists', newList).then(() => {
        fetchLists(userId, setLists)
    });
}
