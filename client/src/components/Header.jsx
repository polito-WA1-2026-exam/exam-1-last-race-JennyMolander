import { useContext } from "react"
import { useNavigate } from "react-router-dom";
import { getGameByUserId, endGame } from "../api/api";
import { logout } from "../api/auth";

import UserContext from "../contexts/UserContext"

function Header() {
    const navigate = useNavigate();

    const { user, setUser } = useContext(UserContext);

    const handleLogOut = async () => {
        try {
            const currentGame = await getGameByUserId();
            if (currentGame) {
                await endGame(currentGame.id);
            }

            await logout();
            setUser(null);
            navigate('/');
        } catch (err) {
            console.error("Logout failed", err);
        }
    }

    return (
        <nav className="flex justify-between items-center w-full bg-gray-800 text-white p-6">
            <h1 className="text-2xl">Last Race</h1>
            {user && (
                <div className="flex items-center gap-4">
                    <span>Logged in as: {user.name}</span>
                    <button className="btn btn-secondary">Rankings</button>
                    <button className="btn btn-secondary" onClick={handleLogOut}>Log out</button>
                </div>
            )}
        </nav>
    )
}

export default Header;