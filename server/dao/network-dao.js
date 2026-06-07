import db from "../db.js";
import { Station, Line, Segment } from "../entities.js";

// Get the full network
export const getFullNetwork = () => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT l.id AS lineId,
            l.name AS lineName,
            l.color AS lineColor,
            s.id AS stationId,
            s.name AS stationName,
            ls.position AS position
            FROM line_stations ls
            JOIN lines l ON ls.lineId = l.id
            JOIN stations s ON ls.stationId = s.id
            ORDER BY l.id, ls.position
        `;

        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                const lines = [];

                for (const row of rows) {
                    let line = lines.find(l => l.id === row.lineId);

                    if (!line) {
                        line = new Line(row.lineId, row.lineName, row.lineColor, [])

                        lines.push(line);
                    }

                    const station = new Station(row.stationId, row.stationName);

                    line.stations.push({
                        station,
                        position: row.position
                    });
                }

                resolve(lines);
            }
        });
    });
}

// Get all stations
export const getAllStations = () => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM stations";

        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                const stations = rows.map(row => new Station(row.id, row.name));

                resolve(stations);
            }
        });
    });
}

// Get all segments
export const getAllSegments = () => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT ls.lineId AS lineId,
            s.id AS stationId,
            s.name AS stationName,
            ls.position AS position
            FROM line_stations ls
            JOIN stations s ON ls.stationId = s.id
            ORDER BY ls.lineId, ls.position
        `;

        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                const segments = [];

                for (let i = 0; i < rows.length - 1; i++) {
                    const current = rows[i];
                    const next = rows[i+1];

                    // If current and next station belong to the same line, add as segment
                    if (current.lineId === next.lineId) {
                        const fromStation = new Station(current.stationId, current.stationName);
                        const toStation = new Station(next.stationId, next.stationName);

                        segments.push(new Segment(fromStation, toStation));
                    }
                }

                resolve(segments);
            }
        });
    });
}
