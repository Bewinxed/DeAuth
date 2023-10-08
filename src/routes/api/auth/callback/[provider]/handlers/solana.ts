import { auth, solana_oauth } from '$lib/server/lucia.js';
import { OAuthRequestError } from '@lucia-auth/oauth';
import type { Prisma } from '@prisma/client';
import { error } from '@sveltejs/kit';
import type { Session } from 'lucia';
import { prisma } from 'src/lib/server/prisma';
import type { RequestEvent } from '../$types';
import { handle_existing_session, handle_no_session } from '../auth_utils';

export const solana_handler = async ({
	url,
	cookies,
	locals
}: RequestEvent) => {
	let session: Session | null = await locals.auth.validate();
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
		const { solanaUser, solanaTokens } =
			await solana_oauth.validateCallback(signature);

		await prisma.authRequest.updateMany({
			where: {
				state: storedState
			},
			data: {
				
				provider_account_id: solanaTokens.account_id,
				provider_access_token: solanaTokens.access_token,
				provider_refresh_token: solanaTokens.refresh_token,
				access_token_expires_in: solanaTokens.access_token_expires_in
			}
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
				console.log('Get User Error', e);
				if (e instanceof Error) {
					throw error(500, e.message);
				}
			}

			if (!user) {
				throw error(500, 'User not found nor created');
			}

			await prisma.key.update({
				where: {
					id: `${auth_request.provider}:${auth_request.provider_account_id}`
				},
				data: {
					account_id: auth_request.provider_account_id,
					additional_data: solanaUser
				}
			});

			return user;
		};

		const user = await getUser();

		session =
			session ||
			(await auth.createSession({
				userId: user.id,
				sessionId: solanaTokens.access_token,
				attributes: {
					provider_id: solanaTokens.account_id,
					access_token: solanaTokens.access_token,
					refresh_token: solanaTokens.refresh_token,
					access_token_expires_in: solanaTokens.access_token_expires_in,
					auth_request_id: solanaTokens.auth_request_id,
					application_id: solanaTokens.application_id
				}
			}));

		return session;
	} catch (e) {
		if (e instanceof OAuthRequestError) {
			// invalid code
			throw error(400, e.message);
		}
		console.log(e);
		throw error(500, JSON.stringify(e));
	}
};
