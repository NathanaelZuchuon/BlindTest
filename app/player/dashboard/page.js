
"use client";

import { useState, useEffect, useReducer, useCallback } from "react";
import { useRouter } from "next/navigation";

import { useCurrentQuestion } from "./useCurrentQuestion";

import Swal from 'sweetalert2';

export default function PlayerDashboard() {
	const router = useRouter();
	const [loading, setLoading] = useState(true);
	const [playerName, setPlayerName] = useState(null);

	const [id, setId] = useState("");
	const [score, setScore] = useState(0);
	const [answer, setAnswer] = useState("");

	const [isDisabled, setIsDisabled] = useState(false);

	// Initialize the session
	useEffect(() => {
		const answer = sessionStorage.getItem("answer");
		const name = sessionStorage.getItem("playerName");
		const storedPoints = sessionStorage.getItem("points");

		// If he doesn't have a name, he wanted to enter without using /player/login
		if (!name) {
			router.push("/player/login");
			return;
		}

		// Set playerName with `name`
		setPlayerName(name);

		setAnswer(answer ? answer : "");
		setScore(storedPoints ? parseInt(storedPoints) : 0);

		setLoading(false);
	}, [router]);
	// ---

	// Active listening on the current session question
	useEffect(() => {
		const hey = sessionStorage.getItem("sessionCode");
		setId(hey);
	}, []);

	const { currentQuestion, points } = useCurrentQuestion(id ? id : null, playerName);

	// Active listening on the session'points
	const updateScore = useCallback(() => {
		if (points !== undefined && points !== null) {
			setScore(points);
			sessionStorage.setItem("points", points);
		}
	}, [points]);

	useEffect(() => {
		updateScore();
	}, [updateScore]);
	// ---

	const initialState = {
		questions: [],
		questionNumber: 1,
	};

	const reducer = (state, action) => {
		switch (action.type) {
			case "ADD_QUESTION":
				return {
					questions: [
						...state.questions,
						{ id: state.questionNumber, text: action.question },
					],
					questionNumber: state.questionNumber + 1,
				};
			default:
				return state;
		}
	};

	const [state, dispatch] = useReducer(reducer, initialState);

	useEffect(() => {
		if (currentQuestion && currentQuestion !== "No question yet.") {
			if (!state.questions.find((q) => q.text === currentQuestion)) {
				dispatch({ type: "ADD_QUESTION", question: currentQuestion });
			}
		}
	}, [currentQuestion, state.questions]);
	// ---

	// Timer
	const time = 20; // Time for each question

	const useTimer = (initialTime, currentQuestion) => {
		const [timeLeft, setTimeLeft] = useState(initialTime);

		useEffect(() => {
			if (!currentQuestion || currentQuestion === "No question yet.") { return; }

			setTimeLeft(initialTime);
			setIsDisabled(false);
			setAnswer("");

			const intervalId = setInterval(() => {
				setTimeLeft((prevTime) => {
					if (prevTime <= 0) {
						setIsDisabled(true);

						clearInterval(intervalId);
						return 0;
					}
					return prevTime - 1;
				});
			}, 1000);

			return () => clearInterval(intervalId);

		}, [currentQuestion, initialTime]);

		return timeLeft;
	};

	const timeLeft = useTimer(time, currentQuestion);

	const getStatusColor = () => {
		const upperThird = time * 2/3;
		const middleThird = time * 1/3;

		if (timeLeft > upperThird) return "bg-green-400 transition-colors duration-2000";
		if (timeLeft > middleThird) return "bg-yellow-500 transition-colors duration-2000";
		if (timeLeft > 0) return "bg-red-600 transition-colors duration-2000";
		return "bg-black transition-colors duration-2000";
	};
	// ---

	const handleSubmit = async (e) => {
		e.preventDefault();
		sessionStorage.setItem("answer", answer);

		setAnswer("");
		setIsDisabled(true);

		// Send answer to server
		try {
			const response = await fetch("/api/send-answer", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					pseudo: playerName,
					answer: sessionStorage.getItem("answer")
				}),
			});

			if (!response.ok) {
				throw new Error("Failed to send your answer.");
			} else {
				Swal.fire({
					icon: "success",
					title: "Success",
					text: "Answer sent.",
				});
			}

		} catch (error) {
			Swal.fire({
				icon: "error",
				title: "Error",
				text: error,
			});
		}
		// ---

		sessionStorage.setItem("answer", "");
	};

	if (loading || playerName === null) {
		return <div></div>;
	}

	return (
		<div className="min-h-screen bg-gray-100">
			{/* NavBar */}
			<nav className="bg-white shadow-lg p-4 fixed top-0 w-full">
				<div className="container mx-auto flex justify-between items-center">
					<div
						className={`w-8 h-8 rounded-full ${getStatusColor()} transition-colors duration-300`}
					></div>
					<div className="font-mono text-xl">
						{`00:00:${timeLeft.toString().padStart(2, "0")}`}
					</div>
					<div className="font-bold">Score: {score}</div>
				</div>
			</nav>

			{/* Main Content */}
			<main className="pt-20 p-4 flex gap-4 h-[calc(100vh-5rem)]">
				{/* Questions List */}
				<div className="hidden md:block w-[30%] bg-white rounded-lg shadow p-4 overflow-y-auto">
					<h2 className="font-semibold mb-4">Questions</h2>
					<ul className="space-y-2">
						{state.questions.map((q) => (
							<li
								key={q.id}
								className={`p-2 rounded ${
									q.text != currentQuestion
										? "bg-indigo-100"
										: "bg-gray-100"
								}`}
							>
								{q.text}
							</li>
						))}
					</ul>
				</div>

				<div className="w-full md:w-[70%] flex justify-center">
					{/* Current Question and Answer Area */}
					<div className="w-full max-w-lg bg-white rounded-lg shadow p-4 flex flex-col">
						<div className="flex-1 mb-4">
							<h2 className="text-xl font-bold mb-2">
								Question :
							</h2>
							<p>{currentQuestion}</p>
						</div>
						<form onSubmit={handleSubmit} className="flex gap-2">
							<input
								type="text"
								disabled={isDisabled}
								value={answer}
								onChange={(e) => setAnswer(e.target.value)}
								className="flex-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
								placeholder="Your reply..."
								required
							/>
							<button
								type="submit"
								disabled={isDisabled}
								className="bg-blue-500 text-white px-6 py-2 rounded enabled:hover:bg-blue-600 transition-colors"
							>
								I confirm
							</button>
						</form>
					</div>
				</div>
			</main>
		</div>
	);
}
