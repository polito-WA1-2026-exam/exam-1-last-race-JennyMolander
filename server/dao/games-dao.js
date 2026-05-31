import db from "../db.js";
import { Game, GameStep, User } from "../entities.js";

const mapRowToGame = (row) => {
    return new Game(
        row.id,
        row.userId,
        row.startStationId,
        row.destinationStationId,
        row.status,
        row.score,
        row.createdAt,
        row.route
    );
}

// Create new game
export const createGame = (userId, startStationId, destinationStationId) => {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO games (
            userId,
            startStationId,
            destinationStationId,
            status,
            score)
            VALUES (?, ?, ?, ?, ?)
        `;

        // createdAt with game start time is handled automatically by DEFAULT CURRENT_TIMESTAMP
        db.run(sql, [userId, startStationId, destinationStationId, 'planning', 20], function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.lastID);
            }
        });
    });
}

// Get game by Id
export const getGame = (gameId) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM games WHERE id = ?";

        db.get(sql, [gameId], (err, row) => {
            if (err) {
                reject(err);
            } else if (row === undefined) {
                resolve(false);
            } else {
                const game = mapRowToGame(row);

                resolve(game);
            }
        });
    });
}

// End a game
export const endGame = (gameId) => {
    return new Promise((resolve, reject) => {
        const sql = `UPDATE games
            SET status = "completed", score = 0
            WHERE id = ?
        `;

        db.run(sql, [gameId], function (err) {
            if (err) {
                reject(err);
            } else if (this.changes !== 1) {
                resolve(false);
            } else {
                resolve(true);
            }
        });
    });
}

// Update game score
export const updateGameScore = (gameId, score) => {
    return new Promise((resolve, reject) => {
        const sql = `UPDATE games
            SET score = ?
            WHERE id = ?
        `;

        db.run(sql, [score, gameId], function (err) {
            if (err) {
                reject(err);
            } else if (this.changes !== 1) {
                resolve(false);
            } else {
                resolve(true);
            }
        });
    });
};

// Update game status
export const updateGameStatus = (gameId, status) => {
    return new Promise((resolve, reject) => {
        const sql = `UPDATE games
            SET status = ?
            WHERE id = ?
        `;

        db.run(sql, [status, gameId], function (err) {
            if (err) {
                reject(err);
            } else if (this.changes !== 1) {
                resolve(false);
            } else {
                resolve(true);
            }
        });
    });
};

// Save one execution step
export const saveGameStep = (gameId, stepOrder, fromStationId, toStationId, eventId, coinsAfterStep) => {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO game_steps (
            gameId,
            stepOrder,
            fromStationId,
            toStationId,
            eventId,
            coinsAfterStep)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        db.run(sql, [gameId, stepOrder, fromStationId, toStationId, eventId, coinsAfterStep], function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.lastID);
            }
        });
    });
}

// Save game route sent by user
export const saveGameRoute = (gameId, route) => {
    return new Promise((resolve, reject) => {
        const sql = "UPDATE games SET route = ? WHERE id = ?";

        db.run(sql, [route, gameId], function (err) {
            if (err) {
                reject(err);
            } else if (this.changes !== 1) {
                resolve(false);
            } else {
                resolve(true);
            }
        });
    });
}

// Get ranking of games
export const getRanking = () => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT u.id AS userId,
            u.username AS username,
            u.name AS name,
            MAX(g.score) AS bestScore
            FROM users u
            JOIN games g ON u.id = g.userId
            WHERE g.status = 'completed'
            GROUP BY u.id
            ORDER BY bestScore DESC
        `;

        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                const rankings = [];

                for (const row of rows) {
                    const user = new User(row.userId, row.username, row.name);

                    rankings.push({
                        user,
                        bestScore: row.bestScore
                    });
                }

                resolve(rankings);
            }
        });
    });
}

export const getGameStepCount = (gameId) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT COUNT(*) AS count FROM game_steps WHERE gameId = ?";

        db.get(sql, [gameId], (err, row) => {
            if (err) {
                reject(err);
            } else if (row === undefined) {
                resolve(false);
            } else {
                resolve(row.count);
            }
        });
    });
}

export const getActiveGameByUserId = (userId) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM games
            WHERE userId = ?
            AND status IN ("planning", "executing")
        `;

        db.get(sql, [userId], (err, row) => {
            if (err) {
                reject(err);
            } else if (row === undefined) {
                resolve(false);
            } else {
                const game = mapRowToGame(row);

                resolve(game);
            }
        });
    });
}