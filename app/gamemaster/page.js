
"use client";

import { useState, useEffect } from "react";

export default function GameMaster() {
	const [sessionCode, setSessionCode] = useState("");
	const [players, setPlayers] = useState([]);

	useEffect(() => {
		const generateSessionCode = () => {
			const characters =
				"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
			let code = "";
			for (let i = 0; i < 10; i++) {
				code += characters.charAt(
					Math.floor(Math.random() * characters.length)
				);
			}
			return code;
		};

		const sendSessionCode = async (code) => {
			try {
				const response = await fetch("/api/reset-code", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ sessionCode: code }),
				});

				if (!response.ok) {
					throw new Error("Failed to create the session code.");
				} else {
					const data = await response.json();
					sessionStorage.setItem("players", JSON.stringify(data.players));

					setPlayers(JSON.parse(sessionStorage.getItem("players")));
				}

			} catch (error) {
				alert(error);
			}
		};

		const storedCode = sessionStorage.getItem("sessionCode");
		if (!storedCode) {
			const code = generateSessionCode();
			sessionStorage.setItem("sessionCode", code);
			setSessionCode(code);
			sendSessionCode(code);
		} else {
			setSessionCode(storedCode);
			sendSessionCode(storedCode);
		}
	}, []);

	useEffect(() => {
		const handleStorageChange = (event) => {
			if (event.key === "players") {
				const updatedPlayers = JSON.parse(event.newValue || "[]");
				setPlayers(updatedPlayers);
			}
		};

		window.addEventListener("storage", handleStorageChange);

		const storedPlayers = JSON.parse(sessionStorage.getItem("players") || "[]");
		setPlayers(storedPlayers);
	}, []);

	return (
		<div className="min-h-screen bg-gray-100 p-8">
			<div className="max-w-4xl mx-auto">
				<h1 className="text-2xl font-bold mb-8">
					Game Master Dashboard
				</h1>

				<div className="bg-white rounded-lg shadow p-6 mb-8">
					<h2 className="text-lg font-semibold mb-2">Session Code</h2>
					<div className="bg-gray-100 p-4 rounded break-all">
						{sessionCode}
					</div>
				</div>

				<div className="bg-white rounded-lg shadow p-6">
					<h2 className="text-lg font-semibold mb-4">
						Connected Players
					</h2>
					{players.length === 0 ? (
						<p className="text-gray-500">
							No players connected yet
						</p>
					) : (
						<ul className="space-y-2">
							{players.map((player, index) => (
								<li
									key={index}
									className="flex items-center justify-between bg-gray-50 p-3 rounded"
								>
									<span>{player.name}</span>
									<span className="text-sm text-gray-500">
										{new Date(
											player.joinedAt
										).toLocaleTimeString()}
									</span>
								</li>
							))}
						</ul>
					)}
				</div>
			</div>
		</div>
	);
}