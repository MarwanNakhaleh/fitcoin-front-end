// components/ConnectFitbitButton.tsx
import React from 'react';
import { fitbitClientId, fitbitRedirectUri } from '@/globals';

interface ConnectFitbitButtonProps {
  walletAddress: string;
}

const ConnectFitbitButton: React.FC<ConnectFitbitButtonProps> = ({ walletAddress }) => {
  // Define your scopes
  const scopes = encodeURIComponent('activity location profile social');
  const redirectUri = encodeURIComponent(fitbitRedirectUri || '');

  // Create a state object that includes the wallet address (you can add more fields if needed)
  const stateObj = { walletAddress };
  const state = encodeURIComponent(JSON.stringify(stateObj));

  // Append state to your auth URL
  const fitbitAuthUrl = `https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=${fitbitClientId}&redirect_uri=${redirectUri}&scope=${scopes}&state=${state}`;

  return (
    <a href={fitbitAuthUrl}>
      <button className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700">
        Connect with Fitbit
      </button>
    </a>
  );
};

export default ConnectFitbitButton;
