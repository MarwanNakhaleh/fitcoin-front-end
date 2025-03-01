"use client";

import { Chain, ContractOptions, getContract, prepareContractCall, sendAndConfirmTransaction } from "thirdweb";
import { arbitrum, arbitrumSepolia, base, baseSepolia, optimism, optimismSepolia } from "thirdweb/chains";
import { client, hardhatChain, wallets } from "@/app/lib/thirdweb-config";
import { deployedContracts } from "@/globals";
import { useWallet } from "@/app/providers";
import { Header } from "@/app/components/header";
import { ChallengeInteraction } from "@/app/components/challenge";
import { MyChallenges } from "@/app/components/my-challenges";
import { useEffect, useState } from "react";
import { Wallet } from "thirdweb/wallets";
import { ChallengeEligibility } from "./components/challenge-eligibility";
import { ConnectButton } from "thirdweb/react";

const Dashboard = () => {
    const { wallet, chain, setWallet, setChain, signer, setSigner } = useWallet();
    const [challengeContract, setChallengeContract] = useState<Readonly<ContractOptions<[], `0x${string}`>> | null>(null)
    const [multiplayerChallengeContract, setMultiplayerChallengeContract] = useState<Readonly<ContractOptions<[], `0x${string}`>> | null>(null);

    // if (challengeContract) {
    //     const { data, isLoading } = useReadContract({
    //         contract: challengeContract as Readonly<ContractOptions<[], `0x${string}`>>,
    //         method: {
    //             "inputs": [
    //                 {
    //                     "internalType": "address",
    //                     "name": "",
    //                     "type": "address"
    //                 }
    //             ],
    //             "name": "bettorWhitelist",
    //             "outputs": [
    //                 {
    //                     "internalType": "bool",
    //                     "name": "",
    //                     "type": "bool"
    //                 }
    //             ],
    //             "stateMutability": "view",
    //             "type": "function"
    //         },
    //         params: [wallet?.getAccount()?.address || ""],
    //     });
    //     console.log("data", data);
    // }

    useEffect(() => {
        const contractAddress = getContractAddressesFromChain();
        console.log("contractAddress", contractAddress);
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
        if (challengeContract) {
            setChallengeContract(challengeContract);
        }
        if (multiplayerChallengeContract) {
            setMultiplayerChallengeContract(multiplayerChallengeContract);
        }
    }, [chain])

    const handleConnect = async (wallet: Wallet) => {
        try {
            const nonce = Date.now().toString();
            const message = `Sign this message to verify your identity with Fitcoin. Nonce: ${nonce}`;
            const signature = await wallet.getAccount()?.signMessage({ message });

            if (!signature) {
                throw new Error('Signature not found');
            }

            const response = await fetch('/api/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    payload: JSON.stringify({
                        signature,
                        message,
                        nonce,
                        userAddress: wallet.getAccount()?.address,
                        chain,
                    }),
                }),
            });

            const data = await response.json();
            if(data.isVerifiedUser) {
                console.log("Connected to wallet");
                setWallet(wallet);
            } else {
                throw new Error('Invalid signature');
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

        contracts = {
            "challenge": deployedContracts[chainId]?.challenge || "",
            "multiplayerChallenge": deployedContracts[chainId]?.multiplayerChallenge || ""
        }
        return contracts;
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
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
                        <>
                            <ChallengeEligibility
                                challengeContract={challengeContract}
                                multiplayerChallengeContract={multiplayerChallengeContract}
                                wallet={wallet}
                                selectedChain={chain as Chain}
                            />
                            <MyChallenges
                                challengeContract={challengeContract}
                                wallet={wallet}
                            />
                        </>
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
