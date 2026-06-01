// imports
import express from 'express';
import morgan from 'morgan'; // logging middleware
import cors from 'cors'; // CORS middleware
import {check, validationResult} from 'express-validator'; 
import passport from 'passport';
import LocalStrategy from 'passport-local';
import session from 'express-session';
import { getRandomEvent } from './dao/events-dao.js';
import { createGame, updateGameScore, updateGameStatus, getGame, saveGameStep, getRanking, getGameStepCount, saveGameRoute, endGame, getActiveGameByUserId } from './dao/games-dao.js';
import { getFullNetwork, getAllSegments, getAllStations } from './dao/network-dao.js';
import { getUser, getUserById } from './dao/users-dao.js';
import { selectStartAndEndStations, validateRoute } from './utils.js';


const app = express();
const port = 3001;

app.use(express.json());
app.use(morgan("dev"));

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(session({
  secret: "secret",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(async (username, password, cb) => {
  try {
    const user = await getUser(username, password);

    if (!user) {
      return cb(null, false, { message: "Incorrect username or password." });
    }

    return cb(null, user);
  } catch (err) {
    return cb(err);
  }
}));

passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser(async (id, cb) => {
  try {
    const user = await getUserById(id);

    if (!user) {
      return cb(null, false);
    }

    return cb(null, user);
  } catch (err) {
    return cb(err, null);
  }
});

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ error: "Not authorized" });
};

/* ---------------------------------------------------------------------------- */
/* ROUTES */

/* Session */
// POST /api/sessions
app.post("/api/sessions", passport.authenticate("local"), (req, res) => {
  res.status(201).json(req.user);
});

// GET /api/sessions/current
app.get("/api/sessions/current", (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ error: "No active session" });
  }
});

// DELETE /api/sessions/current
app.delete("/api/sessions/current", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: "Logout failed" });
    }
    res.status(204).end();
  });
});

/* ---------------------------------------------------------------------------- */

