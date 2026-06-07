import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import NetworkVisualizer from "./NetworkVisualizer";
import { startGame, submitRoute, getStations, getSegments, endGame } from "../api/api";


function PlanningPage() {
    const [stations, setStations] = useState([]);
    const [segments, setSegments] = useState([]);
    const [game, setGame] = useState(null);
    const [route, setRoute] = useState([]);

    const [isLoading, setIsLoading] = useState(true);
    const [secondsLeft, setSecondsLeft] = useState(90);
    const hasStarted = useRef(false);
    const hasFinished = useRef(false);
    const isActive = game?.status === "planning";

    const navigate = useNavigate();

    // Fetch everything needed to start the game
    // hasStarted prevents double-fetch
    useEffect(() => {
        if (hasStarted.current) return;
        hasStarted.current = true;

        const initialize = async () => {
            setIsLoading(true);
            try {
                const [newGame, fetchedStations, fetchedSegments] = await Promise.all([
                    startGame(),
                    getStations(),
                    getSegments()
                ]);

                console.log(newGame.status);
                setGame(newGame);
                setStations(fetchedStations);
                // Duplicate each segment in reverse so the player can travel both directions
                setSegments(fetchedSegments.flatMap(segment => [
                    segment,
                    { fromStation: segment.toStation, toStation: segment.fromStation }
                ]));
                setSecondsLeft(90);
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        }

        initialize();
    }, []);

    // Count down secondsLeft by 1 every second. Auto-submits when time runs out.
    useEffect(() => {
        if (!isActive || hasFinished.current) return;

        if (secondsLeft <= 0) {
            handleSubmit();
            return;
        }

        const timerId = setTimeout(() => {
            setSecondsLeft((prev) => prev - 1);
        }, 1000);

        return () => clearTimeout(timerId);
    }, [secondsLeft, isActive]);

    const handleAddSegment = (segment) => {
        setRoute(prev => [...prev, segment]);
    }

    const handleRemoveSegment = (segment) => {
        setRoute(prev => prev.filter(s => s !== segment));
    }

    const handleSubmit = async (event) => {
        event?.preventDefault();
        if (hasFinished.current) return;
        hasFinished.current = true; // Prevent double-submission

        // Empty route — end the game immediately with an invalid result
        if (route.length === 0) {
            try {
                await endGame(game.gameId);
                navigate('/result', { state: { gameId: game.gameId, valid: false } });
                return;
            } catch (err) {
                console.error(err);
            }
        }

        // Submit the route to the server for validation
        try {
            const response = await submitRoute(game.gameId, route.map(segment => ({
                fromStationId: segment.fromStation.id,
                toStationId: segment.toStation.id
            })));
            if (response.valid) {
                navigate('/executing', { state: { gameId: game.gameId, route, totalSteps: response.totalSteps } });
            } else {
                navigate('/result', { state: { gameId: game.gameId, valid: false } });
            }

        } catch (err) {
            console.error(err);
        }
    }

    if (isLoading) return <p>Loading...</p>;
    
    return (
        <div style={{height: 'calc(100vh - 16vh)'}} className="flex flex-col overflow-hidden px-8 pt-6 max-w-5xl mx-auto w-full">
            <h2 className="heading self-center">Plan your route</h2>
            <div className="flex items-center gap-1 mb-4 self-center">
                <p>Start at:</p>
                <p className="font-medium">{game.startStation.name},</p>
                <p>End at: </p>
                <p className="font-medium">{game.destinationStation.name}</p>
            </div>
            <div className="flex items-center gap-5 mt-4 flex-1 overflow-hidden">
                <div className="flex flex-col items-center gap-2">
                    <p className="text-3xl font-medium">{secondsLeft}</p>
                    <p className="text-sm text-gray-400">sec</p>
                </div>

                <NetworkVisualizer stations={stations} />

                <div className="flex flex-col flex-1 overflow-hidden h-full">
                    <p className="text-sm text-gray-500 font-medium mb-2">Segments</p>
                    <div className="overflow-y-auto flex-1">
                        {segments.map(segment => {
                        const isSelected = route.includes(segment);
                        const indexInRoute = route.indexOf(segment);
                        return <SegmentVisualizer 
                            key={`${segment.fromStation.id}-${segment.toStation.id}`}
                            segment={segment}
                            isSelected={isSelected}
                            indexInRoute={indexInRoute}
                            onAdd={handleAddSegment}
                            onRemove={handleRemoveSegment}
                        />
                    })}
                    </div>
                </div>
            </div>
            <button className="btn btn-primary mt-3 mb-4 w-48 self-center" onClick={handleSubmit}>Submit route!</button>
        </div>
    )
}

function SegmentVisualizer(props) {
    const { segment, indexInRoute, isSelected, onAdd, onRemove } = props;
    return (
        <div onClick={() => isSelected ? onRemove(segment) : onAdd(segment)}
            className={`flex items-center gap-2 p-2 mb-2 rounded-lg border cursor-pointer
            ${isSelected ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}
        >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium shrink-0
                ${isSelected ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-400'}`}
            >
                {isSelected ? indexInRoute + 1 : ''}
            </div>
            <span className="text-sm">{`${segment.fromStation.name} → ${segment.toStation.name}`}</span>
        </div>
    )
}

export default PlanningPage;