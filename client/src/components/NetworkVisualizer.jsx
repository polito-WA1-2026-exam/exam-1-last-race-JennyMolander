
const WIDTH = 600;
const HEIGHT = 400;

// Coordinates in map for stations
const STATION_COORDS = {
    1:  { x: 0.1,  y: 0.9  },
    2:  { x: 0.1,  y: 0.65  },
    3:  { x: 0.1,  y: 0.45  },
    4:  { x: 0.1,  y: 0.3  },
    5:  { x: 0.3,  y: 0.9 },
    6:  { x: 0.6,  y: 0.9  },
    7:  { x: 0.9,  y: 0.9  },
    8:  { x: 0.6, y: 0.7 },
    9:  { x: 0.9, y: 0.7  },
    10: { x: 0.9, y: 0.5  },
    11: { x: 0.9, y: 0.3 },
    12: { x: 0.6, y: 0.3 },
    13: { x: 0.4, y: 0.3 },
    14: { x: 0.1, y: 0.1 }
};

function NetworkVisualizer(props) {
    const { lines = [], stations = [] } = props;
    const hasLines = lines.length > 0;
    const hasStations = stations.length > 0;

    if (!hasLines && !hasStations) return <p>Loading...</p>;

    return (
        <svg width={WIDTH} height={HEIGHT} className="bg-gray-100 rounded-lg border border-gray-300">
            {hasLines && lines.map(line => line.stations.slice(0, -1).map((stationInLine, i) => {
                const fromId = stationInLine.id;
                const toId = line.stations[i+1].id;
                const from = STATION_COORDS[fromId];
                const to = STATION_COORDS[toId];

                return <LineVisualizer key={`${stationInLine.id}-${fromId}-${toId}`} x1={from.x * WIDTH} y1={from.y * HEIGHT} x2={to.x * WIDTH} y2={to.y * HEIGHT} color={line.color} />

            }))}

            {stations.map(stationInLine => {
                const { id, name } = stationInLine;
                const coords = STATION_COORDS[id];

                return <StationVisualizer key={id} id={id} cx={coords.x * WIDTH} cy={coords.y * HEIGHT} x={coords.x * WIDTH} y={coords.y * HEIGHT - 12} name={name} />
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

export default NetworkVisualizer;