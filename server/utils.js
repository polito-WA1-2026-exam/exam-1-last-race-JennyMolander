// Selects random element from an array
const getRandomElementFromArray = (array) => {
    return array[Math.floor(Math.random() * array.length)];
}

// Constructs a graph based on the segments
const buildNetworkGraph = (segments) => {
    const networkGraph = new Map();

    for (const segment of segments) {
        const startId = segment.fromStation.id;
        const endId = segment.toStation.id;

        if (!networkGraph.has(startId)) {
            networkGraph.set(startId, []);
        }

        if (!networkGraph.has(endId)) {
            networkGraph.set(endId, []);
        }

        // Stores the neighbors of each station
        networkGraph.get(startId).push(endId);
        networkGraph.get(endId).push(startId);
    }

    return networkGraph
}

// Finds distances to all other stations from the startId
const findDistanceBFS = (graph, startId) => {
    const distances = new Map([[startId, 0]]);
    const queue = [startId];

    while (queue.length > 0) {
        const current = queue.shift();

        for (const neighbor of graph.get(current) ?? []) {
            if (!distances.has(neighbor)) {
                distances.set(neighbor, distances.get(current) + 1);
                queue.push(neighbor);
            }
        }
    }
    return distances;
}

// Selects random start and end stations with 3 or more steps between them
export const selectStartAndEndStations = (stations, segments, minDistance = 3) => {
    const graph = buildNetworkGraph(segments);
    const startStation = getRandomElementFromArray(stations);
    const distances = findDistanceBFS(graph, startStation.id);

    const possibleEndStations = stations.filter(
        station => station.id !== startStation.id && (distances.get(station.id) ?? 0) >= minDistance
    )

    if (possibleEndStations.length === 0) {
        throw new Error("No valid destination found");
    }

    return {
        startStation,
        destinationStation: getRandomElementFromArray(possibleEndStations)
    }
}

// Validate user defined route
export const validateRoute = (route, segments, startStationId, destinationStationId) => {
    if (route.length === 0) return false;

    if (route[0].fromStationId !== startStationId) return false;
    if (route[route.length - 1].toStationId !== destinationStationId) return false;

    for (let i = 0; i < route.length - 1; i++) {
        if (route[i].toStationId !== route[i+1].fromStationId) return false;
    }

    const validSegments = new Set(
        segments.flatMap(s => [
            `${s.fromStation.id}-${s.toStation.id}`,
            `${s.toStation.id}-${s.fromStation.id}`
        ])
    );

    const usedSegments = new Set();

    for (const segment of route) {
        const key = `${segment.fromStationId}-${segment.toStationId}`;
        if (!validSegments.has(key)) return false;
        if (usedSegments.has(key)) return false;
        usedSegments.add(key);
    }

    return true;
}