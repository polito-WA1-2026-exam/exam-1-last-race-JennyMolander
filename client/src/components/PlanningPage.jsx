import { useNavigate } from "react-router-dom";

function PlanningPage() {
    const navigate = useNavigate();
    
    return (
        <div className="page">
            <h2 className="heading">Plan your route</h2>
            <div className="text-center bg-amber-200 w-1/2 h-70">Her kommer ruteplanlegging</div>
            <button className="btn btn-primary mt-5" onClick={() => navigate("/executing")}>Submit route!</button>
        </div>
    )
}

export default PlanningPage;