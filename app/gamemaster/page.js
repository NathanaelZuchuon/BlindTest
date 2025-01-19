
"use client";

import { v4 as uuidv4 } from "uuid";
import { useState, useEffect } from "react";
import { useRefreshPlayers } from "./useRefreshPlayers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";

export default function GameMaster() {
	const [sessionCode, setSessionCode] = useState("");
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [inputValue, setInputValue] = useState("");
	const [error, setError] = useState("");

	const [selectedPlayer, setSelectedPlayer] = useState(null);
	const [questions, setQuestions] = useState([]);
	const [newQuestion, setNewQuestion] = useState("");
	const [evaluatedAnswers, setEvaluatedAnswers] = useState(new Map());

	// Active listening, so that we always have all players of the session
	const { players } = useRefreshPlayers(sessionCode);
	// ---

	// Authentication
	useEffect(() => {
		// No authentication, no action
		if (!isAuthenticated) return;

		const generateAndSetSessionCode = async () => {
			// Check if a sesson code already exists
			const existingCode = sessionStorage.getItem("sessionCode");
			if (existingCode) {
				setSessionCode(existingCode);
				return;
			}

			// Generate a new code
			const newCode = uuidv4().replace(/-/g, "").substring(0, 10);
			setSessionCode(newCode);
			sessionStorage.setItem("sessionCode", newCode);

			try {
				// Send new session code to database
				const response = await fetch("/api/reset-code", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ sessionCode: newCode }),
				});

				if (!response.ok) {
					throw new Error("Failed to create the session code.");
				}
			} catch (error) {
				alert(error);
			}
		};

		generateAndSetSessionCode();
	}, [isAuthenticated]);
	// ---

	// Verification of the Game Master
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
	// ---

	// Submission of the next question
	const handleQuestionSubmit = (e) => {
		e.preventDefault();
		if (newQuestion.trim()) {
			setQuestions([...questions, newQuestion]);
			setNewQuestion("");
		}
	};
	// ---

	// Evaluate each player answer
	const handleAccept = async () => {
		if (!selectedPlayer?.name || !selectedPlayer?.answer) return;

		// Check if current answer has been evaluated
		if (evaluatedAnswers.get(selectedPlayer.name) === selectedPlayer.answer)
			return;

		try {
			const response = await fetch("/api/update-player-points", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					pseudo: selectedPlayer.name,
					points: (selectedPlayer.points || 0) + 1,
				}),
			});

			if (!response.ok) {
				throw new Error("Failed to update points.");
			}

			// Mark this specific answer as evaluated
			setEvaluatedAnswers((prev) => {
				const newMap = new Map(prev);
				newMap.set(selectedPlayer.name, selectedPlayer.answer);
				return newMap;
			});
		} catch (error) {
			alert("Error updating points: " + error.message);
		}
	};

	const handleReject = () => {
		if (!selectedPlayer?.name || !selectedPlayer?.answer) return;

		// Check if current answer has been evaluated
		if (evaluatedAnswers.get(selectedPlayer.name) === selectedPlayer.answer)
			return;

		// Mark this specific answer as evaluated
		setEvaluatedAnswers((prev) => {
			const newMap = new Map(prev);
			newMap.set(selectedPlayer.name, selectedPlayer.answer);
			return newMap;
		});
	};
	// ---

	// Reactivate the buttons after new player's answer
	useEffect(() => {
		if (selectedPlayer?.answer && selectedPlayer?.name) {
			const currentEvaluatedAnswer = evaluatedAnswers.get(
				selectedPlayer.name
			);
			if (currentEvaluatedAnswer !== selectedPlayer.answer) {
				setEvaluatedAnswers((prev) => {
					const newMap = new Map(prev);
					newMap.delete(selectedPlayer.name);
					return newMap;
				});
			}
		}
	}, [selectedPlayer?.answer, selectedPlayer?.name, evaluatedAnswers]);
	// ---

	// Check if current answer has been evaluated
	const isCurrentAnswerEvaluated =
		selectedPlayer?.name &&
		selectedPlayer?.answer &&
		evaluatedAnswers.get(selectedPlayer.name) === selectedPlayer.answer;

	// Not authentificated
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
							Confirm
						</button>
					</form>
				</div>
			</div>
		);
	} else {
		return (
			<div className="flex flex-col min-h-screen bg-gray-100">
				{/* Navigation */}
				<nav className="bg-white shadow-md p-4">
					<div className="container mx-auto text-center">
						<span className="font-mono text-xl font-semibold">
							{sessionCode}
						</span>
					</div>
				</nav>

				{/* Main Content */}
				<main className="flex-1 overflow-hidden">
					<div className="h-full max-w-7xl mx-auto p-4">
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
							{/* Left Panel - Players */}
							<div className="bg-white rounded-lg shadow overflow-hidden flex flex-col min-h-[300px] lg:min-h-0">
								<div className="p-4 border-b">
									<h2 className="text-lg font-semibold">
										Players
									</h2>
								</div>
								<div className="flex-1 overflow-y-auto p-4">
									<div className="space-y-2">
										{players.map((player, index) => (
											<button
												key={index}
												onClick={() =>
													setSelectedPlayer(player)
												}
												className="w-full flex items-center justify-between p-3 rounded bg-gray-50 hover:bg-gray-100 transition-colors"
											>
												<span className="font-medium">
													{player.name}
												</span>
												<div className="bg-green-500 text-white rounded-full flex items-center justify-center whitespace-nowrap px-2 py-1">
													{player.points || 0}
												</div>
											</button>
										))}
									</div>
								</div>
							</div>

							{/* Middle Panel - Player Responses */}
							<div className="bg-white rounded-lg shadow overflow-hidden flex flex-col min-h-[300px] lg:min-h-0">
								<div className="p-4 border-b">
									<h2 className="text-lg font-semibold mb-4">
										Player Response
									</h2>
								</div>
								<div className="flex-1 p-4 flex flex-col">
									{selectedPlayer ? (
										<>
											<div className="flex-1  overflow-y-auto">
												<p className="mb-2 font-medium">
													Response from{" "}
													{selectedPlayer.name} :
												</p>
												<p className="bg-gray-50 p-3 rounded">
													{selectedPlayer.answer ||
														"No response yet."}
												</p>
											</div>
											<div className="flex justify-between items-center space-x-4 mt-4 border-t px-4 py-4">
												<button
													onClick={handleReject}
													disabled={
														isCurrentAnswerEvaluated
													}
													className={`px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 ${
														isCurrentAnswerEvaluated
															? "opacity-50 cursor-not-allowed"
															: ""
													}`}
												>
													Reject
												</button>
												<button
													onClick={handleAccept}
													disabled={
														isCurrentAnswerEvaluated
													}
													className={`px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 ${
														isCurrentAnswerEvaluated
															? "opacity-50 cursor-not-allowed"
															: ""
													}`}
												>
													Accept
												</button>
											</div>
										</>
									) : (
										<div className="flex-1 flex items-center justify-center">
											<p className="text-gray-500">
												Select a player to view his
												response.
											</p>
										</div>
									)}
								</div>
							</div>

							{/* Right Panel - Questions */}
							<div className="grid grid-rows-2 gap-4 min-h-[600px] lg:min-h-0">
								{/* Previous Questions */}
								<div className="bg-white rounded-lg shadow overflow-hidden overflow-y-auto flex flex-col">
									<div className="p-4 border-b">
										<h2 className="text-lg font-semibold">
											Previous Questions
										</h2>
									</div>
									<div className="flex-1 overflow-y-auto p-4">
										<ul className="space-y-2">
											{questions.map((q, index) => (
												<li
													key={index}
													className="p-2 bg-gray-50 rounded"
												>
													{q}
												</li>
											))}
										</ul>
									</div>
								</div>

								{/* New Question Form */}
								<div className="bg-white rounded-lg shadow overflow-hidden flex flex-col">
									<div className="p-4 border-b">
										<h2 className="text-lg font-semibold mb-4">
											Submit Question
										</h2>
									</div>
									<div className="flex-1 p-4 flex flex-col">
										<form onSubmit={handleQuestionSubmit}>
											<textarea
												value={newQuestion}
												onChange={(e) =>
													setNewQuestion(
														e.target.value
													)
												}
												className="w-full p-2 border rounded-lg mb-4 h-32 resize-none"
												placeholder="Type the next question here..."
											/>
											<button
												type="submit"
												className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
											>
												Submit Question
											</button>
										</form>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Footer */}
					<footer className="bg-white shadow-md mt-auto py-4 px-6 w-full">
						<div className="max-w-7xl mx-auto flex justify-center">
							<button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center space-x-2">
								<span>Next</span>
								<FontAwesomeIcon
									icon={faChevronRight}
									className="w-4 h-4"
								/>
							</button>
						</div>
					</footer>
				</main>
			</div>
		);
	}
}
