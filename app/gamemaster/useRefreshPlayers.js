import { db } from "@/app/lib/firebase";

import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";

export const useRefreshPlayers = (code) => {
	const [players, setPlayers] = useState([]);

	useEffect(() => {
		const playersCollectionRef = collection(db, "players");
		const q = query(playersCollectionRef, where("sessionCode", "==", code));

		// Once a player is added, we return all players in the session
		const unsubscribe = onSnapshot(q, (snapshot) => {
			const allPlayers = snapshot.docs.map((doc) => ({
				name: doc.id,
				points: doc.data().points,
				joinedAt: doc.data().joinedAt.toDate(),
				answer: doc.data().answer,
			}));
			setPlayers(allPlayers);
		});

		return () => unsubscribe();
	}, [code]);

	return { players };
};
