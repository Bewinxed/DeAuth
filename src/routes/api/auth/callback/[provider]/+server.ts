// src/routes/auth/callback/+server.ts
import type { OAuthProvider } from '@prisma/client';
import { error } from '@sveltejs/kit';
import type { Auth } from 'lucia';
import { auth, discord_oauth, solana_oauth } from 'src/lib/server/lucia';
import { prisma } from 'src/lib/server/prisma';
import { create_session_tokens } from 'src/lib/utils/sign_in_helpers';
import { v4 as uuid } from 'uuid';
import type { RequestEvent, RequestHandler } from './$types';
import { handle_existing_session, handle_no_session } from './auth_utils';
import { discord_handler } from './handlers/discord';
import { solana_handler } from './handlers/solana';

const handlers: {
	[key in OAuthProvider]: {
		handler: (request: RequestEvent) => Promise<{
			tokens: {
				access_token: string;
				refresh_token: string;
				access_token_expires_in: number;
			};
			user: {
				id: string;
				username?: string;
				avatar?: string;
				discriminator?: string;
				public_flags?: number;
				flags: number;
				locale: string;
				mfa_enabled: boolean;
				provider: OAuthProvider;
			};
		}>;
		provider: Partial<Auth>;
	};
} = {
	solana: {
		handler: solana_handler,
		provider: solana_oauth
	},
	discord: {
		handler: discord_handler,
		provider: discord_oauth
	}
};

export const GET: RequestHandler = async (request) => {
	const { locals, cookies, params, url: original_url } = request;
	let session = await locals.auth.validate();

	const url = new URL(original_url.toString().replace('ampstate', '&state'));

	const { handler, provider } = handlers[params.provider as OAuthProvider];

	if (!handler) {
		throw error(400, 'Invalid provider');
	}

	const state = url.searchParams.get('state');

	if (!state) {
		throw error(400, 'Missing state');
	}

	const { application, ...auth_request } = await prisma.authRequest
		.findFirstOrThrow({
			where: {
				state: state
			},
			include: {
				application: {
					include: {
						app_role: true
					}
				}
			}
		})
		.catch(() => {
			throw error(404, 'Auth Request not found');
		});

	const { tokens, user: provider_user } = await handler(request);

	const { access_token, refresh_token, access_token_expires_in } =
		await create_session_tokens({
			application,
			date: auth_request.created_at,
			proof: tokens.access_token,
			account_id: provider_user.id
		});

	const getUser = async () => {
		try {
			if (!session) {
				return await handle_no_session({
					application,
					provider_user,
					provider: auth_request.provider,
					provider_account_id: provider_user.id
				});
			} else {
				return await handle_existing_session({
					session,
					application,
					provider_user,
					provider_account_id: provider_user.id,
					provider: auth_request.provider
				});
			}
		} catch (e) {
			console.log(e);
			if (e instanceof Error) {
				throw error(500, e.message);
			}
		}
	};

	const user = await getUser();

	if (!user) {
		throw error(500, 'User not found nor created');
	}

	session =
		session ||
		(await auth.createSession({
			userId: user.id,
			sessionId: uuid(),
			attributes: {
				access_token: tokens.access_token,
				refresh_token: tokens.refresh_token,
				auth_request_id: auth_request.id,
				access_token_expires_in: tokens.access_token_expires_in,
				application_id: application.id,
				provider_account_id: provider_user.id,
			}
		}));

	if (!session) {
		throw error(500, 'Session not found nor created');
	}

	await prisma.authRequest.updateMany({
		where: {
			id: auth_request.id
		},
		data: {
			user_id: user.id,
			provider_account_id: provider_user.id,
			provider_access_token: tokens.access_token,
			provider_refresh_token: tokens.refresh_token,
			provider_access_token_expires_in: tokens.access_token_expires_in,
			access_token,
			refresh_token,
			access_token_expires_in
		}
	});

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
					session_id: session.sessionId
				}).toString()}` ?? '/'
		}
	});
};
