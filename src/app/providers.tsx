"use client";

import React, { createContext, useContext, useState } from 'react';
import { Chain } from "thirdweb";
import { Wallet } from "thirdweb/wallets";
import { ThirdwebProvider } from "thirdweb/react";
import { optimismSepolia } from "thirdweb/chains";

interface WalletContextType {
    wallet: Wallet | undefined;
    chain: Chain | string | undefined;
    setWallet: (wallet: Wallet | undefined) => void;
    setChain: (chain: Chain | string | undefined) => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const Providers = ({ children }: { children: React.ReactNode }) => {
    const [wallet, setWallet] = useState<Wallet | undefined>(undefined);
    const [chain, setChain] = useState<Chain | string | undefined>(optimismSepolia);

    return (
        <ThirdwebProvider>
            <WalletContext.Provider value={{ wallet, chain, setWallet, setChain }}>
                {children}
            </WalletContext.Provider>
        </ThirdwebProvider>
    );
};

export function useWallet() {
    const context = useContext(WalletContext);
    if (context === undefined) {
        throw new Error('useWallet must be used within a WalletProvider');
    }
    return context;
}