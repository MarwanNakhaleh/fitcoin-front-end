import { fitbitClientId, fitbitRedirectUri } from '@/globals';
import React from 'react';

const ConnectFitbitButton = () => {
    // possible scopes: activity cardio_fitness electrocardiogram heartrate irregular_rhythm_notifications location nutrition oxygen_saturation profile respiratory_rate settings sleep social temperature weight

    const scopes = encodeURIComponent('activity location profile social');
    const redirectUri = encodeURIComponent(fitbitRedirectUri || '');

    const fitbitAuthUrl = `https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=${fitbitClientId}&redirect_uri=${redirectUri}&scope=${scopes}`;

    return (
        <a href={fitbitAuthUrl}>
            <button
                className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
            >
                Connect with Fitbit
            </button>
        </a>
    );
};

export default ConnectFitbitButton;
