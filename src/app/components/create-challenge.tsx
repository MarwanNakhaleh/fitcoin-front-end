"use client";

import { challengeABI } from "@/abis/ABIs";
import { deployedContracts, rpcMap } from "@/globals";
import { useState } from "react";
import { Chain } from "thirdweb";
import { ethers5Adapter } from "thirdweb/adapters/ethers5";
import { Account, Wallet } from "thirdweb/wallets";
import { client } from "../lib/thirdweb-config";
import { ethers } from "ethers";
interface CreateChallengeProps {
    challengeContract: any;
    multiplayerChallengeContract: any;
    wallet: Wallet;
    onClose: () => void;
    selectedChain: Chain;
}

export const CreateChallenge: React.FC<CreateChallengeProps> = ({
    challengeContract,
    multiplayerChallengeContract,
    wallet,
    selectedChain,
    onClose,
}) => {
    const [lengthOfChallenge, setLengthOfChallenge] = useState<number>(0);
    const [challengeMetricsWithTargets, setChallengeMetricsWithTargets] = useState<Record<number, number>>({});
    const [maxCompetitors, setMaxCompetitors] = useState<string>("5");
    const [txStatus, setTxStatus] = useState<string>("");
    const [isMultiplayer, setIsMultiplayer] = useState<boolean>(false);

    const handleCreateChallenge = async () => {
        if (!challengeContract || !multiplayerChallengeContract || !wallet) return;
        console.log("Creating challenge...");

        try {
            setTxStatus("Creating challenge...");
            const lengthOfChallengeInSeconds = lengthOfChallenge * 86400;

            const metrics = Object.keys(challengeMetricsWithTargets).map(Number);
            const targets = metrics.map(metric => challengeMetricsWithTargets[metric]);
            const signer = await ethers5Adapter.signer.toEthers({ client, chain: selectedChain, account: wallet?.getAccount() as Account });
            
            const contractAddress = deployedContracts[selectedChain.id.toString()].challenge || "";
            const ethersChallengeContract = new ethers.Contract(
                contractAddress,
                challengeABI,
                signer || new ethers.providers.JsonRpcProvider(rpcMap[selectedChain.id.toString()]),
            );

            const tx = await ethersChallengeContract.createChallenge(lengthOfChallengeInSeconds, metrics, targets);
            const transactionReceipt = await tx.wait();
            setTxStatus(`Challenge created! Transaction: ${transactionReceipt.transactionHash}`);
            console.log("Challenge created");
            onClose();
        } catch (error) {
            console.error("Error creating challenge:", error);
            setTxStatus(`Error: ${error}`);
        }
    };

    const handleCreateMultiplayerChallenge = async () => {
        if (!multiplayerChallengeContract || !wallet) return;

        try {
            setTxStatus("Creating multiplayer challenge...");
            const lengthOfChallengeInSeconds = lengthOfChallenge * 86400;

            const metrics = Object.keys(challengeMetricsWithTargets).map(Number);
            const targets = metrics.map(metric => challengeMetricsWithTargets[metric]);

            const tx = await multiplayerChallengeContract.call("createMultiplayerChallenge", [
                lengthOfChallengeInSeconds,
                metrics,
                targets,
                parseInt(maxCompetitors)
            ]);

            setTxStatus(`Multiplayer challenge created! Transaction: ${tx.receipt.transactionHash}`);
            console.log("Multiplayer challenge created:", tx);
            onClose();
        } catch (error) {
            console.error("Error creating multiplayer challenge:", error);
            setTxStatus(`Error: ${error}`);
        }
    };

    return (
        <>
            <h2 className="mb-4 text-xl font-bold">Create Challenge</h2>

            <div className="flex items-center mb-4">
                <label className="relative inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={isMultiplayer}
                        onChange={(e) => setIsMultiplayer(e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    <span className="ms-3 text-sm font-medium text-gray-800">Multiplayer Challenge</span>
                </label>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 text-gray-800">
                <div>
                    <label className="block mb-1 text-sm font-medium">Length of Challenge (days)</label>
                    <input
                        type="number"
                        value={lengthOfChallenge}
                        onChange={(e) => setLengthOfChallenge(parseInt(e.target.value))}
                        className="w-full p-2 border rounded"
                        placeholder="1"
                    />
                </div>
                <div>
                    <label className="block mb-1 text-sm font-medium">Challenge Metrics & Targets</label>
                    <div className="space-y-2">
                        {[
                            { id: 0, label: "Number of steps" },
                            { id: 1, label: "Number of miles walked or run" },
                            { id: 2, label: "Number of miles cycled" },
                            { id: 3, label: "Number of calories burned" }
                        ].map(({ id, label }) => (
                            <div key={id} className="flex flex-col space-y-2">
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={id in challengeMetricsWithTargets}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setChallengeMetricsWithTargets(prev => ({
                                                    ...prev,
                                                    [id]: 0
                                                }));
                                            } else {
                                                setChallengeMetricsWithTargets(prev => {
                                                    const newState = { ...prev };
                                                    delete newState[id];
                                                    return newState;
                                                });
                                            }
                                        }}
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-700">{label}</span>
                                </label>
                                {id in challengeMetricsWithTargets && (
                                    <div className="ml-6">
                                        <input
                                            type="number"
                                            min="1"
                                            step="1"
                                            value={challengeMetricsWithTargets[id] || ''}
                                            onChange={(e) => {
                                                const value = parseInt(e.target.value);
                                                if (value > 0 || e.target.value === '') {
                                                    setChallengeMetricsWithTargets(prev => ({
                                                        ...prev,
                                                        [id]: value || 0
                                                    }));
                                                }
                                            }}
                                            className="w-full p-2 border rounded"
                                            placeholder={`Enter target ${label.toLowerCase()}`}
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                {isMultiplayer && (
                    <div>
                        <label className="block mb-1 text-sm font-medium">Max Competitors (multiplayer only)</label>
                        <input
                            type="number"
                            value={maxCompetitors}
                            onChange={(e) => setMaxCompetitors(e.target.value)}
                            className="w-full p-2 border rounded"
                            placeholder="5"
                        />
                    </div>
                )}
            </div>
            <div className="flex gap-4 mt-4">
                <button
                    onClick={isMultiplayer ? handleCreateMultiplayerChallenge : handleCreateChallenge}
                    className={`px-4 py-2 text-white rounded hover:bg-opacity-90 ${isMultiplayer ? 'bg-purple-600 hover:bg-purple-700' : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                >
                    {isMultiplayer ? 'Create Multiplayer Challenge' : 'Create Solo Challenge'}
                </button>
            </div>
            {txStatus && (
                <div className="mt-4 p-4 bg-white rounded-lg shadow">
                    <p className="text-gray-800">{txStatus}</p>
                </div>
            )}
        </>
    );
}; 
