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
        if (!isExecuting || hasFinished.current) return;
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
            <div className="flex flex-col items-center gap-6 mt-6">
                <p className="text-sm text-gray-400">{stepIndex} / {totalSteps}</p>
                <div className="flex flex-col items-center gap-2 p-6 bg-gray-50 rounded-xl border border-gray-200 w-96 min-h-32 text-center">
                    {currentStep ? (
                        <>
                            <p className="text-base">{currentStep.randomEvent.description}</p>
                            <p className={`text-sm font-medium mt-1 ${currentStep.randomEvent.effect > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                {currentStep.randomEvent.effect > 0 ? '+' : ''}{currentStep.randomEvent.effect} coins
                            </p>
                            <p className="text-xs text-gray-400 mt-2">Total: {currentStep.coinsAfterStep} coins</p>
                        </>
                    ) : (
                        <p>Starting...</p>
                    )}
                </div>

                <p className="text-base text-gray-400">{hasFinished.current ? (`${secondsLeft}s until done`) : (`${secondsLeft}s until next step`)}</p>

            </div>
        </div>
    )
}

export default ExecutionPage; 