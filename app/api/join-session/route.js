export async function POST(req) {
	try {
		return new Response(
			JSON.stringify({ message: "Player joined successfully" }),
			{
				status: 200,
				headers: { "Content-Type": "application/json" },
			}
		);

	} catch (error) {
		console.error("Error in join-session API: ", error);
		return new Response(
			JSON.stringify({ error: "Internal server error" }),
			{
				status: 500,
				headers: { "Content-Type": "application/json" },
			}
		);
	}
}
