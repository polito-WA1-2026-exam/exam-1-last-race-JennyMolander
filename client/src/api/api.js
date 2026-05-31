import { Event, Segment, Station, Line, Game, StationInLine } from '../models/Models';

const SERVER_URL = 'http://localhost:3001/api'

function jsonHeaders() {
    return {
        'Content-Type': 'application/json',
    };
}

// Helper functions
function mapNetwork(network) {
    return network.map(line =>
        new Line(line.id, line.name, line.color, line.stations ? line.stations.map(stat =>
            new StationInLine(stat.station.id, stat.station.name, stat.position)
        ) : [])
    );
}

function mapGame(game) {
    return new Game(game.id, game.userId, game.startStationId, game.destinationStationId, game.status, game.score, game.createdAt, game.route);
}

function mapSegments(segments) {
    return segments.map(seg => new Segment(seg.fromStation, seg.toStation));
}

function mapStations(stations) {
    return stations.map(stat => new Station(stat.id, stat.name));
}

function mapGameResponse(data) {
    return {
        gameId: data.gameId,
        startStation: new Station(data.startStation.id, data.startStation.name),
        destinationStation: new Station(data.destinationStation.id, data.destinationStation.name)
    };
}

// Get network
async function getNetwork() {
    try {
        const response = await fetch(`${SERVER_URL}/network`, {
            credentials: 'include',
        });

        if (response.ok) {
            const network = await response.json();
            return mapNetwork(network);
        } else {
            throw new Error('HTTP error in getNetwork, code=' + response.status);
        }
    } catch (ex) {
        throw new Error('Network error in getNetwork', { cause: ex });
    }
}

// Get ranking
async function getRanking() {
    try {
        const response = await fetch(`${SERVER_URL}/ranking`, {
            credentials: 'include',
        });

        if (response.ok) {
            const rankings = await response.json();
            return rankings;
        } else {
            throw new Error('HTTP error in getRanking, code=' + response.status);
        }
    } catch (ex) {
        throw new Error('Network error in getRanking', { cause: ex });
    }
}

// Start game
async function startGame() {
    try {
        const response = await fetch(`${SERVER_URL}/games`, {
            method: 'POST',
            credentials: 'include',
        });

        if (response.ok) {
            const data = await response.json();
            return mapGameResponse(data);
        } else {
            throw new Error('HTTP error in startGame, code=' + response.status);
        }
    } catch (ex) {
    throw new Error('Network error in startGame', { cause: ex });
    }
}

// Get game
async function getGame(id) {
    try {
        const response = await fetch(`${SERVER_URL}/games/${id}`, {
            credentials: 'include',
        });

        if (response.ok) {
            const game = await response.json();
            return mapGame(game);
        } else {
            throw new Error('HTTP error in getGame, code=' + response.status);
        }
    } catch (ex) {
        throw new Error('Network error in getGame', { cause: ex });
    }
}

// Get segments
async function getSegments() {
    try {
        const response = await fetch(`${SERVER_URL}/segments`, {
            credentials: 'include',
        });

        if (response.ok) {
            const segments = await response.json();
            return mapSegments(segments);
        } else {
            throw new Error('HTTP error in getSegments, code=' + response.status);
        }
    } catch (ex) {
        throw new Error('Network error in getSegments', { cause: ex });
    }
}

// Get stations
async function getStations() {
    try {
        const response = await fetch(`${SERVER_URL}/stations`, {
            credentials: 'include',
        });

        if (response.ok) {
            const stations = await response.json();
            return mapStations(stations);
        } else {
            throw new Error('HTTP error in getStations, code=' + response.status);
        }
    } catch (ex) {
        throw new Error('Network error in getStations', { cause: ex });
    }
}

// Submit route
async function submitRoute(gameId, route) {
    try {
        const response = await fetch(`${SERVER_URL}/games/${gameId}/route`, {
            method: 'POST',
            headers: jsonHeaders(),
            credentials: 'include',
            body: JSON.stringify({ route }),
        });

        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            throw new Error('HTTP error in submitRoute, code=' + response.status);
        }
    } catch (ex) {
        throw new Error('Network error in submitRoute', { cause: ex });
    }
}

// Execute step
async function executeStep(gameId, route, stepIndex) {
    try {
        const response = await fetch(`${SERVER_URL}/games/${gameId}/step`, {
            method: 'POST',
            headers: jsonHeaders(),
            credentials: 'include',
            body: JSON.stringify({ route, stepIndex }),
        });

        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            throw new Error('HTTP error in executeStep, code=' + response.status);
        }
    } catch (ex) {
        throw new Error('Network error in executeStep', { cause: ex });
    }
}