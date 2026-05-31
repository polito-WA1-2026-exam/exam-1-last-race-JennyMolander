import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getNetwork } from "../api/api";

const WIDTH = 600;
const HEIGHT = 400;

const STATION_COORDS = {
    1:  { x: 0.1,  y: 0.9  },
    2:  { x: 0.1,  y: 0.65  },
    3:  { x: 0.1, y: 0.3  },
    4:  { x: 0.1, y: 0.1  },
    5:  { x: 0.3,  y: 0.9 },
    6:  { x: 0.6, y: 0.9  },
    7:  { x: 0.9,  y: 0.9  },
    8:  { x: 0.6, y: 0.7 },
    9:  { x: 0.9, y: 0.7  },
    10: { x: 0.9, y: 0.5  },
    11: { x: 0.9, y: 0.3 },
    12: { x: 0.6, y: 0.3 },
};

function SetUpPage() {
    const [lines, setLines] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        getNetwork()
            .then(data => setLines(data))
            .catch(err => console.error(err));
    }, []);
    
    return (
        <div className="page">
            <h2 className="heading">Study the network</h2>
            <NetworkVisualizer lines={lines}></NetworkVisualizer>
            <button className="btn btn-primary mt-5" onClick={() => navigate("/planning")}>Ready!</button>
        </div>
    )
}

function NetworkVisualizer(props) {
    if (props.lines.length === 0) return <p>Loading...</p>;
    const lines = props.lines;

    return (
        <svg width={WIDTH} height={HEIGHT} className="bg-gray-100 rounded-lg border border-gray-300">
            {lines.map(line => line.stations.slice(0, -1).map((stationInLine, i) => {
                const fromId = stationInLine.id;
                const toId = line.stations[i+1].id;
                const from = STATION_COORDS[fromId];
                const to = STATION_COORDS[toId];

                return <LineVisualizer key={`${stationInLine.id}-${fromId}-${toId}`} x1={from.x * WIDTH} y1={from.y * HEIGHT} x2={to.x * WIDTH} y2={to.y * HEIGHT} color={line.color}></LineVisualizer>

            }))}

            {lines.flatMap(line => line.stations).reduce((unique, stationInLine) => {
                const id = stationInLine.id;
                if (!unique.find(s => s.id === id)) unique.push(stationInLine);
                return unique;
            }, []).map(stationInLine => {
                const { id, name } = stationInLine;
                const coords = STATION_COORDS[id];

                return <StationVisualizer key={id} id={id} cx={coords.x * WIDTH} cy={coords.y * HEIGHT} x={coords.x * WIDTH} y={coords.y * HEIGHT - 12} name={name}></StationVisualizer>
            })}
        </svg>
    );
}

function LineVisualizer(props) {
    return (
        <line x1={props.x1} y1={props.y1} x2={props.x2} y2={props.y2} stroke={props.color} strokeWidth={4} />
    );
}

function StationVisualizer(props) {
    return (
        <g>
            <circle cx={props.cx} cy={props.cy} r={8} fill="white" stroke="black" strokeWidth={2}/>
            <text x={props.x} y={props.y} textAnchor="middle" fontSize={10} fill="black">
                {props.name}
            </text>
        </g>
    );
}

export default SetUpPage;