/* Network and Ranking */
// GET /api/network
app.get("/api/network", isLoggedIn, async (req, res) => {
  try {
    const network = await getFullNetwork();
    res.json(network);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/ranking
app.get("/api/ranking", isLoggedIn, async (req, res) => {
  try {
    const ranking = await getRanking();
    res.json(ranking);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

/* ---------------------------------------------------------------------------- */
/* Game specific APIs*/
// POST /api/games
app.post("/api/games", isLoggedIn, async (req, res) => {
  try {
    const game = await getActiveGameByUserId(Number(req.user.id));
    if (game) {
      return res.status(400).json({ error: "Active game already exists" });
    }

    const stations = await getAllStations();
    const segments = await getAllSegments();

    const { startStation, destinationStation } = selectStartAndEndStations(stations, segments);

    const gameId = await createGame(req.user.id, startStation.id, destinationStation.id);

    res.json({ gameId, startStation, destinationStation, status: "planning" });

  } catch (err) {
    res.status(500).json({ error: "Could not start game" });
  }
});
// GET /api/games/current
app.get("/api/games/current", isLoggedIn, async(req, res) => {
  try {

    const game = await getActiveGameByUserId(Number(req.user.id));
    if (!game) {
      return res.status(404).json({ error: "No active game" });
    }

    res.json(game);

  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});


// GET /api/games/:id
app.get("/api/games/:id", isLoggedIn, async(req, res) => {
  try {

    const game = await getGame(Number(req.params.id));

    if (!game) return res.status(404).json({ error: "Game not found" });
    if (game.userId !== req.user.id) return res.status(403).json({ error: "Forbidden" });

    res.json(game);

  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/games/:id/abandon
app.post("/api/games/:id/abandon", isLoggedIn, async (req, res) => {
  try {
    const gameId = Number(req.params.id);

    const game = await getGame(gameId);

    if (!game) {
      return res.status(404).json({ error: "Game not found" });
    }

    if (game.userId !== req.user.id) {
      return res.status(403).json({ error: "Forbidden" });
    }

    if (game.status !== "planning" && game.status !== "executing") {
      return res.status(400).json({ error: "Game is not active" });
    }

    await endGame(gameId);
    res.status(200).json({ message: "Game ended" });

  } catch (err) {
    res.status(500).json({ error: "Could not end game" });
  }
});

// GET /api/segments
app.get("/api/segments", isLoggedIn, async (req, res) => {
  try {

    const segments = await getAllSegments();
    res.json(segments);

  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/stations
app.get("/api/stations", isLoggedIn, async (req, res) => {
  try {

    const stations = await getAllStations();
    res.json(stations);

  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/games/:id/route
app.post("/api/games/:id/route",
  isLoggedIn,
  [
    check("route").isArray({ min: 1 }).withMessage("Route must be a non-empty array"),
    check("route.*.fromStationId").isInt({ min: 1 }).withMessage("From station id must be an integer minimum 1"),
    check("route.*.toStationId").isInt({ min: 1 }).withMessage("To station id must be an integer minimum 1")
  ],
  async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

    try {

      const game = await getGame(Number(req.params.id));
      if (!game) return res.status(404).json({ error: "Game not found" });
      if (game.userId !== req.user.id) return res.status(403).json({ error: "Forbidden" });
      if (game.status !== "planning") return res.status(409).json({ error: "Game is not in planning phase" });

      const { route } = req.body; // [{ fromStationId, toStationId }, ...]
      const segments = await getAllSegments();

      const isValidRoute = validateRoute(route, segments, game.startStationId, game.destinationStationId);
      if (!isValidRoute) {
        await updateGameScore(game.id, 0);
        await updateGameStatus(game.id, "completed");

        return res.json({ valid: false });
      }

      // --- If valid, execute ---
      await saveGameRoute(game.id, JSON.stringify(route));
      await updateGameStatus(game.id, "executing");

      res.json({ valid: true, totalSteps: route.length });

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }

  }
);

// POST /api/games/:id/step
app.post("/api/games/:id/step",
  isLoggedIn,
  [
    check("route").isArray({ min: 1 }),
    check("route.*.fromStationId").isInt({ min: 1 }),
    check("route.*.toStationId").isInt({ min: 1 }),
    check("stepIndex").isInt({ min: 0 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

    try {
      
      const game = await getGame(Number(req.params.id));
      if (!game) return res.status(404).json({ error: "Game not found" });
      if (game.userId !== req.user.id) return res.status(403).json({ error: "Forbidden" });
      if (game.status !== "executing") return res.status(409).json({ error: "Game is not in execution phase" });

      const { route, stepIndex } = req.body;

      const savedRoute = JSON.parse(game.route);
      if (JSON.stringify(savedRoute) !== JSON.stringify(route)) {
        return res.status(409).json({ error: "Route does not match validated route" });
      }

      const existingSteps = await getGameStepCount(game.id);
      if (stepIndex !== existingSteps) {
        return res.status(409).json({ error: "Invalid step index" });
      }
      
      const { fromStationId, toStationId } = route[stepIndex];

      const randomEvent = await getRandomEvent();
      const newCoins = Math.max(0, game.score + randomEvent.effect);

      await saveGameStep(game.id, stepIndex + 1, fromStationId, toStationId, randomEvent.id, newCoins);
      await updateGameScore(game.id, newCoins);

      const isLastStep = stepIndex + 1 === route.length;
      if (isLastStep) {
        await updateGameStatus(game.id, "completed");
        return res.json({ done: true, randomEvent, coinsAfterStep: newCoins });
      }

      res.json({ done: false, randomEvent, coinsAfterStep: newCoins });

    } catch (err) {
      console.error(err); 
      res.status(500).json({ error: "Internal server error" });
    }
});

/* ---------------------------------------------------------------------------- */

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});