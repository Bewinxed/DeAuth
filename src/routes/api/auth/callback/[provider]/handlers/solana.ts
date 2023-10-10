import { solana_oauth } from '$lib/server/lucia.js';
import { OAuthRequestError } from '@lucia-auth/oauth';
import { error } from '@sveltejs/kit';
import { prisma } from 'src/lib/server/prisma';
import type { RequestEvent } from '../$types';

export const solana_handler = async ({
	url,
	cookies,
	
}: RequestEvent) => {
	const storedState = cookies.get('solana_oauth_state');
	const state = url.searchParams.get('state');
	// const signature = url.searchParams.get('proof');
	// validate state
	if (storedState !== state) {
		throw error(400, 'Invalid state');
	}

	const auth_request = await prisma.authRequest
		.findFirstOrThrow({
			where: {
				state: storedState
			}
		})
		.catch(() => {
			throw error(404, 'Auth request not found');
		});

	const signature = auth_request.signature;

	if (!signature) {
		throw error(400, 'Missing signature');
	}

	try {
		const {
			solanaUser,
			solanaTokens: { access_token, refresh_token, access_token_expires_in }
		} = await solana_oauth.validateCallback(signature);

		return {
			tokens: {
				access_token: access_token,
				refresh_token: refresh_token,
				access_token_expires_in: access_token_expires_in
			},
			user: solanaUser
		};

		
	} catch (e) {
		if (e instanceof OAuthRequestError) {
			// invalid code
			throw error(400, e.message);
		}
		console.log(e);
		throw error(500, JSON.stringify(e));
	}
};
