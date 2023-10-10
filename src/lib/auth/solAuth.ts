import {
	createOAuth2AuthorizationUrl,
	providerUserAuth
} from '@lucia-auth/oauth';
import { Connection, PublicKey } from '@solana/web3.js';
import type { Auth, User } from 'lucia';

const PROVIDER_ID = 'solana';

type SolAuthConfig = {
	uri: string;
	appId: string;
	redirectUri: string;
	scope?: string[];
	rpc?: string;
	validationUri: string;
	loginExpiresIn: number;
};

export type ValidatedSignatureData = {
	account_id: string;
	timestamp: number;
	access_token: string;
	refresh_token: string;
	auth_request_id: number;
	application_id: string;
	access_token_expires_in: number;
	signature: string;
	user: Omit<User, 'userId'>;
};

export const solanaAuth = (auth: Auth, config: SolAuthConfig) => {
	return new SolanaAuth(auth, config);
};

export class SolanaAuth {
	providerId = PROVIDER_ID;
	protected auth: Auth;
	config;
	constructor(auth: Auth, config: SolAuthConfig) {
		this.auth = auth;
		this.config = config;
	}
	getAuthorizationUrl = async () => {
		const [authorizationUrl, state] = await createOAuth2AuthorizationUrl(
			this.config.uri,
			{
				appId: this.config.appId,
				redirectUri: this.config.redirectUri,
				scope: this.config.scope ?? []
			}
		);
		authorizationUrl.searchParams.append('app_id', this.config.appId);
		return [authorizationUrl, state] as const;
	};
	// createKey: (userId: string) => Promise<Readonly<{
	//     userId: string;
	//     providerId: string;
	//     providerUserId: string;
	//     passwordDefined: boolean;
	// }>>;
	createKey = async (options: {
		userId: string;
		providerId: string;
		providerUserId: string;
		// passwordDefined: boolean;
	}) => {
		console.log(options);
		return {
			userId: options.userId,
			providerId: PROVIDER_ID,
			providerUserId: options.providerUserId,
			passwordDefined: false
		};
	};
	getExistingUser = async (public_key: string) => {
		return await this.auth.getUser(public_key);
	};
	validateCallback = async (signature: string) => {
		// Validate the signature and get the Solana public key.
		const solanaTokens = await this.validateSignature(signature);
		const solanaUser = solanaTokens.user;
		const { account_id } = solanaTokens;
		const user = providerUserAuth(this.auth, PROVIDER_ID, account_id);
		return {
			solanaTokens,
			solanaUser,
			user: solanaTokens.user,
			createKey: this.createKey,
			createUser: user.createUser,
			getExistingUser: user.getExistingUser
		};
	};
	getSolanaUser = async (public_key: PublicKey) => {
		const connection = new Connection(
			this.config.rpc ?? 'https://api.mainnet-beta.solana.com/'
		);
		return await connection
			.getParsedAccountInfo(public_key)
			.then((accountInfo) => accountInfo.value);
	};

	validateSignature = async (signature: string) => {
		const request = await fetch(
			`${this.config.validationUri}?proof=${signature}`,
			{}
		);

		if (!request.ok) {
			throw new Error('Callback failed', { cause: await request.text() });
		}

		const response = (await request.json()) as ValidatedSignatureData;

		return response;
	};
}

// export class SolanaUserAuth {
// 	solanaTokens;
//     solanaUser;

// 	constructor(auth: Auth, public_key: PublicKey, solanaUser, solanaTokens) {
// 		super(auth, PROVIDER_ID, public_key.toBase58());
// 		this.solanaTokens = solanaTokens;
//         this.solanaUser = solanaUser;
// 	}
// }
