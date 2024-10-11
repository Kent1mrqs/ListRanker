import './App.css';
import ListCreation from "./components/ListCreation";
import {useEffect, useState} from "react";

function App() {
    const [data, setData] = useState(null);

    return (
    <div className="App">
          <ListCreation/>
    </div>
  );
}

export default App;
