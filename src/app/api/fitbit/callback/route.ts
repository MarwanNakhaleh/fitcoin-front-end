import { fitbitClientId, fitbitClientSecret, fitbitRedirectUri } from '@/globals';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  if (!code) {
    return NextResponse.json({ error: 'Missing authorization code' }, { status: 400 });
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
    console.error('Token exchange error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
