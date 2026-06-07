# Exam #1: Last Race
## Student: s362483 MOLANDER JENNY

## React Client Application Routes

- Route `/`: page content and purpose
- Route `/something/:param`: page content and purpose, param specification
- ...

## API Server

- POST `/api/sessions`
  - Body: `{ username, password }`
  - Returns the logged-in user object: `{ id, username, name }`

- GET `/api/sessions/current`
  - No parameters
  - Returns the current user object: `{ id, username, name }`

- DELETE `/api/sessions/current`
  - No parameters
  - Returns 204

- GET `/api/network`
  - No parameters
  - Returns an array of lines, each with `{ id, name, color, stations: [{ station: { id, name }, position }] }`

- GET `/api/ranking`
  - No parameters
  - Returns an array of `{ user: { id, username, name }, bestScore }`

- POST `/api/games`
  - No parameters
  - Returns `{ gameId, startStation: { id, name }, destinationStation: { id, name }, status }`

- GET `/api/games/current`
  - No parameters
  - Returns the current user's active game object `{ id, userId, startStationId, destinationStationId, status, score, createdAt, route }`

- GET `/api/games/:id`
  - URL parameter: `id` (game ID)
  - Returns the game object `{ id, userId, startStationId, destinationStationId, status, score, createdAt, route }`

- POST `/api/games/:id/abandon`
  - URL parameter: `id` (game ID)
  - Returns `{ message: "Game ended" }`

- GET `/api/segments`
  - No parameters
  - Returns all segments as pairs of connected stations `{ [segment: {fromstation: {id, name}, toStation: {id, name}}, ...] }`

- GET `/api/stations`
  - No parameters
  - Returns all stations in the network `{ [station: {id, name}, ...] }`

- POST `/api/games/:id/route`
  - URL parameter: `id` (game ID)
  - Body: `{ route: [{ fromStationId, toStationId }] }`
  - Returns `{ valid, totalSteps }`

- POST `/api/games/:id/step`
  - URL parameter: `id` (game ID)
  - Body: `{ route: [{ fromStationId, toStationId }], stepIndex }`
  - Returns `{ done, randomEvent: { id, description, effect }, coinsAfterStep }`

## Database Tables

- Table `users` — stores registered users with their username, display name, and hashed password (salt + hash)
- Table `lines` — stores the metro lines with their name and color
- Table `stations` — stores all stations in the network with their name
- Table `line_stations` — junction table linking stations to lines, with a position field defining the order of stations on each line
- Table `events` — stores all possible random events with a description and a coin effect
- Table `games` — stores each game with its user, start and destination station, status, score, creation timestamp, and the submitted route
- Table `game_steps` — stores each executed step of a game, including the stations travelled, the random event that occurred, and the coin total after the step

## Main React Components

- `ListOfSomething` (in `List.js`): component purpose and main functionality
- `GreatButton` (in `GreatButton.js`): component purpose and main functionality
- ...

(only _main_ components, minor ones may be skipped)

## Screenshot

![Screenshot](./img/screenshot.jpg)

## Users Credentials

- username, password (plus any other requested info)
- username, password (plus any other requested info)

## Use of AI Tools
Briefly describe whether you used any AI tools (e.g., ChatGPT, GitHub Copilot, Claude) while working on this project, for which purposes (e.g., clarifying concepts, debugging, generating code), and how you verified or adapted their output.
If you did not use any AI tools, simply state so.
