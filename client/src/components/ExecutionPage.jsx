import { useNavigate } from "react-router-dom";

function ExecutionPage() {
    const navigate = useNavigate();
    return (
        <div className="page">
            <h2 className="heading">Now executing ...</h2>
            <div className="text-center bg-amber-200 w-1/2 h-70">Her kommer visning av et steg</div>
        </div>
    )
}

export default ExecutionPage;