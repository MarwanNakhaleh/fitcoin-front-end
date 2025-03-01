import { Chain } from "thirdweb";
import { localhost, arbitrumSepolia, baseSepolia, hardhat,base, optimism, optimismSepolia, arbitrum } from "thirdweb/chains";

export const deployedContracts = {
    [localhost.id.toString()]: {
        challenge: process.env.NEXT_PUBLIC_LOCALHOST_CHALLENGE_CONTRACT_ADDRESS,
        multiplayerChallenge: process.env.NEXT_PUBLIC_LOCALHOST_MULTIPLAYER_CHALLENGE_CONTRACT_ADDRESS,
    },
    [base.id.toString()]: {
        challenge: process.env.NEXT_PUBLIC_BASE_CHALLENGE_CONTRACT_ADDRESS,
        multiplayerChallenge: process.env.NEXT_PUBLIC_BASE_MULTIPLAYER_CHALLENGE_CONTRACT_ADDRESS,
    },
    [baseSepolia.id.toString()]: {
        challenge: process.env.NEXT_PUBLIC_BASE_SEPOLIA_CHALLENGE_CONTRACT_ADDRESS,
        multiplayerChallenge: process.env.NEXT_PUBLIC_BASE_SEPOLIA_MULTIPLAYER_CHALLENGE_CONTRACT_ADDRESS,
    },
    [arbitrum.id.toString()]: {
        challenge: process.env.NEXT_PUBLIC_ARBITRUM_CHALLENGE_CONTRACT_ADDRESS,
        multiplayerChallenge: process.env.NEXT_PUBLIC_ARBITRUM_MULTIPLAYER_CHALLENGE_CONTRACT_ADDRESS,
    },
    [arbitrumSepolia.id.toString()]: {
        challenge: process.env.NEXT_PUBLIC_ARBITRUM_SEPOLIA_CHALLENGE_CONTRACT_ADDRESS,
        multiplayerChallenge: process.env.NEXT_PUBLIC_ARBITRUM_SEPOLIA_MULTIPLAYER_CHALLENGE_CONTRACT_ADDRESS,
    },
    [optimism.id.toString()]: {
        challenge: process.env.NEXT_PUBLIC_OPTIMISM_CHALLENGE_CONTRACT_ADDRESS,
        multiplayerChallenge: process.env.NEXT_PUBLIC_OPTIMISM_MULTIPLAYER_CHALLENGE_CONTRACT_ADDRESS,
    },
    [optimismSepolia.id.toString()]: {
        challenge: process.env.NEXT_PUBLIC_OPTIMISM_SEPOLIA_CHALLENGE_CONTRACT_ADDRESS,
        multiplayerChallenge: process.env.NEXT_PUBLIC_OPTIMISM_SEPOLIA_MULTIPLAYER_CHALLENGE_CONTRACT_ADDRESS,
    },
}

export const chainMap: Record<string, Chain> = {
    [localhost.id.toString()]: localhost,
    [hardhat.id.toString()]: hardhat,
    [baseSepolia.id.toString()]: baseSepolia,
    [arbitrumSepolia.id.toString()]: arbitrumSepolia,
    [optimismSepolia.id.toString()]: optimismSepolia,
    [base.id.toString()]: base,
    [arbitrum.id.toString()]: arbitrum,
    [optimism.id.toString()]: optimism,
};

export const getChainFromId = (chainId: string, selectedChain?: Chain): Chain => {
    return chainMap[chainId] || selectedChain;
};

export const rpcMap: Record<string, string> = {
    [baseSepolia.id.toString()]: process.env.BASE_SEPOLIA_RPC_URL || "",
    [base.id.toString()]: process.env.BASE_RPC_URL || "",
    [arbitrumSepolia.id.toString()]: process.env.ARBITRUM_SEPOLIA_RPC_URL || "",
    [arbitrum.id.toString()]: process.env.ARBITRUM_RPC_URL || "",
    [optimismSepolia.id.toString()]: process.env.OPTIMISM_SEPOLIA_RPC_URL || "",
    [optimism.id.toString()]: process.env.OPTIMISM_RPC_URL || "",
    [localhost.id.toString()]: process.env.LOCALHOST_RPC_URL || "",
    [hardhat.id.toString()]: process.env.LOCALHOST_RPC_URL || "",
}

export const fitbitClientId = process.env.NEXT_PUBLIC_FITBIT_CLIENT_ID || "";
export const fitbitClientSecret = process.env.FITBIT_CLIENT_SECRET || "";
export const fitbitRedirectUri = process.env.NEXT_PUBLIC_FITBIT_REDIRECT_URI || "";
export const privateKey = process.env.PRIVATE_KEY || "";
export const alchemyApiKey = process.env.ALCHEMY_API_KEY || "";