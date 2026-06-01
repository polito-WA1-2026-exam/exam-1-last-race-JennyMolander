import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { getGame } from "../api/api";

function ResultPage() {
    const { gameId, valid } = useLocation().state;
    const [game, setGame] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    useEffect(() => {

        const fetch = async () => {
            setIsLoading(true)
            try {
                const fetchedGame = await getGame(gameId);
                setGame(fetchedGame);

                if (valid) {
                    setMessage("You submitted a valid route.");
                } else {
                    setMessage("You did not submit a valid route.");
                }
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        }

        fetch();
    }, []);

    if (isLoading) return <p>Loading...</p>;

    return (
        <div className="page">
            <h2 className="heading">Result</h2>
            <div className="flex flex-col items-center gap-4 mt-8">
                <p className={`text-xl font-medium ${valid ? 'text-green-600' : 'text-red-500'}`}>
                    {message}
                </p>
                <div className="flex flex-col items-center gap-1 p-6 bg-gray-50 rounded-xl border border-gray-200">
                    <p className="text-sm text-gray-400">Final score</p>
                    <p className="text-4xl font-medium">{game.score}</p>
                </div>
            </div>
            <div className="flex gap-3 mt-8">
                <button className="btn btn-primary mt-5" onClick={() => navigate("/setup")}>Start new game!</button>
                <button className="btn btn-secondary mt-5" onClick={() => navigate("/")}>Go to game rules</button>
            </div>
        </div>
    )
}

export default ResultPage;