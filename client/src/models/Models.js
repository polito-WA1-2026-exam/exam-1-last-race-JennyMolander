function User(id, username, name) {
    this.id = id;
    this.username = username;
    this.name = name;
}

function Segment(fromStation, toStation) {
    this.fromStation = fromStation;
    this.toStation = toStation;
}

function Event(id, description, effect) {
    this.id = id;
    this.description = description;
    this.effect = effect;
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

function Game(id, userId, startStationId, destinationStationId, status = 'planning', score = 20, createdAt, route = null) {
    this.id = id;
    this.userId = userId;
    this.startStationId = startStationId;
    this.destinationStationId = destinationStationId;
    this.status = status;
    this.score = score;
    this.createdAt = createdAt;
    this.route = route;
}

export { User, Event, Segment, Station, Line, Game }