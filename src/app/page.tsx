"use client";

import { ConnectButton, useActiveWallet } from "thirdweb/react";
import { client, wallets } from "@/app/lib/thirdweb-config";

import { Header } from "@/app/components/header";

export default function Home() {
  const wallet = useActiveWallet();

  const handleConnect = async () => {
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payload: JSON.stringify({
            signature: 'your-signature',
            message: 'your-message',
            nonce: 'your-nonce',
          }),
        }),
      });

      const data = await response.json();
      if (data.isVerifiedUser) {
        console.log('User is verified');
      } else {
        console.error('User verification failed');
      }
    } catch (error) {
      console.error('Error connecting:', error);
    }
  };

  return (
    <main className="p-4 pb-10 min-h-[100vh] flex items-center justify-center container max-w-screen-lg mx-auto">
      <div className="py-20">
        <Header wallet={wallet} />
        <div className="flex justify-center mb-20">
          <ConnectButton
            client={client}
            wallets={wallets}
            appMetadata={{
              name: "Fitcoin",
              url: "https://example.com",
            }}
            onConnect={handleConnect}
          />
        </div>
      </div>
    </main>
  );
}
