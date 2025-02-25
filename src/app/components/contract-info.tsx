"use client";

interface ContractInfoProps {
  challengeContract: any;
  multiplayerChallengeContract: any;
}

export const ContractInfo: React.FC<ContractInfoProps> = ({
  challengeContract,
  multiplayerChallengeContract,
}) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="mb-4 text-xl font-bold text-gray-800">Contract Addresses</h2>
      <p className="mb-2 text-gray-800">
        Solo challenge contract: {challengeContract?.address || "Not connected to a supported chain"}
      </p>
      <p className="mb-2 text-gray-800">
        Multiplayer challenge contract: {multiplayerChallengeContract?.address || "Not connected to a supported chain"}
      </p>
    </div>
  );
}; 
