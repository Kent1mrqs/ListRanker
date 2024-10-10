import './App.css';
import ListCreation from "./components/ListCreation";
import {useEffect, useState} from "react";

function App() {
    const [data, setData] = useState(null);

    useEffect(() => {
        fetch('http://localhost:8081/')
            .then(response => response.text())
            .then(data => setData(data))
            .catch(error => console.error('Error:', error));
    }, []);
console.log(data)

    return (
    <div className="App">
      <header className="App-header">
          <ListCreation/>
      </header>

    </div>
  );
}

export default App;
