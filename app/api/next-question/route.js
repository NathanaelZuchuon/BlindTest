import { db } from "@/app/lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

export async function POST(req) {
	const { sessionCode, question } = await req.json();

	if (!sessionCode) {
		return new Response(
			JSON.stringify({ error: "Session code is required." }),
			{
				status: 400,
				headers: { "Content-Type": "application/json" },
			}
		);
	}

	if (!question) {
		return new Response(
			JSON.stringify({ error: "Question is required." }),
			{
				status: 400,
				headers: { "Content-Type": "application/json" },
			}
		);
	}

	try {
		const sessionRef = doc(db, "sessions", sessionCode);
		const sessionDoc = await getDoc(sessionRef);

		// Create or update the session with the new question
		if (!sessionDoc.exists()) {
			await setDoc(sessionRef, { currentQuestion: question });
		} else {
			await setDoc(
				sessionRef,
				{ currentQuestion: question },
				{ merge: true }
			);
		}

		return new Response(JSON.stringify({}), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	} catch (error) {
		console.error("API next-question error: ", error);
		return new Response(
			JSON.stringify({ error: "Internal Server Error." }),
			{
				status: 500,
				headers: { "Content-Type": "application/json" },
			}
		);
	}
}
