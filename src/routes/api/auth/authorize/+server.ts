// src/routes/auth/authorize/+server.ts
import type { RequestHandler } from './$types';

export const GET: RequestHandler = () => {
  // Construct the authorization URL for your Solana server
  const authUrl = 'http://localhost:5173/authorize?response_type=code&client_id=' + process.env.SOLANA_CLIENT_ID + '&redirect_uri=' + encodeURIComponent(process.env.SVELTEKIT_REDIRECT_URI);

  // Redirect the user to the Solana server's message signing page
  return {
    status: 302,
    headers: {
      location: authUrl,
    },
  };
};
