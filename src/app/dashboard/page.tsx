"use client";

import { Chain, getContract } from "thirdweb";
import { arbitrum, arbitrumSepolia, base, baseSepolia, optimism, optimismSepolia } from "thirdweb/chains";
import { client, hardhatChain, wallets } from "@/app/lib/thirdweb-config";
import { deployedContracts } from "@/globals";
import { ConnectButton } from "thirdweb/react";
import { useRouter } from "next/navigation";
import { useWallet } from "@/app/providers";
import { Wallet } from "thirdweb/wallets";
import { Header } from "@/app/components/header";

const Dashboard = () => {
    const { wallet, chain, setWallet, setChain } = useWallet();
    const router = useRouter();

    const handleConnect = async (wallet: Wallet) => {
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
    }

    // Handle wallet disconnection
    const handleDisconnect = () => {
        console.log("Disconnected");
        setWallet(undefined);
        router.push('/');
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
        <>
            <Header 
                wallet={wallet} 
                selectedChain={chain as Chain} 
                setSelectedChain={setChain}
            />
            {wallet && (
                <div>
                    <p>Contract address: {challengeContract?.address || "Not connected to a supported chain"}</p>
                </div>
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
        </>
    )
};

export default Dashboard;
