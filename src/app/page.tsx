"use client";

import { Chain, getContract } from "thirdweb";
import { arbitrum, arbitrumSepolia, base, baseSepolia, optimism, optimismSepolia } from "thirdweb/chains";
import { client, hardhatChain, wallets } from "@/app/lib/thirdweb-config";
import { deployedContracts } from "@/globals";
import { ConnectButton } from "thirdweb/react";
import { useWallet } from "@/app/providers";
import { Wallet } from "thirdweb/wallets";
import { Header } from "@/app/components/header";
import { ChallengeInteraction } from "@/app/components/challenge";
import { MyChallenges } from "@/app/components/my-challenges";

const Dashboard = () => {
    const { wallet, chain, setWallet, setChain } = useWallet();

    const handleConnect = async (wallet: Wallet) => {
        try {
            const response = await fetch('/api/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    payload: JSON.stringify({
                        signature: 'your-signature',
                        message: 'your-message',
                        nonce: 'your-nonce',
                    }),
                }),
            });

            const data = await response.json();
            if (data.isVerifiedUser) {
                console.log('User is verified');
                setWallet(wallet);
            } else {
                console.error('User verification failed');
            }
            console.log("Connected to wallet");
            setWallet(wallet);

            // Get and set the chain information
            const connectedChain = await wallet.getChain();
            if (connectedChain) {
                console.log("Connected to chain:", connectedChain);
                // Make sure your context has a setChain function
                if (setChain) {
                    setChain(connectedChain);
                }
            }
        } catch (error) {
            console.error('Error connecting:', error);
        }
    }

    // Handle wallet disconnection
    const handleDisconnect = () => {
        console.log("Disconnected");
        setWallet(undefined);
    }

    const getContractAddressesFromChain = (): { challenge: string, multiplayerChallenge: string } => {
        let contracts = { challenge: "", multiplayerChallenge: "" };
        if (!chain) return contracts;

        const chainId = (chain as Chain).id.toString();

        const networkByChainId: Record<string, keyof typeof deployedContracts> = {
            [hardhatChain.chainId.toString()]: "localhost",
            [base.id.toString()]: "base",
            [baseSepolia.id.toString()]: "baseSepolia",
            [arbitrum.id.toString()]: "arbitrum",
            [arbitrumSepolia.id.toString()]: "arbitrumSepolia",
            [optimism.id.toString()]: "optimism",
            [optimismSepolia.id.toString()]: "optimismSepolia",
        };

        const network = networkByChainId[chainId];
        if (network) {
            contracts = {
                "challenge": deployedContracts[network].challenge || "",
                "multiplayerChallenge": deployedContracts[network].multiplayerChallenge || ""
            }
        }
        return contracts;
    }

    const contractAddress = getContractAddressesFromChain();
    const challengeContract = (contractAddress.challenge !== "") && chain ?
        getContract({
            address: contractAddress.challenge,
            chain: chain as Chain,
            client,
        }) : null;

    const multiplayerChallengeContract = (contractAddress.multiplayerChallenge !== "") && chain ?
        getContract({
            address: contractAddress.multiplayerChallenge,
            chain: chain as Chain,
            client,
        }) : null;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
            <Header
                wallet={wallet}
                selectedChain={chain as Chain}
                setSelectedChain={setChain}
            />
            <ConnectButton
                client={client}
                wallets={wallets}
                appMetadata={{
                    name: "Fitcoin",
                    url: "https://example.com",
                }}
                onConnect={handleConnect}
                onDisconnect={handleDisconnect}
            />

            {wallet ? (
                <>
                    {challengeContract && multiplayerChallengeContract && (
                        <MyChallenges
                            challengeContract={challengeContract}
                            wallet={wallet}
                        />
                    )}
                    <ChallengeInteraction
                        challengeContract={challengeContract}
                        multiplayerChallengeContract={multiplayerChallengeContract}
                        wallet={wallet}
                    />
                </>
            ) : (
                <p className="text-lg font-bold text-gray-800">Connect your wallet to start</p>
            )}
        </div>
    )
};

export default Dashboard;
