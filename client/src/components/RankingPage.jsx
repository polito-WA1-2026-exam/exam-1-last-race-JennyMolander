import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getRanking } from "../api/api";

function RankingPage() {

    const [rankings, setRankings] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        getRanking()
            .then(data => setRankings(data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="page">
            <h2 className="heading">Game Rankings</h2>
            <RankingTable rankings={rankings}></RankingTable>
            <button className="btn btn-primary mt-5" onClick={() => navigate("/")}>Go to game rules</button>
        </div>
    )
}

function RankingTable(props) {
    const rankings = props.rankings;

    return (
        <table className="w-full max-w-lg border-collapse">
            <thead>
                <tr className="bg-gray-800 text-white">
                    <th className="p-3 text-left">#</th>
                    <th className="p-3 text-left">Player</th>
                    <th className="p-3 text-left">Best Score</th>
                </tr>
            </thead>
            <tbody>
                {rankings.map((entry, index) => (
                    <tr key={entry.user.id} className="border-b hover:bg-gray-200">
                        <td className="p-3">{index + 1}</td>
                        <td className="p-3">{entry.user.name}</td>
                        <td className="p-3">{entry.bestScore}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export default RankingPage;