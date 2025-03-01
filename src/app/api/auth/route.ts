import { challengeABI } from "@/abis/ABIs";
import { privateKey, deployedContracts, rpcMap } from "@/globals";
import { ethers } from "ethers";

export async function POST(request: Request) {
	const { payload } = await request.json();
	const { signature, message, nonce, userAddress, chain } = JSON.parse(payload);

	// Do your off-chain verification here...
	if (!signature || !message || !nonce || !userAddress || !chain) {
		return Response.json({ error: "Invalid request" }, { status: 400 });
	}

	// Assume verification passed; now add the user to the whitelist:
	try {
		const recoveredAddress = ethers.utils.verifyMessage(message, signature);
		console.log("recoveredAddress", recoveredAddress);
		console.log("userAddress", userAddress);
		if(recoveredAddress !== userAddress) {
			return Response.json({ error: "Invalid signature" }, { status: 400 });
		}

		return Response.json({ isVerifiedUser: true, userAddress }, { status: 200 });
	} catch (e) {
		console.error(e);
		return Response.json({ error: "Internal server error" }, { status: 500 });
	}
}
