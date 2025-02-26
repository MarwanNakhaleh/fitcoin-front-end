export const dynamic = "force-dynamic";

export async function POST(request: Request) {
	const { payload } = await request.json();
	const { signature, message, nonce } = JSON.parse(payload);

	try {
		if (!signature || !message || !nonce) {
			return Response.json({ error: "Invalid request" }, { status: 400 });
		}

		return Response.json(
			{ isVerifiedUser: true, message, nonce, signature }, 
			{ status: 200 }
		);
	} catch (e) {
		console.error(e);
		return Response.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}