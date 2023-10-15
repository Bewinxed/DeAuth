// src/lib/server/lucia.ts
import { dev } from "$app/environment";
import { DEFAULT_APP_ID, DISCORD_OAUTH_CLIENT_ID, DISCORD_OAUTH_CLIENT_SECRET } from "$env/static/private";
import { prisma } from "@lucia-auth/adapter-prisma";
import { discord } from "@lucia-auth/oauth/providers";
import { lucia } from "lucia";
import { sveltekit } from "lucia/middleware";
import { solanaAuth } from "../auth/solAuth";
import { prisma as prismaClient } from "./prisma";




export const auth = lucia({
	adapter: prisma(prismaClient, {
		user: "user", 
		key: "key", 
		session: "session" 
	})
, 
	env: dev ? "DEV" : "PROD",
	middleware: sveltekit(),
	getUserAttributes: (data) => {
		return data;
	},
    getSessionAttributes: (data) => {
        return {public_key: data.provider_account_id}},
        csrfProtection: true,
        

    
});



export const solana_oauth = solanaAuth(auth, {
    uri: dev ? "http://127.0.0.1:5173/auth" : "https://deauth.xyz/api/auth",
    validationUri: dev ? "http://127.0.0.1:5173/api/auth/session" : "https://deauth.xyz/api/auth/session",
    redirectUri: dev ? "http://127.0.0.1:5173/api/auth/callback/solana" : "https://deauth.xyz/api/auth/callback/solana",
    scope: ["scope1", "scope2"],
    rpc: "https://api.mainnet-beta.solana.com/",
    loginExpiresIn: 60 * 60 * 24 * 30,
    appId: DEFAULT_APP_ID,
});

export const discord_oauth = discord(auth, {
    clientId: DISCORD_OAUTH_CLIENT_ID,
    clientSecret: DISCORD_OAUTH_CLIENT_SECRET,
    redirectUri: dev ? "http://127.0.0.1:5173/api/auth/callback/discord" : "https://deauth.xyz/api/auth/callback/discord",
    scope: ["identify", "guilds"],

});

export type Auth = typeof auth;