
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PlayerLogin() {
	const router = useRouter();
	const [code, setCode] = useState("");
	const [name, setName] = useState("");
	const [error, setError] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsSubmitting(true);

		if (code.length !== 10) {
			setError("Invalid session code.");
			setIsSubmitting(false);
			return;
		}

		if (name.length < 2) {
			setError("Name must be at least 2 characters long.");
			setIsSubmitting(false);
			return;
		}

		try {
			const response = await fetch("/api/join-session", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ code, name }),
			});

			const data = await response.json();

			if (response.ok) {
				sessionStorage.setItem("playerName", data.playerName);
				sessionStorage.setItem("points", data.points);
				sessionStorage.setItem("joinedAt", data.joinedAt);
				sessionStorage.setItem("sessionCode", code);

				router.push("/player/dashboard");

			} else {
				setError(data.error);
				setIsSubmitting(false);
			}

		} catch (error) {
			setError("Failed to join game session.");
			setIsSubmitting(false);
		}
	};

	return (
		<div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
			<div className="max-w-md w-full bg-white rounded-lg shadow p-8">
				<h1 className="text-2xl font-bold mb-6">Join Game Session</h1>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label
							htmlFor="code"
							className="block text-sm font-medium text-gray-700 mb-1"
						>
							Session Code
						</label>
						<input
							type="text"
							id="code"
							value={code}
							onChange={(e) => setCode(e.target.value)}
							className="w-full px-3 py-2 border border-gray-300 rounded-md"
							required
						/>
					</div>

					<div>
						<label
							htmlFor="name"
							className="block text-sm font-medium text-gray-700 mb-1"
						>
							Your Name
						</label>
						<input
							type="text"
							id="name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							className="w-full px-3 py-2 border border-gray-300 rounded-md"
							required
							minLength={2}
						/>
					</div>

					{error && <p className="text-red-500 text-sm">{error}</p>}

					<button
						type="submit"
						disabled={isSubmitting}
						className={`w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-md ${
							isSubmitting ? "opacity-50 cursor-not-allowed" : ""
						}`}
					>
						{isSubmitting ? "Joining..." : "Join Game"}
					</button>
				</form>
			</div>
		</div>
	);
}
