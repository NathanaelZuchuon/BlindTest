import { db } from "@/app/lib/firebase";
import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";

export const useCurrentQuestion = (id, pseudo) => {
	const [currentQuestion, setCurrentQuestion] = useState("No question yet.");
	const [points, setPoints] = useState(0);

	useEffect(() => {
		if (!id || !pseudo) return;

		// Active listening on the current question in the session
		const sessionDocRef = doc(db, "sessions", id);
		const sessionUnsubscribe = onSnapshot(sessionDocRef, (docSnapshot) => {
			if (docSnapshot.exists()) {
				const data = docSnapshot.data();
				setCurrentQuestion(data.currentQuestion);
			} else {
				console.log("Non-existent session.");
			}
		});

		// Active listening on the player points
		const pseudoDocRef = doc(db, "players", pseudo);
		const pseudoUnsubscribe = onSnapshot(pseudoDocRef, (docSnapshot) => {
			if (docSnapshot.exists()) {
				const data = docSnapshot.data();
				setPoints(data.points || 0);
			} else {
				console.log("Non-existent user.");
			}
		});

		// Clean up the two subscriptions
		return () => {
			sessionUnsubscribe();
			pseudoUnsubscribe();
		};
	}, [id, pseudo]);

	return { currentQuestion, points };
};
