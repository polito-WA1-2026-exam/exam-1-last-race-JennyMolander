import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getNetwork } from "../api/api";
import NetworkVisualizer from "./NetworkVisualizer";


function SetUpPage() {
    const [lines, setLines] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        getNetwork()
            .then(data => setLines(data))
            .catch(err => console.error(err));
    }, []);

    const stations = lines.flatMap(line => line.stations).reduce((unique, station) => {
        if (!unique.find(s => s.id === station.id)) unique.push(station);
        return unique;
    }, []);
    
    return (
        <div className="page">
            <h2 className="heading">Study the network</h2>
            <NetworkVisualizer lines={lines} stations={stations} />
            <button className="btn btn-primary mt-5" onClick={() => navigate("/planning")}>Ready!</button>
        </div>
    )
}

export default SetUpPage;