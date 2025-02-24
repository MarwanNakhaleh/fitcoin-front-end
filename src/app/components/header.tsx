import { Wallet } from "thirdweb/wallets";

interface HeaderProps {
    wallet: Wallet | undefined
}

export const Header: React.FC<HeaderProps> = ({ wallet }) => {
    return (
        <>
            {wallet ? (
                <div>
                    <h2>Welcome, connected user!</h2>
                </div>
            ) : (
                <div>
                    <h2>Please connect your wallet to access more features.</h2>
                </div>
            )}
        </>
    );
};

