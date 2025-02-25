"use client";

import { useState } from "react";
import { ContractInfo } from "@/app/components/contract-info";
import { Modal } from "@/app/components/modal";

interface ChallengeProps {
    challengeContract: any;
    multiplayerChallengeContract: any;
    wallet: any;
}

export const ChallengeInteraction: React.FC<ChallengeProps> = ({
    challengeContract,
    multiplayerChallengeContract,
    wallet,
}) => {
    const [challengeId, setChallengeId] = useState<string>("");
    const [betAmount, setBetAmount] = useState<string>("");
    const [bettingFor, setBettingFor] = useState<boolean>(true);
    const [lengthOfChallenge, setLengthOfChallenge] = useState<number>(0);
    const [challengeMetricsWithTargets, setChallengeMetricsWithTargets] = useState<Record<number, number>>({});
    const [maxCompetitors, setMaxCompetitors] = useState<string>("5");
    const [measurements, setMeasurements] = useState<string>("100");
    const [txStatus, setTxStatus] = useState<string>("");
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isMultiplayer, setIsMultiplayer] = useState<boolean>(false);

    const handleCreateChallenge = async () => {
        if (!challengeContract || !multiplayerChallengeContract || !wallet) return;
        console.log("Creating challenge...");
        
        try {
            setTxStatus("Creating challenge...");
            const lengthOfChallengeInSeconds = lengthOfChallenge * 86400;
            
            const metrics = Object.keys(challengeMetricsWithTargets).map(Number);
            const targets = metrics.map(metric => challengeMetricsWithTargets[metric]);

            const tx = await challengeContract.call("createChallenge", [
                lengthOfChallengeInSeconds,
                metrics,
                targets
            ]);

            setTxStatus(`Challenge created! Transaction: ${tx.receipt.transactionHash}`);
            console.log("Challenge created:", tx);
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
        } catch (error) {
            console.error("Error creating multiplayer challenge:", error);
            setTxStatus(`Error: ${error}`);
        }
    };

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
                                className={`px-4 py-2 text-white rounded hover:bg-opacity-90 ${
                                    isMultiplayer ? 'bg-purple-600 hover:bg-purple-700' : 'bg-blue-600 hover:bg-blue-700'
                                }`}
                            >
                                {isMultiplayer ? 'Create Multiplayer Challenge' : 'Create Solo Challenge'}
                            </button>
                        </div>
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