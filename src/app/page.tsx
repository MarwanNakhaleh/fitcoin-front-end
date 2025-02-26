"use client";

import { Chain, ContractOptions, getContract, prepareContractCall, sendAndConfirmTransaction } from "thirdweb";
import { arbitrum, arbitrumSepolia, base, baseSepolia, optimism, optimismSepolia } from "thirdweb/chains";
import { client, hardhatChain, wallets } from "@/app/lib/thirdweb-config";
import { deployedContracts } from "@/globals";
import { ConnectButton } from "thirdweb/react";
import { useWallet } from "@/app/providers";
import { Wallet, Account } from "thirdweb/wallets";
import { Header } from "@/app/components/header";
import { ChallengeInteraction } from "@/app/components/challenge";
import { MyChallenges } from "@/app/components/my-challenges";
import { useEffect, useState } from "react";

const Dashboard = () => {
    const { wallet, chain, setWallet, setChain } = useWallet();
    const [challengeContract, setChallengeContract] = useState<Readonly<ContractOptions<[], `0x${string}`>> | null>(null)
    const [multiplayerChallengeContract, setMultiplayerChallengeContract] = useState<Readonly<ContractOptions<[], `0x${string}`>> | null>(null);

    useEffect(() => {
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
        if (challengeContract) {
            setChallengeContract(challengeContract);
        }
        if (multiplayerChallengeContract) {
            setMultiplayerChallengeContract(multiplayerChallengeContract);
        }
    }, [chain])

    useEffect(() => {
        (async () => {
            if (challengeContract && multiplayerChallengeContract) {
                console.log("Challenge contract and multiplayer challenge contract found");
                const addr = wallet?.getAccount()?.address || "";
                if (wallet?.getAccount()) {
                    const tx = prepareContractCall({
                        contract: challengeContract as Readonly<ContractOptions<[], `0x${string}`>>,
                        method: {
                            "inputs": [
                                {
                                    "internalType": "address",
                                    "name": "",
                                    "type": "address"
                                }
                            ],
                            "name": "bettorWhitelist",
                            "outputs": [
                                {
                                    "internalType": "bool",
                                    "name": "",
                                    "type": "bool"
                                }
                            ],
                            "stateMutability": "view",
                            "type": "function"
                        },
                        params: [addr]
                    });
                    const transactionReceipt = await sendAndConfirmTransaction({
                        account: wallet?.getAccount() as Account,
                        transaction: tx,
                    });
                    console.log("Transaction receipt: ", JSON.stringify(transactionReceipt));
                } else {
                    console.error('User verification failed');
                }
            }
            const connectedChain = await wallet?.getChain();
            if (connectedChain) {
                console.log("Connected to chain:", connectedChain);
                if (setChain) {
                    setChain(connectedChain);
                }
            }
        })()
    }, [challengeContract, multiplayerChallengeContract, wallet])

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
                    }),
                }),
            });

            const data = await response.json();
            console.log("Connected to wallet");
            setWallet(wallet);
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
