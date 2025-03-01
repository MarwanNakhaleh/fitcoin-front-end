import { alchemyApiKey, deployedContracts, fitbitClientId, fitbitClientSecret, fitbitRedirectUri, privateKey } from '@/globals';
import { NextResponse } from 'next/server';
import { ethers } from 'ethers';
import { baseSepolia } from 'thirdweb/chains';
import { challengeABI } from '@/abis/ABIs';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const stateParam = searchParams.get('state');

  if (!code) {
    return NextResponse.json({ error: 'Missing authorization code' }, { status: 400 });
  }

  // Decode the state parameter to extract walletAddress
  let walletAddress = '';
  if (stateParam) {
    try {
      const stateObj = JSON.parse(decodeURIComponent(stateParam));
      walletAddress = stateObj.walletAddress;
    } catch (error) {
      console.error('Error decoding state:', error);
      // Optionally, you might return an error response here
    }
  }

  const basicAuth = Buffer.from(`${fitbitClientId}:${fitbitClientSecret}`).toString('base64');

  const params = new URLSearchParams();
  params.append('client_id', fitbitClientId);
  params.append('grant_type', 'authorization_code');
  params.append('redirect_uri', fitbitRedirectUri);
  params.append('code', code);

  try {
    const tokenResponse = await fetch('https://api.fitbit.com/oauth2/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${basicAuth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error('Error fetching token:', tokenData);
      return NextResponse.json(tokenData, { status: tokenResponse.status });
    }

    // Interact with your smart contract using the walletAddress
    const provider = new ethers.AlchemyProvider("base-sepolia", alchemyApiKey);
    const wallet = new ethers.Wallet(`0x${privateKey}`, provider);
    const contractAddress = deployedContracts[baseSepolia.id.toString()].challenge || "";

    const challengeContract = new ethers.Contract(
      contractAddress, 
      challengeABI, 
      wallet
    );

    // Use the walletAddress in your contract call
    let result = await challengeContract.bettorWhitelist(walletAddress);
    console.log(`Is ${walletAddress} in whitelist for challenges?`, result);

    if (!result) {
      const addBettorTx = await challengeContract.addNewBettor(walletAddress);
      console.log("addNewBettor tx:", addBettorTx);
      result = await challengeContract.bettorWhitelist(walletAddress);
      console.log(`Now is ${walletAddress} in whitelist for challenges?`, result);
    }

    // Optionally: Set the token in a secure cookie (or store it in a session)
    const response = NextResponse.redirect(new URL('/', request.url));
    response.cookies.set('fitbit_access_token', tokenData.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: tokenData.expires_in, // seconds
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Token exchange or contract interaction error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
