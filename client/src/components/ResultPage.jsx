import { useNavigate } from "react-router-dom";

function ResultPage() {
    const navigate = useNavigate();
    return (
        <div className="page">
            <h2 className="heading">Plan your route</h2>
            <div className="text-center bg-amber-200 w-1/2 h-70">Her kommer resultatet</div>
            <div className="flex flex-row">
                <button className="btn btn-primary mt-5" onClick={() => navigate("/setup")}>Start new game!</button>
                <button className="btn btn-primary mt-5" onClick={() => navigate("/")}>Go to game rules</button>
            </div>
        </div>
    )
}

export default ResultPage;