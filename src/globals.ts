import { Chain } from "thirdweb";
import { localhost } from "thirdweb/chains";
import { arbitrumSepolia, baseSepolia, hardhat } from "thirdweb/chains";
import { base, optimism, optimismSepolia } from "thirdweb/chains";
import { arbitrum } from "thirdweb/chains";

export const deployedContracts = {
    localhost: {
        challenge: process.env.NEXT_PUBLIC_LOCALHOST_CHALLENGE_CONTRACT_ADDRESS,
    },
    base: {
        challenge: process.env.NEXT_PUBLIC_BASE_CHALLENGE_CONTRACT_ADDRESS,
    },
    baseSepolia: {
        challenge: process.env.NEXT_PUBLIC_BASE_SEPOLIA_CHALLENGE_CONTRACT_ADDRESS,
    },
    arbitrum: {
        challenge: process.env.NEXT_PUBLIC_ARBITRUM_CHALLENGE_CONTRACT_ADDRESS,
    },
    arbitrumSepolia: {
        challenge: process.env.NEXT_PUBLIC_ARBITRUM_SEPOLIA_CHALLENGE_CONTRACT_ADDRESS,
    },
    optimism: {
        challenge: process.env.NEXT_PUBLIC_OPTIMISM_CHALLENGE_CONTRACT_ADDRESS,
    },
    optimismSepolia: {
        challenge: process.env.NEXT_PUBLIC_OPTIMISM_SEPOLIA_CHALLENGE_CONTRACT_ADDRESS,
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