import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import NetworkVisualizer from "./NetworkVisualizer";
import { startGame, submitRoute, getStations, getSegments } from "../api/api";


function PlanningPage() {
    const [stations, setStations] = useState([]);
    const [segments, setSegments] = useState([]);
    const [game, setGame] = useState(null);
    const [route, setRoute] = useState([]);

    const [isLoading, setIsLoading] = useState(true);
    const [secondsLeft, setSecondsLeft] = useState(90);
    const hasFinished = useRef(false);
    const isActive = game?.status === "planning";

    const navigate = useNavigate();

    useEffect(() => {
        const initialize = async () => {
            setIsLoading(true);
            try {
                const [newGame, fetchedStations, fetchedSegments] = await Promise.all([
                    startGame(),
                    getStations(),
                    getSegments()
                ]);

                setGame(newGame);
                setStations(fetchedStations);
                setSegments(fetchedSegments);
                setSecondsLeft(90);
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        }

        initialize();
    }, []);

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
        hasFinished.current = true;

        try {
            const response = await submitRoute(game.id, route);
            if (response.valid) {
                navigate('/executing', { state: { gameId: game.id, route, totalSteps: response.totalSteps } });
            } else {
                navigate('/result', { state: { gameId: game.id } });
            }

        } catch (err) {
            console.error(err);
        }
    }

    if (isLoading) return <p>Loading...</p>;
    
    return (
        <div className="page">
            <h2 className="heading">Plan your route</h2>
            <div className="flex items-center gap-5 mt-4">
                <div className="flex flex-col items-center gap-2">
                    <p className="text-3xl font-medium">{secondsLeft}</p>
                    <p className="text-sm text-gray-400">sec</p>
                </div>

                <NetworkVisualizer stations={stations} />

                <div className="flex flex-col min-w-48">
                    <p className="text-sm text-gray-500 font-medium mb-2">Segments</p>
                    {segments.map(segment => {
                        const isSelected = route.includes(segment);
                        const indexInRoute = route.indexOf(segment);
                        return <SegmentVisualizer 
                            key={`${segment.fromStation}-${segment.toStation}`}
                            segment={segment}
                            isSelected={isSelected}
                            indexInRoute={indexInRoute}
                            onAdd={handleAddSegment}
                            onRemove={handleRemoveSegment}
                        />
                    })}
                </div>
            </div>
            <button className="btn btn-primary mt-5" onClick={handleSubmit}>Submit route!</button>
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
            <span className="text-sm">{`${segment.fromStation}-${segment.toStation}`}</span>
        </div>
    )
}

export default PlanningPage;