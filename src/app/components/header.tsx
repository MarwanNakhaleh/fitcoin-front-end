import { Wallet } from "thirdweb/wallets";
import { Chain } from "thirdweb";
import { arbitrum, arbitrumSepolia, base, baseSepolia, optimism, optimismSepolia, localhost, hardhat } from "thirdweb/chains";

interface HeaderProps {
    wallet: Wallet | undefined,
    selectedChain: Chain,
    setSelectedChain: (chain: Chain | string | undefined) => void,
}

export const Header: React.FC<HeaderProps> = ({ wallet, selectedChain, setSelectedChain }) => {
    // Function to convert chain ID to Chain object
    const getChainFromId = (chainId: string): Chain => {
        switch (chainId) {
            case localhost.id.toString():
                return localhost;
            case hardhat.id.toString():
                return hardhat;
            case baseSepolia.id.toString():
                return baseSepolia;
            case arbitrumSepolia.id.toString():
                return arbitrumSepolia;
            case optimismSepolia.id.toString():
                return optimismSepolia;
            case base.id.toString():
                return base;
            case arbitrum.id.toString():
                return arbitrum;
            case optimism.id.toString():
                return optimism;
            default:
                return selectedChain; // Return current chain if not found
        }
    };

    return (
        <>
            {wallet ? (
                <div>
                    <h2>Welcome, connected user!</h2>
                    <select
                        value={selectedChain.id.toString()}
                        onChange={(e) => setSelectedChain(getChainFromId(e.target.value))}
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
                </div>
            ) : (
                <div>
                    <h2>Please connect your wallet to access more features.</h2>
                </div>
            )}
        </>
    );
};

