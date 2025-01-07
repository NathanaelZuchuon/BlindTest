
"use client";

import Link from 'next/link'

export default function Home() {
	return (
		<div className="min-h-screen bg-gray-100">
			<nav className="bg-white shadow-lg">
				<div className="max-w-6xl mx-auto px-4">
					<div className="flex justify-between h-16">
						<div className="flex items-center">
							<h1 className="text-xl font-bold">
								BlindTest Platform
							</h1>
						</div>
						<div className="flex items-center space-x-4">
							<Link
								href="/gamemaster"
								className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
							>
								Game Master
							</Link>
							<Link
								href="/player/login"
								className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
							>
								Player
							</Link>
						</div>
					</div>
				</div>
			</nav>
			<main className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-8">
				<h2 className="text-3xl font-bold text-gray-800 mb-8">
					Created to handle BlindTest for Otaku-fan.
				</h2>
				<p className="text-gray-600 text-center max-w-2xl">
					Choose your role: Join as a Game Master to create and manage
					a game session, or as a Player to participate in an existing
					game.
				</p>
			</main>
		</div>
	);
}
