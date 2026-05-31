import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import UserContext from "../contexts/UserContext";

function HomePage() {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center gap-4 mt-10">
            <h2 className="text-2xl font-semibold">Welcome to the Last Race game</h2>
            <p className="w-1/2 text-center">You are a passenger in a fictional metro network. You have unlimited time to study the network. When you are ready, the timer starts and the network vanishes. Given a start station and a destination, you must plan a valid route before the timer runs out. Once your route is submitted, you will travel step by step — but beware, unexpected events along the way may add or subtract coins from your score. How high can you score?</p>
            

            {!user ? (
                <div className="flex flex-col items-center gap-2">
                    <p className="font-bold">You have to log in to play:</p>
                    <button className="btn btn-outline" onClick={() => navigate("/login")}>
                        Log in
                    </button>
                </div>
            ) : (
                <button className="btn btn-primary" onClick={() => navigate("/setup")}>Start game</button>
            )}
        </div>
    )
}

export default HomePage;