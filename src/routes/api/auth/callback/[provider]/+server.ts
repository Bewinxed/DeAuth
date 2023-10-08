// src/routes/auth/callback/+server.ts
import type { OAuthProvider } from '@prisma/client';
import { error } from '@sveltejs/kit';
import type { Session } from 'lucia';
import { prisma } from 'src/lib/server/prisma';
import type { RequestEvent, RequestHandler } from './$types';
import { discord_handler } from './handlers/discord';
import { solana_handler } from './handlers/solana';

const handlers: {
	[key in OAuthProvider]: (request: RequestEvent) => Promise<Session>;
} = {
	solana: solana_handler,
	discord: discord_handler
};

export const GET: RequestHandler = async (request) => {
	const { locals, cookies, params, url } = request;

	const handler = handlers[params.provider as OAuthProvider];

	if (!handler) {
		throw error(400, 'Invalid provider');
	}

	const state = url.searchParams.get('state');
	
	if (!state) {
		throw error(400, 'Missing state');
	}

	const auth_request = await prisma.authRequest
		.findFirstOrThrow({
			where: {
				state: state
			}
		})
		.catch(() => {
			throw error(404, 'Session not found');
		});

	const session = await handler(request);

	// if (!auth_request.user_id) {
	// 	throw error(401, 'No User Id');
	// }

	// if the app has a whitelist, check if the user is on it
	const whitelist = await prisma.user_access_control.count({
		where: {
			application_id: auth_request.application_id,
			access_type: 'WHITELIST'
		}
	});

	if (whitelist > 0) {
		const user_accounts = await prisma.key.findMany({
			where: {
				user_id: session.user.id
			}
		});
		const user_access_control = await prisma.user_access_control.findFirst({
			where: {
				application_id: auth_request.application_id,
				access_type: 'WHITELIST',
				OR: user_accounts.map((account) => ({
					AND: [
						{ account_id: account.id },
						{ provider: account.provider ?? undefined } // If account.provider is null, make it undefined to satisfy type constraints
					]
				}))
			}
		});

		if (!user_access_control) {
			throw error(
				401,
				'You have been denied access to this application, Contact the application owner if you believe this is an error.'
			);
		}
	}

	// Exchange the authorization code for an access token and user profile
	locals.auth.setSession(session);

	const original_redirect_uri = cookies.get('original_redirect_uri') ?? '/';
	cookies.delete('original_redirect_uri');

	// Redirect the user back to the main application
	return new Response(null, {
			status: 302,
			headers: {
				Location:
					`${original_redirect_uri}?${new URLSearchParams({
						app_id: auth_request.application_id,
						state: auth_request.state,
						session_id: session.sessionId,
					}).toString()}` ?? '/'
			}
		})
	};


