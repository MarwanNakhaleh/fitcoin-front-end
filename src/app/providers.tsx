"use client";

import React, { createContext, useContext, useState } from 'react';
import { Chain } from "thirdweb";
import { Wallet } from "thirdweb/wallets";
import { ThirdwebProvider } from "thirdweb/react";


interface WalletContextType {
    wallet: Wallet | undefined;
    chain: Chain | undefined;
    setWallet: (wallet: Wallet | undefined) => void;
    setChain: (chain: Chain | undefined) => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const Providers = ({ children }: { children: React.ReactNode }) => {
    const [wallet, setWallet] = useState<Wallet | undefined>(undefined);
    const [chain, setChain] = useState<Chain | undefined>(undefined);

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