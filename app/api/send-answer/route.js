import { db } from "@/app/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";

export async function POST(req) {
	const { pseudo, answer } = await req.json();

	if (!pseudo || !answer) {
		return new Response(
		JSON.stringify({ error: "Pseudo and answer are required." }), {
			status: 400,
			headers: { "Content-Type": "application/json" },
		}
		);
	}

	try {
		const userRef = doc(db, "players", pseudo);
		await updateDoc(userRef, { answer: answer });

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
