import { db } from "@/app/lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

export async function POST(req) {
	const { sessionCode } = await req.json();

	if (!sessionCode) {
		return new Response(
			JSON.stringify({ error: "Session code is required." }),
			{
				status: 400,
				headers: { "Content-Type": "application/json" },
			}
		);
	}

	try {
		const sessionRef = doc(db, "sessions", sessionCode);
		const sessionDoc = await getDoc(sessionRef);

		// Creation of a new session
		if (!sessionDoc.exists()) {
			await setDoc(sessionRef, {});
		}

		return new Response(JSON.stringify({}), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});

	} catch (error) {
		console.error("API reset-code error: ", error);
		return new Response(JSON.stringify({ error: "Internal Server Error." }), {
			status: 500,
			headers: { "Content-Type": "application/json" },
		});
	}
}
