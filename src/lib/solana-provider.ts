// solana-provider.js
import { OAuth2Config } from "@auth/core/providers";

const SolanaProvider: OAuth2Config = {
  id: "solana",
  name: "Solana",
  type: "oauth",
  version: "2.0",
  scope: "", // No specific scope required for Solana message signing
  params: { grant_type: "authorization_code" },
  accessTokenUrl: "http://localhost:5173/token",
  authorizationUrl: "http://localhost:5173/authorize?response_type=code",
  profileUrl: "http://localhost:5173/profile",
  clientId: process.env.SOLANA_CLIENT_ID,
  clientSecret: process.env.SOLANA_CLIENT_SECRET,
  profile: (profile) => {
    return {
      id: profile.id,
      publicKey: profile.publicKey,
      signature: profile.signature,
      name: profile.name || "Solana User",
      image: profile.image || null, // Solana wallets don't provide an image by default
    };
  },
};

export default SolanaProvider;
