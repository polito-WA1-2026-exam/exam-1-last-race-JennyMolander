import { useNavigate } from "react-router-dom";

function SetUpPage() {
    const navigate = useNavigate();
    
    return (
        <div className="page">
            <h2 className="heading">Study the network</h2>
            <div className="text-center bg-amber-200 w-1/2 h-70">Her kommer kartet</div>
            <button className="btn btn-primary mt-5" onClick={() => navigate("/planning")}>Ready!</button>
        </div>
    )
}

export default SetUpPage;