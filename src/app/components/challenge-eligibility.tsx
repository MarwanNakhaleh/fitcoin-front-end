"use client";

import { useState, useEffect } from "react";
import { Chain, prepareContractCall, sendAndConfirmTransaction } from "thirdweb";
import { PayEmbed, useReadContract, WalletProvider } from "thirdweb/react";
import { ethers5Adapter } from "thirdweb/adapters/ethers5";
import { Account, Wallet } from "thirdweb/wallets";
import { client } from "../lib/thirdweb-config";
import { ethers } from "ethers";
import { useSigner } from "@thirdweb-dev/react";
import { challengeABI } from "@/abis/ABIs";
import { deployedContracts, rpcMap } from "@/globals";

interface ChallengeEligibilityProps {
    challengeContract: any;
    multiplayerChallengeContract: any;
    wallet: Wallet;
    selectedChain: Chain;
}

export const ChallengeEligibility: React.FC<ChallengeEligibilityProps> = ({
    challengeContract,
    multiplayerChallengeContract,
    wallet,
    selectedChain,
}) => {
    const [whitelistInfo, setWhitelistInfo] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    console.log("challengeContract", challengeContract);
    console.log("wallet address", wallet?.getAccount()?.address);

    const addBettorToWhitelist = async () => {
        const params = new URLSearchParams();
        params.set('chainId', selectedChain.id.toString());
        params.set('userAddress', wallet?.getAccount()?.address || "");
        const response = await fetch(`/api/bettorWhitelist?${params.toString()}`);
        const status = await response.status;
        const data = await response.json();
        if (status == 200) {
            setWhitelistInfo(data);
        }
    }

    useEffect(() => {
        console.log("Selected Chain:", selectedChain);
        void addBettorToWhitelist();
    }, [selectedChain]);

    const { data, isLoading } = useReadContract({
        contract: challengeContract,
        method: "function bettorWhitelist(address bettor)",
        params: [wallet?.getAccount()?.address || ""],
    });
    
    useEffect(() => {
        const addBettorToWhitelist = async () => {
            try {
                const account = wallet?.getAccount() as Account;
                if (!account || !account.address) {
                    console.error("Wallet account not available");
                    setError("Wallet account not available");
                    setLoading(false);
                    return;
                }

                // Get the latest nonce from the network
                const signer = await ethers5Adapter.signer.toEthers({ client, chain: selectedChain, account });

                
                const nonce = await signer.provider.getTransactionCount(account.address);

                // Prepare the transaction
                const transaction = prepareContractCall({
                    contract: challengeContract,
                    method: "function addBettor(address bettor)",
                    params: [account.address || ""],
                    nonce: nonce,
                })

                const transactionReceipt = await sendAndConfirmTransaction({
                    account,
                    transaction
                });
                console.log("transactionReceipt", transactionReceipt);
            } catch (err: any) {
                console.error("Error adding bettor:", err);
                setError(`Error adding bettor: ${err.message || JSON.stringify(err)}`);
            } finally {
                setLoading(false);
            }
        }
        const fetchWhitelist = async () => {
            console.log("Is loading:", isLoading);

            if (!challengeContract || !wallet) {
                setLoading(false);
                return;
            }

            try {
                const account = wallet?.getAccount() as Account;
                if (!account || !account.address) {
                    console.error("Wallet account not available");
                    setError("Wallet account not available");
                    setLoading(false);
                    return;
                }

                // Get the latest nonce from the network
                const signer = await ethers5Adapter.signer.toEthers({ client, chain: selectedChain, account });

                const ethersChallengeContract = new ethers.Contract(
                    deployedContracts[selectedChain.id.toString()].challenge || "",
                    challengeABI,
                    signer || new ethers.providers.JsonRpcProvider(rpcMap[selectedChain.id.toString()]),
                );

                const nonce = await signer.provider.getTransactionCount(account.address);

                const transaction = prepareContractCall({
                    contract: challengeContract,
                    method: "function bettorWhitelist(address bettor)",
                    params: [account.address || ""],
                    nonce: nonce,
                })

                const transactionReceipt = await sendAndConfirmTransaction({
                    account,
                    transaction
                });
                console.log("read bettor whitelist transactionReceipt", transactionReceipt);
            } catch (err: any) {
                console.error("Error fetching challenges:", err);
                setError(`Error fetching challenges: ${err.message || JSON.stringify(err)}`);
            } finally {
                setLoading(false);
            }
        };
        addBettorToWhitelist();
        fetchWhitelist();
    }, [challengeContract, wallet, selectedChain]);

    if (loading) {
        return (
            <div className="p-4 bg-white rounded-lg shadow mt-6">
                <p className="text-gray-700">Determining your challenge eligibility...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 bg-white rounded-lg shadow mt-6">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    <p className="font-bold">Error</p>
                    <p className="text-sm break-words">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 bg-white rounded-lg shadow mt-6">
            <PayEmbed
                client={client}
                payOptions={{
                    mode: "fund_wallet",
                    metadata: {
                        name: "Get funds",
                    },
                    prefillBuy: {
                        chain: selectedChain,
                        amount: "0.01",
                    },
                }}
            />
            <h2 className="text-xl font-bold mb-4">My Challenges</h2>

            {whitelistInfo && (
                <div className="text-center py-6">
                    <p className="text-gray-700 mb-2">{whitelistInfo ? "You are eligible for challenges" : "You are not eligible for challenges"}</p>
                </div>
            )}
        </div>
    );
}; 
