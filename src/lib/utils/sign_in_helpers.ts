import type { Prisma } from '@prisma/client';
import type {
	SolanaSignInInput,
	SolanaSignInOutput
} from '@solana/wallet-standard-features';
import {
	createSignInMessageText, verifySignIn,
	type SolanaSignInInputWithRequiredFields
} from '@solana/wallet-standard-util';
import { error } from '@sveltejs/kit';
import base58 from 'bs58';
import { SignJWT } from 'jose';
import nacl from 'tweetnacl';
import { prisma } from '../server/prisma';

export const createSignInData = async (
	data: SolanaSignInInputWithRequiredFields
): Promise<SolanaSignInInputWithRequiredFields> => {
	const currentDateTime = data.issuedAt ?? new Date().toISOString();
	const randomNonce = data.nonce ?? Math.random().toString(36).substring(2, 10);
	const signInData: SolanaSignInInputWithRequiredFields = {
		//   domain,
		statement:
			'Clicking Sign or Approve only means you have proved this wallet is owned by you. This request will not trigger any blockchain transaction or cost any gas fee.',
		version: '1',
		nonce: randomNonce,
		chainId: 'mainnet',
		issuedAt: currentDateTime,
		// resources: data.resources?.join('\n-'),
		...data
	};

	return signInData;
};

export const createLegacySignInData = async (
	data: SolanaSignInInputWithRequiredFields
): Promise<string> => {
	const message = await createSignInData(data);
	return createSignInMessageText(message);
};

export async function verifySIWS(
	input: SolanaSignInInput,
	output: SolanaSignInOutput
) {
	const serialisedOutput: SolanaSignInOutput = {
		account: {
			...output.account,
			publicKey: new Uint8Array(output.account.publicKey)
		},
		signature: new Uint8Array(output.signature),
		signedMessage: new Uint8Array(output.signedMessage)
	};
	return verifySignIn(input, serialisedOutput);
}

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

export const verifyMessage = async (
	url: URL,
	state: string,
	payload: { input: SolanaSignInInput; output: SerializedSolanaSignInOutput }
): Promise<Prisma.AuthRequestGetPayload<object>> => {
	let verified = false;
	const {
		output: {
			
			signature,
			account: { publicKey: public_key }
		},
		input: { nonce }
	} = payload;

	const authRequest = await prisma.authRequest
		.findFirstOrThrow({
			where: {
				state,
				nonce,
				provider_account_id: public_key
			}
		})
		.catch(() => {
			throw error(404, 'Auth request not found');
		});
	if (payload.output.signatureType === 'legacy') {
		const solanaSignInData = await createSignInData({
			// get url without any query params or public key
			address: authRequest.provider_account_id,
			uri: authRequest.uri,
			domain: url.host,
			nonce: nonce,
			issuedAt: authRequest.created_at.toISOString()
		});

		const message = await createLegacySignInData(solanaSignInData);

		verified = nacl.sign.detached.verify(
			new TextEncoder().encode(message),
			base58.decode(signature),
			base58.decode(public_key)
		);
	}

	if (payload.output.signatureType === 'ed25519') {
		verified = await verifySIWS(payload.input, {
			...payload.output,
			// @ts-expect-error ignore account array type
			account: {
				...payload.output.account,
				publicKey: base58.decode(payload.output.account.publicKey),
				chains: payload.output.account.chains.map((chain) => {
					const [namespace, reference] = chain.split(':');
					return `${namespace}:${reference}` as `${string}:${string}`
				})
			},
			signature: base58.decode(payload.output.signature),
			signedMessage: base58.decode(payload.output.signedMessage)
		});
	}

	if (!verified) {
		throw error(401, 'Invalid signature');
	}

	return authRequest;
};

export async function create_session_tokens(args: {
	application: Prisma.applicationGetPayload<object>;
	account_id: string;
	proof: string;
	date: Date;
}) {
	const { application, account_id, proof, date } = args;

	const jwt = new SignJWT({
		account_id,
		date,
		proof
	})
		.setProtectedHeader({ alg: 'HS256' })
		.setIssuedAt();

	const access_token = await jwt
		.setExpirationTime(`${application.access_token_expiry}s`)
		.sign(Buffer.from(application.access_token_secret, 'base64'));

	const refresh_token = await jwt
		.setExpirationTime(`${application.refresh_token_expiry}s`)
		.sign(Buffer.from(application.refresh_token_secret, 'base64'));

	return {
		access_token,
		 refresh_token,
		access_token_expires_in: application.access_token_expiry,
	};
}