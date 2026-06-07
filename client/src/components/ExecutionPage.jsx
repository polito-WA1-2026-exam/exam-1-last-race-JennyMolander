import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getGame, executeStep } from "../api/api";

function ExecutionPage() {
    const { gameId, route, totalSteps } = useLocation().state;
    const [game, setGame] = useState(null);
    const [stepIndex, setStepIndex] = useState(0);
    const [currentStep, setCurrentStep] = useState(null);
    
    const [isLoading, setIsLoading] = useState(true);
    const [secondsLeft, setSecondsLeft] = useState(0);
    const hasStarted = useRef(false);
    const hasFinished = useRef(false);
    const isExecuting = game?.status === "executing";

    const navigate = useNavigate();

    useEffect(() => {
        if (hasStarted.current) return;
        hasStarted.current = true;
        
        const fetch = async () => {
            setIsLoading(true);
            try {
                const fetchedGame = await getGame(gameId);
                setGame(fetchedGame);
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        }

        fetch();
    }, []);

    useEffect(() => {
        if (!isExecuting || hasFinished.current) return;

        const delay = stepIndex === 0 ? 0 : 4000;

        const timerId = setTimeout(async () => {
            try {
                const fetchedStep = await executeStep(gameId, route.map(segment => ({
                    fromStationId: segment.fromStation.id,
                    toStationId: segment.toStation.id
                })), stepIndex);
                setCurrentStep(fetchedStep);

                if (fetchedStep.done) {
                    hasFinished.current = true;
                    setStepIndex(prev => prev + 1);
                    setTimeout(() => handleDone(), 4000);
                } else {
                    setStepIndex(prev => prev + 1);
                }
            } catch (err) {
                console.error(err);
            }
        }, delay);

        return () => clearTimeout(timerId);

    }, [stepIndex, isExecuting]);

    useEffect(() => {
        if (stepIndex > 0) setSecondsLeft(4);
    }, [stepIndex]);

    useEffect(() => {
        if (!isExecuting) return;
        if (secondsLeft <= 0) return;

        const timerId = setTimeout(() => {
            setSecondsLeft(prev => prev - 1);
        }, 1000);

        return () => clearTimeout(timerId);
    }, [secondsLeft, isExecuting]);

    const handleDone = () => {
        navigate('/result', { state: { gameId: game.id, valid: true } })
    }

    if (isLoading) return <p>Loading...</p>;

    return (
        <div className="page">
            <h2 className="heading">Executing steps</h2>
            <div className="flex flex-col items-center gap-8 mt-8 px-4">
                <p className="text-sm text-gray-400 tracking-wide">{stepIndex} / {totalSteps}</p>
                <div className="w-full max-w-xl bg-gray-100 rounded-full h-1.5 overflow-hidden">
                    <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${(stepIndex / totalSteps) * 100}%` }}
                    />
                </div>
                <div className="flex flex-col items-center gap-5 p-10 bg-white border border-gray-200 rounded-2xl w-full max-w-xl min-h-56 text-center justify-center">
                    {currentStep ? (
                        <>
                            <p className="text-2xl font-medium">{currentStep.randomEvent.description}</p>
                            <p className={`text-3xl font-medium px-6 py-2 rounded-xl ${currentStep.randomEvent.effect > 0 
                                ? 'bg-green-50 text-green-700'
                                : currentStep.randomEvent.effect < 0
                                ? 'bg-red-50 text-red-600'
                                : 'bg-gray-100 text-gray-500'
                            }`}>
                        
                                {currentStep.randomEvent.effect > 0 ? '+' : ''}{currentStep.randomEvent.effect} coins
                            </p>
                            <p className="text-xs text-gray-600 mt-2">Total: {currentStep.coinsAfterStep} coins</p>
                        </>
                    ) : (
                        <p>Starting...</p>
                    )}
                </div>

                <p className="text-lg text-gray-500">
                    {hasFinished.current ? `Done in ${secondsLeft}s` : `Next step in `}
                    {!hasFinished.current && <span className="text-gray-800 font-medium">{secondsLeft}s</span>}
                </p>
            </div>
        </div>
    )
}

export default ExecutionPage; 