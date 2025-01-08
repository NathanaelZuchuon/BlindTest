
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PlayerDashboard() {
	const router = useRouter();
	const [players, setPlayers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [playerName, setPlayerName] = useState(null);

	useEffect(() => {
		const name = sessionStorage.getItem("playerName");

		if (!name) {
			router.push("/player/login");
			return;
		}

		setPlayerName(name);
		setPlayers([
			{ id: "1", name: name || "You", joinedAt: sessionStorage.getItem("joinedAt"), },
			{ id: "2", name: "Player 2", joinedAt: new Date() },
			{ id: "3", name: "Player 3", joinedAt: new Date() },
		]);
		setLoading(false);
	}, [router]);

	if (loading) {
		return ( <div></div> );
	}

	if (playerName === null) {
		return null;
	}

	return (
		<div className="min-h-screen bg-gray-100 p-8">
			<div className="max-w-4xl mx-auto">
				<h1 className="text-2xl font-bold mb-8">Player Dashboard</h1>

				<div className="bg-white rounded-lg shadow p-6">
					<h2 className="text-lg font-semibold mb-4">
						Connected Players
					</h2>
					<ul className="space-y-2">
						{players.map((player) => (
							<li
								key={player.id}
								className="flex items-center justify-between bg-gray-50 p-3 rounded"
							>
								<span
									className={
										player.name === playerName
											? "font-bold"
											: ""
									}
								>
									{player.name}{" "}
									{player.name === playerName && "(You)"}
								</span>
								<span className="text-sm text-gray-500">
									{new Date(
										player.joinedAt
									).toLocaleTimeString()}
								</span>
							</li>
						))}
					</ul>
				</div>
			</div>
		</div>
	);
}
