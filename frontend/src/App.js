import './App.css';
import ListCreation from "./components/ListCreation";
import {useCallback, useEffect, useState} from "react";
import {fetchData} from "./components/services/api";

function App() {
    const [users, setUsers] = useState([]);
    const [lists, setLists] = useState([]);
    console.log(users)
    console.log(lists)

    const fetchUsers = useCallback(() => {
        fetchData('users', setUsers);
    }, []);

    const fetchLists = useCallback(() => {
        fetchData('lists', setLists);
    }, []);

    useEffect(() => {
        fetchUsers()
        fetchLists()
    }, [fetchLists, fetchUsers ]);

    return (
        <div className="App">
            <ListCreation/>
        </div>
    );
}

export default App;
