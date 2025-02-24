
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