
"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Player() {
	const router = useRouter();

	useEffect(() => {
		router.push("/player/login");
	}, [router]);

	return null;
}
