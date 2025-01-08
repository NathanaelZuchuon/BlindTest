import { db } from "@/app/lib/firebase";
import { doc, updateDoc, collection, getDocs } from "firebase/firestore";

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
		const hey = (data) => {
			return new Response(JSON.stringify({ players: data }), {
				status: 200,
				headers: { "Content-Type": "application/json" },
			});
		}

		const sessionRef = doc(db, "session", "sessionInfos");
		await updateDoc(sessionRef, {
			sessionCode: sessionCode,
		});

		const playersCollectionRef = collection(db, "players");
		const playersSnapshot = await getDocs(playersCollectionRef);

		if (playersSnapshot.empty) {
			return hey([]);
		}

		const playersList = playersSnapshot.docs.map((doc) => ({
			name: doc.id,
			points: doc.data().points,
			joinedAt: doc.data().joinedAt.toDate(),
		}));

		return hey(playersList);

	} catch (error) {
		console.error("API reset-code error: ", error);
		return new Response(JSON.stringify({ error: "Internal Server Error." }), {
			status: 500,
			headers: { "Content-Type": "application/json" },
		});
	}
}
