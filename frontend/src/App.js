import './App.css';
import ListCreation from "./components/ListCreation";
import {useEffect, useState} from "react";

function App() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true); // État pour gérer le chargement
    const [error, setError] = useState(null); // État pour gérer les erreurs
    console.log(data ?? error)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8080/users'); // Corrigez l'URL ici
                console.log(response)
                if (!response.ok) {
                    throw new Error('Erreur lors de la récupération des utilisateurs');
                }
                const result = await response.json();
                setData(result);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="App">
            <ListCreation/>
        </div>
    );
}

export default App;
