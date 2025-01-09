
"use client";

import { v4 as uuidv4 } from "uuid";
import { useState, useEffect } from "react";

export default function GameMaster() {
	const [sessionCode, setSessionCode] = useState("");
	const [players, setPlayers] = useState([]);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [inputValue, setInputValue] = useState("");
	const [error, setError] = useState("");

	useEffect(() => {
		const generateSessionCode = () => {
			const uuid = uuidv4();
			const code = uuid.replace(/-/g, "").substring(0, 10);
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
		if (isAuthenticated) {
			if (!storedCode) {
				const code = generateSessionCode();
				sessionStorage.setItem("sessionCode", code);
				setSessionCode(code);
				sendSessionCode(code);
			} else {
				setSessionCode(storedCode);
				sendSessionCode(storedCode);
			}
		}
	}, [isAuthenticated]);

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

	const handleSubmit = (e) => {
		e.preventDefault();

		// alert(process.env.REACT_APP_hey);

		if (inputValue === "zuch") {
			setIsAuthenticated(true);
			setError("");
		} else {
			setError("You are not an authenticated game master.");
		}
	};

	if (!isAuthenticated) {
		return (
			<div className="min-h-screen bg-gray-100 flex items-center justify-center">
				<div className="bg-white rounded-lg shadow p-6">
					<h2 className="text-lg font-semibold mb-4">
						Access to the dashboard
					</h2>
					<form onSubmit={handleSubmit} className="space-y-4">
						<div>
							<label
								htmlFor="hey"
								className="block text-sm font-medium text-gray-700"
							>
								Are you a game master ?
							</label>
							<input
								type="text"
								id="hey"
								value={inputValue}
								onChange={(e) => setInputValue(e.target.value)}
								className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
								required
							/>
						</div>
						{error && (
							<p className="text-red-500 text-sm">{error}</p>
						)}
						<button
							type="submit"
							className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring"
						>
							Valider
						</button>
					</form>
				</div>
			</div>
		);

	} else {
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
}