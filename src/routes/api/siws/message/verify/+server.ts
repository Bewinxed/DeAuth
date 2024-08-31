import type { Prisma } from '@prisma/client';
import type { SolanaSignInInput } from '@solana/wallet-standard-features';

import { type RequestEvent, error, json } from '@sveltejs/kit';
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
	account: {
		address: string;
		chains: string[];
		features: string[];
		icon?: string;
		label?: string;
		publicKey: string;
	};
	signature: string;
	signatureType: 'ed25519' | 'legacy';
	signedMessage: string;
};

export const POST = async ({
	getClientAddress,
	locals,
	params,
	request,
	url
}) => {
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

	const payload = (await request.json()) as {
		input: SolanaSignInInput;
		output: SerializedSolanaSignInOutput;
	};

	const {
		output: {
			account: { publicKey: public_key },
			signature
		}
	} = payload;

	if (!public_key) {
		throw new Error('Invalid public key');
	}

	const authRequest = await verifyMessage(url, state, payload);

	const { access_token, access_token_expires_in, refresh_token } =
		await create_session_tokens({
			account_id: public_key,
			application,
			date: authRequest.created_at,
			proof: signature
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
				provider: 'solana',
				provider_account_id: public_key,
				provider_user: {
					email: payload.output.account.address,
					id: public_key,
					image: payload.output.account.icon ?? '',
					name: payload.output.account.label ?? 'Unnamed'
				},
				session
			});
		} else {
			user = await handle_no_session({
				application,
				provider: 'solana',
				provider_account_id: public_key,
				provider_user: {
					email: payload.output.account.address,
					id: public_key,
					image: payload.output.account.icon ?? '',
					name: payload.output.account.label ?? 'Unnamed'
				}
			});
		}
	} catch (e) {
		if (e instanceof Error) {
			console.log(e);
			throw error(500, e.message);
		}
	}

	if (!user) {
		throw error(500, 'User not found nor created');
	}

	await prisma.authRequest.update({
		data: {
			access_token,
			access_token_expires_in,
			ip_address: getClientAddress(),
			provider_access_token: access_token,
			provider_refresh_token: refresh_token,
			refresh_token,
			signature,
			user_id: user.id
		},
		where: {
			id: authRequest.id
		}
	});

	session = await auth.createSession({
		attributes: {
			access_token,
			access_token_expires_in,
			application_id: authRequest?.application_id,
			auth_request_id: authRequest?.id,
			provider_account_id: public_key,
			refresh_token
		},
		userId: user.id
	});

	locals.auth.setSession(session);

	const results = session;

	return json(results);
};
