import { db } from "@/app/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";

export async function POST(req) {
	const { pseudo, points } = await req.json();

	if (!pseudo || !points) {
		return new Response(
		JSON.stringify({ error: "Pseudo and points are required." }), {
			status: 400,
			headers: { "Content-Type": "application/json" },
		}
		);
	}

	try {
		const userRef = doc(db, "players", pseudo);
		await updateDoc(userRef, { points: points });

		return new Response(JSON.stringify({}), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});

	} catch (error) {
		console.error("API send-answer error: ", error);
		return new Response(JSON.stringify({ error: "Internal Server Error." }), {
			status: 500,
			headers: { "Content-Type": "application/json" },
		});
	}
}
