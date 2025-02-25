"use client";

import { useState, useEffect } from "react";

interface MyChallengesProps {
    challengeContract: any;
    wallet: any;
}

export const MyChallenges: React.FC<MyChallengesProps> = ({
    challengeContract,
    wallet,
}) => {
    const [challenges, setChallenges] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchChallenges = async () => {
            if (!challengeContract || !wallet) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                // Get the connected wallet's address
                const address = wallet.address;
                
                const userChallenges = await challengeContract.read.getChallengesForChallenger([address]);
                
                console.log("User challenges:", userChallenges);
                setChallenges(userChallenges);
            } catch (err: any) {
                console.error("Error fetching challenges:", err);
                setError(`Error fetching challenges: ${err.message || JSON.stringify(err)}`);
            } finally {
                setLoading(false);
            }
        };

        fetchChallenges();
    }, [challengeContract, wallet]);

    if (loading) {
        return (
            <div className="p-4 bg-white rounded-lg shadow mt-6">
                <h2 className="text-xl font-bold mb-4">My Challenges</h2>
                <p className="text-gray-700">Loading your challenges...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 bg-white rounded-lg shadow mt-6">
                <h2 className="text-xl font-bold mb-4">My Challenges</h2>
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    <p className="font-bold">Error</p>
                    <p className="text-sm break-words">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 bg-white rounded-lg shadow mt-6">
            <h2 className="text-xl font-bold mb-4">My Challenges</h2>
            
            {challenges && challenges.length > 0 ? (
                <div className="space-y-4">
                    {challenges.map((challengeId, index) => (
                        <div key={index} className="p-3 border rounded bg-gray-50">
                            <p className="font-medium">Challenge ID: {challengeId.toString()}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-6">
                    <p className="text-gray-700 mb-2">You have not created any challenges yet.</p>
                    <p className="text-blue-600">Create a new challenge to get started!</p>
                </div>
            )}
        </div>
    );
}; 
