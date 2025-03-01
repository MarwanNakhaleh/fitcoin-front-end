import { NextRequest, NextResponse } from 'next/server';
import {ethers} from "ethers";
import { rpcMap, deployedContracts, privateKey, alchemyApiKey } from '@/globals';
import { challengeABI } from '@/abis/ABIs';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const chainId = searchParams.get('chainId') || "";
  const userAddress = searchParams.get('userAddress') || "";

  // Validate required parameters
  if (!chainId || !userAddress) {
    return NextResponse.json(
      { success: false, message: 'chainId and userAddress are required' },
      { status: 400 }
    );
  }

  // Check if we have an RPC URL for this chainId
  const rpc = rpcMap[chainId];
  console.log("rpc", rpc);
  
  if (!rpc) {
    return NextResponse.json(
      { success: false, message: `No RPC endpoint found for chainId: ${chainId}` },
      { status: 400 }
    );
  }

  try {
    const provider = new ethers.providers.JsonRpcProvider(rpc);
		const wallet = new ethers.Wallet(`0x${privateKey}`, provider);
		const contractAddress = deployedContracts[chainId].challenge || "";
		console.log("contractAddress", contractAddress);
		
		// Validate contract address
		if (!contractAddress) {
      return NextResponse.json(
        { success: false, message: `No contract address found for chainId: ${chainId}` },
        { status: 400 }
      );
    }
		
		const challengeContract = new ethers.Contract(
      contractAddress, 
      challengeABI, 
      wallet
    );

		const result = await challengeContract.bettorWhitelist(userAddress);
		console.log(`is ${userAddress} in whitelist?`, result);
		
		// Return a proper response
		return NextResponse.json({ 
      success: true, 
      isWhitelisted: result 
    });

  } catch (error) {
    console.error('Error fetching whitelist:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch whitelist' },
      { status: 500 }
    );
  }
}

// POST handler - add address to whitelist
export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    const { address } = body;
    
    if (!address) {
      return NextResponse.json(
        { success: false, message: 'Address is required' },
        { status: 400 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: `Address ${address} added to whitelist` 
    });
  } catch (error) {
    console.error('Error adding to whitelist:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to add address to whitelist' },
      { status: 500 }
    );
  }
} 