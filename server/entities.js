
function User(id, username, name) {
    this.id = id;
    this.username = username;
    this.name = name;
}

function Station(id, name) {
    this.id = id;
    this.name = name;
}

function Line(id, name, color, stations = []) {
    this.id = id;
    this.name = name;
    this.color = color;
    this.stations = stations;
}

function Event(id, description, effect) {
    this.id = id;
    this.description = description;
    this.effect = effect;
}

function Game(id, userId, startStationId, destinationStationId, status = 'planning', score = 20, createdAt) {
    this.id = id;
    this.userId = userId;
    this.startStationId = startStationId;
    this.destinationStationId = destinationStationId;
    this.status = status;
    this.score = score;
    this.createdAt = createdAt;
}

function GameStep(id, gameId, stepOrder, fromStationId, toStationId, eventId, coinsAfterStep) {
    this.id = id;
    this.gameId = gameId;
    this.stepOrder = stepOrder;
    this.fromStationId = fromStationId;
    this.toStationId = toStationId;
    this.eventId = eventId;
    this.coinsAfterStep = coinsAfterStep;
}

function Segment(fromStation, toStation) {
    this.fromStation = fromStation;
    this.toStation = toStation;
}

export { User, Station, Line, Event, Game, GameStep, Segment }