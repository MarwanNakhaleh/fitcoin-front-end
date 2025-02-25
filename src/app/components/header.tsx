import { Wallet } from "thirdweb/wallets";
import { Chain } from "thirdweb";
import { arbitrum, arbitrumSepolia, base, baseSepolia, optimism, optimismSepolia, localhost, hardhat } from "thirdweb/chains";
import { chainMap } from "@/globals";

interface HeaderProps {
    wallet: Wallet | undefined,
    selectedChain: Chain,
    setSelectedChain: (chain: Chain | string | undefined) => void,
}

export const Header: React.FC<HeaderProps> = ({ wallet, selectedChain, setSelectedChain }) => {
    // Function to convert chain ID to Chain object
    const getChainFromId = (chainId: string): Chain => {
        return chainMap[chainId] || selectedChain;
    };

    return (
        <div className="p-4 bg-zinc-800 rounded shadow">
            {wallet ? (
                <>
                    <h2 className="mb-2 text-xl">Welcome, connected user!</h2>
                    <label htmlFor="chain-select" className="sr-only">
                        Select Blockchain Network
                    </label>
                    <select
                        id="chain-select"
                        value={selectedChain.id.toString()}
                        onChange={(e) => setSelectedChain(getChainFromId(e.target.value))}
                        className="border border-gray-300 p-2 rounded-md focus:outline-none focus:border-blue-500"
                    >
                        <option value={localhost.id.toString()}>Localhost</option>
                        <option value={hardhat.id.toString()}>Hardhat</option>
                        <option value={baseSepolia.id.toString()}>Base Sepolia</option>
                        <option value={arbitrumSepolia.id.toString()}>Arbitrum Sepolia</option>
                        <option value={optimismSepolia.id.toString()}>Optimism Sepolia</option>
                        <option value={base.id.toString()}>Base</option>
                        <option value={arbitrum.id.toString()}>Arbitrum</option>
                        <option value={optimism.id.toString()}>Optimism</option>
                    </select>
                </>
            ) : (
                <h2 className="mb-2 text-xl">Please connect your wallet to access more features.</h2>
            )}
        </div>
    );
};

