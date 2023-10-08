// routes/login/discord/callback/+server.ts
import { auth, discord_oauth } from '$lib/server/lucia.js';
import { OAuthRequestError } from '@lucia-auth/oauth';
import type { Prisma } from '@prisma/client';
import { error } from '@sveltejs/kit';

import { prisma } from 'src/lib/server/prisma.js';
import { create_session_tokens } from 'src/lib/utils/sign_in_helpers.js';
import { v4 as uuid } from 'uuid';
import type { RequestEvent } from '../$types';
import { handle_existing_session, handle_no_session } from '../auth_utils';

export const discord_handler = async ({
	url,
	cookies,
	locals
}: RequestEvent) => {
	const session = await locals.auth.validate();
	const storedState = cookies.get('discord_oauth_state');
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

		const auth_request = await prisma.authRequest
			.findFirstOrThrow({
				where: {
					state: storedState
				}
			})
			.then(async (auth_request) => {
				await prisma.authRequest.updateMany({
					where: {
						state: storedState
					},
					data: {
						provider_account_id: discordUser.id,
						provider_access_token: discordTokens.accessToken,
						provider_refresh_token: discordTokens.refreshToken,
						access_token_expires_in: discordTokens.accessTokenExpiresIn
					}
				});
				return auth_request;
			})
			.catch(() => {
				throw error(400, 'No auth request found');
			});

		const application = await prisma.application
			.findFirstOrThrow({
				where: {
					id: auth_request.application_id
				},
				include: {
					app_role: {
						orderBy: {
							created_at: 'asc'
						}
					}
				}
			})
			.catch(() => {
				throw error(404, 'Application not found');
			});

		auth_request.provider_account_id = discordUser.id;
		auth_request.provider_access_token = discordTokens.accessToken;
		auth_request.provider_refresh_token = discordTokens.refreshToken;
		auth_request.access_token_expires_in = discordTokens.accessTokenExpiresIn;

		const getUser = async () => {
			let user: Prisma.UserGetPayload<object> | null = null;
			try {
				if (session) {
					user = await handle_existing_session({
						application,
						auth_request,
						session
					});
				} else {
					user = await handle_no_session({
						application,
						auth_request
					});
				}
			} catch (e) {
				console.log(e);
				if (e instanceof Error) {
					throw error(500, e.message);
				}
			}

			if (!user) {
				throw error(500, 'User not found nor created');
			}

			await prisma.key.update({
				where: {
					id: `${auth_request.provider}:${discordUser.id}`
				},
				data: {
					account_id: discordUser.id,
					additional_data: discordUser
				}
			});

			return user;
		};

		const user = await getUser();
		if (!user) {
			throw error(500, 'User not found nor created');
		}

		const { access_token, refresh_token, access_token_expires_in } =
			await create_session_tokens({
				application,
				date: auth_request.created_at,
				proof: discordTokens.accessToken,
				account_id: discordUser.id
			});

		await prisma.authRequest.update({
			where: {
				id: auth_request.id
			},
			data: {
				user_id: user.id,
				provider_account_id: discordUser.id,
				application_id: application.id,
				provider_access_token: discordTokens.accessToken,
				provider_refresh_token: discordTokens.refreshToken,
				access_token,
				refresh_token,
				access_token_expires_in
			}
		});

		if (session) {
			await prisma.session.update({
				where: {
					id: session.sessionId
				},
				data: {
					access_token,
					refresh_token
				}
			});
		}

		const new_session =
			session ??
			(await auth.createSession({
				userId: user.id,
				sessionId: uuid(),
				attributes: {
					access_token: discordTokens.accessToken,
					refresh_token: discordTokens.refreshToken,
					auth_request_id: auth_request.id,
					access_token_expires_in: discordTokens.accessTokenExpiresIn,
					application_id: application.id,
					provider_id: discordUser.id
				}
			}));

		return new_session;
	} catch (e) {
		if (e instanceof OAuthRequestError) {
			console.log(e);
			// invalid code
			throw error(400, e);
		} else if (e instanceof Error) {
			throw error(500, e);
		}
	}
};
