import { db } from "@/app/lib/firebase";
import {
	doc,
	getDoc,
	setDoc,
	getDocs,
	collection,
	serverTimestamp,
} from "firebase/firestore";

export async function POST(req) {
	try {
		// Checking data received
		const { code, name } = await req.json();
		if (!code || !name) {
			return new Response(
				JSON.stringify({ error: "Code and pseudo required." }),
				{
					status: 400,
					headers: { "Content-Type": "application/json" },
				}
			);
		}

		// Session code verification
		const sessionsCollectionRef = collection(db, "sessions");
		const querySnapshot = await getDocs(sessionsCollectionRef);

		let codeExists = false;

		querySnapshot.forEach((doc) => {
			if (doc.id === code) {
				codeExists = true;
			}
		});

		if (!codeExists) {
			return new Response(
				JSON.stringify({ error: "This session code doesn't exist." }),
				{
					status: 404,
					headers: { "Content-Type": "application/json" },
				}
			);
		}

		// Check if pseudo already exists
		const playerDoc = doc(db, "players", name);
		const playerSnapshot = await getDoc(playerDoc);

		if (playerSnapshot.exists()) {
			return new Response(
				JSON.stringify({ error: "This pseudo is already in use." }),
				{
					status: 409,
					headers: { "Content-Type": "application/json" },
				}
			);
		}

		await setDoc(doc(db, "players", name), {
			points: 0,
			joinedAt: serverTimestamp(),
			sessionCode: code,
		});

		// If everything is OK
		return new Response(
			JSON.stringify({
				playerName: name,
				points: 0,
				joinedAt: (await getDoc(doc(db, "players", name)))
					.data()
					.joinedAt.toDate(),
			}),
			{
				status: 200,
				headers: { "Content-Type": "application/json" },
			}
		);
	} catch (error) {
		console.error("API join-session error: ", error);
		return new Response(JSON.stringify({ error: "Internal Server Error." }), {
			status: 500,
			headers: { "Content-Type": "application/json" },
		});
	}
}
