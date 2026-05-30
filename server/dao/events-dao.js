import db from "../db.js";
import { Event } from "../entities.js";

// Get a random event
export const getRandomEvent = () => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM events ORDER BY RANDOM() LIMIT 1";

        db.get(sql, [], (err, row) => {
            if (err) {
                reject(err);
            } else if (row === undefined) {
                resolve(false);
            } else {
                const event = new Event(row.id, row.description, row.effect);

                resolve(event);
            }
        });
    });
}