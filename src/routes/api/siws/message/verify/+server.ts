import type { Prisma } from '@prisma/client';
import type { SolanaSignInInput } from '@solana/wallet-standard-features';
import { error, json, type RequestEvent } from '@sveltejs/kit';

import { auth } from 'src/lib/server/lucia';
import { prisma } from 'src/lib/server/prisma';
import {
	create_session_tokens,
	verifyMessage
} from 'src/lib/utils/sign_in_helpers';
import {
	handle_existing_session,
	handle_no_session
} from 'src/routes/api/auth/callback/[provider]/auth_utils';

type SerializedSolanaSignInOutput = {
	signedMessage: string;
	signature: string;
	account: {
		publicKey: string;
		address: string;
		chains: string[];
		features: string[];
		label?: string;
		icon?: string;
	};
	signatureType: 'ed25519' | 'legacy';
};

export async function POST({
	params,
	locals,
	request,
	url,
	getClientAddress
}: RequestEvent) {
	let session = await locals.auth.validate();

	const application = await prisma.application
		.findFirstOrThrow({
			include: {
				app_role: {
					orderBy: {
						created_at: 'asc'
					}
				},
				authentication_rule: {
					where: {
						provider: 'solana'
					}
				}
			},
			where: {
				id: params.app_id
			}
		})
		.catch(() => {
			throw error(
				404,
				'Application not found, Or Solana OAuth not enabled for this application'
			);
		});

	const state = url.searchParams.get('state');

	if (!state) {
		throw error(400, 'Missing state');
	}

	const payload: {
		input: SolanaSignInInput;
		output: SerializedSolanaSignInOutput;
	} = await request.json();

	const {
		output: {
			signature,
			account: { publicKey: public_key }
		}
	} = payload;

	if (!public_key) {
		throw new Error('Invalid public key');
	}

	const authRequest = await verifyMessage(url, state, payload);

	const { access_token, refresh_token, access_token_expires_in } =
		await create_session_tokens({
			application,
			date: authRequest.created_at,
			proof: signature,
			account_id: public_key
		});

	let user: Prisma.UserGetPayload<{
		include: {
			key: true;
		};
	}> | null = null;

	try {
		if (session) {
			user = await handle_existing_session({
				application,
				auth_request: authRequest,
				session
			});
		} else {
			user = await handle_no_session({
				application,
				auth_request: authRequest
			});
		}
	} catch (e) {
		if (e instanceof Error) {
			console.log(e)
			throw error(500, e.message);
		}
	}

	if (!user) {
		throw error(500, 'User not found nor created');
	}

	await prisma.authRequest.update({
		where: {
			id: authRequest.id
		},
		data: {
			signature,
			access_token,
			user_id: user.id,
			refresh_token,
			provider_access_token: access_token,
			provider_refresh_token: refresh_token,
			access_token_expires_in,
			ip_address: getClientAddress(),
		}
	});

	
	session = await auth.createSession({
		userId: user.id,
		attributes: {
			provider_id: authRequest?.provider_account_id,
			access_token,
			refresh_token,
			access_token_expires_in,
			auth_request_id: authRequest?.id,
			application_id: authRequest?.application_id
		}
	});

	locals.auth.setSession(session);

	return json(session);
}
