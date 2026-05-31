import { useContext, useState } from "react";
import UserContext from "../contexts/UserContext";
import { login } from "../api/auth";
import { useNavigate } from "react-router-dom";

function LoginForm() {
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();
        setErrorMsg("");
        setLoading(true);

        try {
            const user = await login(username, password);
            setUser(user);
            navigate('/');
        } catch (err) {
            setErrorMsg("Wrong username or password");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="page">
            <h2 className="text-2xl font-semibold">Log in</h2>

            <input
                className="border rounded px-3 py-2"
                type="text"
                placeholder="Username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
            />

            <input
                className="border rounded px-3 py-2"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
            />

            <p className="h-6 text-red-500 text-sm">
                {errorMsg}
            </p>

            <button className="btn btn-primary w-40" type="submit">
                {loading ? "Logging in..." : "Log in"}
            </button>
        </form>
    )
}

export default LoginForm;