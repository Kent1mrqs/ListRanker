import '../../src/App.css';
import ListCreation from "./ListCreation";
import {useCallback, useEffect, useState} from "react";
import {fetchData} from "../../src/components/services/api";

function App() {
    const [users, setUsers] = useState([]);
    const [lists, setLists] = useState([]);
    const [error, setError] = useState(null);

    const fetchUsers = useCallback(() => {
        fetchData('users', setUsers).catch(err => setError(err.message));
    }, []);

    const fetchLists = useCallback(() => {
        fetchData('lists', setLists).catch(err => setError(err.message));
    }, []);

    useEffect(() => {
        fetchUsers();
        fetchLists();
    }, [fetchLists, fetchUsers]);

    if (error) {
        console.error(error)
    }

    console.log("users :", users)
    console.log("lists :", lists)

    return (
        <div className="App">
            <ListCreation />
        </div>
    );
}

export default App;
