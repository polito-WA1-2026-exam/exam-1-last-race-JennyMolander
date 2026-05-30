// imports
import express from 'express';
import morgan from 'morgan'; // logging middleware
import cors from 'cors'; // CORS middleware
import {check, validationResult} from 'express-validator'; 
import passport from 'passport';
import LocalStrategy from 'passport-local';
import session from 'express-session';
import { getRandomEvent } from './dao/events-dao.js';
import { createGame, updateGameScore, updateGameStatus, getGame, saveGameStep, getRanking } from './dao/games-dao.js';
import { getFullNetwork, getAllSegments, getAllStations } from './dao/network-dao.js';
import { getUser, getUserById } from './dao/users-dao.js';


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

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});