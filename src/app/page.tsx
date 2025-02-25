"use client";

import { Chain, getContract } from "thirdweb";
import { arbitrum, arbitrumSepolia, base, baseSepolia, optimism, optimismSepolia } from "thirdweb/chains";
import { client, hardhatChain, wallets } from "@/app/lib/thirdweb-config";
import { deployedContracts } from "@/globals";
import { ConnectButton } from "thirdweb/react";
import { useWallet } from "@/app/providers";
import { Wallet } from "thirdweb/wallets";
import { Header } from "@/app/components/header";

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

    const getContractAddressFromChain = (): string => {
        console.log("Chain", chain);
        if (!chain) return "";
        const chainchain = chain as Chain;
        switch (chainchain.id) {
            case hardhatChain.chainId:
                return deployedContracts.localhost.challenge ?? "";
            case base.id:
                return deployedContracts.base.challenge ?? "";
            case baseSepolia.id:
                return deployedContracts.baseSepolia.challenge ?? "";
            case arbitrum.id:
                return deployedContracts.arbitrum.challenge ?? "";
            case arbitrumSepolia.id:
                return deployedContracts.arbitrumSepolia.challenge ?? "";
            case optimism.id:
                return deployedContracts.optimism.challenge ?? "";
            case optimismSepolia.id:
                return deployedContracts.optimismSepolia.challenge ?? "";
            default:
                return "";
        }
    }

    const contractAddress = getContractAddressFromChain();
    const challengeContract = contractAddress && chain ?
        getContract({
            address: contractAddress,
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
            {wallet && (
                <p className="mb-2 text-lg font-bold text-gray-800">Contract address: {challengeContract?.address || "Not connected to a supported chain"}</p>
            )}
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
        </div>
    )
};

export default Dashboard;
