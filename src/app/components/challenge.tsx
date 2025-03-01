"use client";

import { useState } from "react";
import { ContractInfo } from "@/app/components/contract-info";
import { Modal } from "@/app/components/modal";
import { CreateChallenge } from "@/app/components/create-challenge";
import { Chain } from "thirdweb";
interface ChallengeProps {
    challengeContract: any;
    multiplayerChallengeContract: any;
    wallet: any;
    selectedChain: Chain;
}

export const ChallengeInteraction: React.FC<ChallengeProps> = ({
    challengeContract,
    multiplayerChallengeContract,
    wallet,
    selectedChain,
}) => {
    const [challengeId, setChallengeId] = useState<string>("");
    const [betAmount, setBetAmount] = useState<string>("");
    const [bettingFor, setBettingFor] = useState<boolean>(true);
    const [measurements, setMeasurements] = useState<string>("100");
    const [txStatus, setTxStatus] = useState<string>("");
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);


    const handlePlaceBet = async () => {
        if (!challengeContract || !wallet) return;

        try {
            setTxStatus("Placing bet...");
            const tx = await challengeContract.call("placeBet", [
                parseInt(challengeId),
                bettingFor
            ], { value: betAmount });

            setTxStatus(`Bet placed! Transaction: ${tx.receipt.transactionHash}`);
            console.log("Bet placed:", tx);
        } catch (error) {
            console.error("Error placing bet:", error);
            setTxStatus(`Error: ${error}`);
        }
    };

    const handleStartChallenge = async () => {
        if (!challengeContract || !wallet) return;

        try {
            setTxStatus("Starting challenge...");
            const tx = await challengeContract.call("startChallenge", [parseInt(challengeId)]);

            setTxStatus(`Challenge started! Transaction: ${tx.receipt.transactionHash}`);
            console.log("Challenge started:", tx);
        } catch (error) {
            console.error("Error starting challenge:", error);
            setTxStatus(`Error: ${error}`);
        }
    };

    const handleJoinChallenge = async () => {
        if (!multiplayerChallengeContract || !wallet) return;

        try {
            setTxStatus("Joining challenge...");
            const tx = await multiplayerChallengeContract.call("joinChallenge", [parseInt(challengeId)]);

            setTxStatus(`Joined challenge! Transaction: ${tx.receipt.transactionHash}`);
            console.log("Joined challenge:", tx);
        } catch (error) {
            console.error("Error joining challenge:", error);
            setTxStatus(`Error: ${error}`);
        }
    };

    const handleSubmitMeasurements = async () => {
        if (!challengeContract || !wallet) return;

        try {
            setTxStatus("Submitting measurements...");
            const measurementsArray = measurements.split(',').map(m => parseInt(m.trim()));

            const tx = await challengeContract.call("submitMeasurements", [
                parseInt(challengeId),
                measurementsArray
            ]);

            setTxStatus(`Measurements submitted! Transaction: ${tx.receipt.transactionHash}`);
            console.log("Measurements submitted:", tx);
        } catch (error) {
            console.error("Error submitting measurements:", error);
            setTxStatus(`Error: ${error}`);
        }
    };

    return (
        <div className="w-full max-w-3xl mt-8 space-y-6 text-gray-800">
            <ContractInfo
                challengeContract={challengeContract}
                multiplayerChallengeContract={multiplayerChallengeContract}
            />
            
            {challengeContract && multiplayerChallengeContract ? (
                <>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
                    >
                        Create New Challenge
                    </button>

                    <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                        <CreateChallenge
                            challengeContract={challengeContract}
                            multiplayerChallengeContract={multiplayerChallengeContract}
                            wallet={wallet}
                            onClose={() => setIsModalOpen(false)}
                            selectedChain={selectedChain}
                        />
                    </Modal>
                    
                    <div className="p-4 bg-white rounded-lg shadow">
                        <h2 className="mb-4 text-xl font-bold">Interact with Challenge</h2>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <label className="block mb-1 text-sm font-medium">Challenge ID</label>
                                <input
                                    type="number"
                                    value={challengeId}
                                    onChange={(e) => setChallengeId(e.target.value)}
                                    className="w-full p-2 border rounded"
                                    placeholder="1"
                                />
                            </div>
                            <div>
                                <label className="block mb-1 text-sm font-medium">Bet Amount (wei)</label>
                                <input
                                    type="text"
                                    value={betAmount}
                                    onChange={(e) => setBetAmount(e.target.value)}
                                    className="w-full p-2 border rounded"
                                    placeholder="1000000000000000"
                                />
                            </div>
                            <div>
                                <label className="block mb-1 text-sm font-medium">Betting For Challenger</label>
                                <select
                                    value={bettingFor.toString()}
                                    onChange={(e) => setBettingFor(e.target.value === "true")}
                                    className="w-full p-2 border rounded"
                                >
                                    <option value="true">Yes</option>
                                    <option value="false">No</option>
                                </select>
                            </div>
                            <div>
                                <label className="block mb-1 text-sm font-medium">Measurements (comma separated)</label>
                                <input
                                    type="text"
                                    value={measurements}
                                    onChange={(e) => setMeasurements(e.target.value)}
                                    className="w-full p-2 border rounded"
                                    placeholder="100,200,300"
                                />
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-4 mt-4">
                            <button
                                onClick={handlePlaceBet}
                                className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700"
                            >
                                Place Bet
                            </button>
                            <button
                                onClick={handleStartChallenge}
                                className="px-4 py-2 text-white bg-yellow-600 rounded hover:bg-yellow-700"
                            >
                                Start Challenge
                            </button>
                            <button
                                onClick={handleJoinChallenge}
                                className="px-4 py-2 text-white bg-indigo-600 rounded hover:bg-indigo-700"
                            >
                                Join Challenge (Multiplayer)
                            </button>
                            <button
                                onClick={handleSubmitMeasurements}
                                className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700"
                            >
                                Submit Measurements
                            </button>
                        </div>
                    </div>
                    
                    {txStatus && (
                        <div className="p-4 bg-white rounded-lg shadow">
                            <h2 className="mb-2 text-lg font-bold">Transaction Status</h2>
                            <p className="text-gray-800">{txStatus}</p>
                        </div>
                    )}
                </>
            ) : (
                <div className="p-4 bg-white rounded-lg shadow">
                    <p className="text-center text-gray-800">
                        Please connect to a supported network to interact with challenges.
                    </p>
                </div>
            )}
        </div>
    );
}; 