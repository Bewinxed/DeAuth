// routes/login/discord/callback/+server.ts
import { discord_oauth } from '$lib/server/lucia.js';
import { OAuthRequestError } from '@lucia-auth/oauth';
import { error } from '@sveltejs/kit';

import type { RequestEvent } from '../$types';

export const discord_handler = async ({
	url,
	cookies,
	
}: RequestEvent) => {
	const storedState = cookies.get('discord_oauth_state');
	if (!storedState) {
		throw error(400, 'No stored state found');
	}
	const state = url.searchParams.get('state');
	const code = url.searchParams.get('code');

	// validate state
	if (storedState !== state) {
		throw error(400, 'Invalid state');
	}

	if (!storedState || !state || !code) {
		throw error(400, 'Missing state or code');
	}

	try {
		const { discordUser, discordTokens } =
			await discord_oauth.validateCallback(code);

		return {
			tokens: {
				access_token: discordTokens.accessToken,
				refresh_token: discordTokens.refreshToken,
				access_token_expires_in: discordTokens.accessTokenExpiresIn
			},
			user: discordUser
		};
	} catch (e) {
		console.log(e);
		if (e instanceof OAuthRequestError) {
			throw error(400, e);
		} else if (e instanceof Error) {
			throw error(500, e);
		}

		throw error(500, 'Internal Server Error');
	}
};
