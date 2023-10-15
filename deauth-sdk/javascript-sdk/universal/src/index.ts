const dev = false;

export interface User {
	id: string;
	username?: string | null;
	avatar_url?: string | null;
	created_at: Date;
	roles: string[];
	permissions: string[];
}

export interface Session {
	id: string;
	created_at: Date;
	active_expires: bigint;
	idle_expires: bigint;
	auth_request_id: null | number;
	application_id: string;
	user_id: string;
	provider_account_id: string;
	access_token: string;
	refresh_token: string;
	access_token_expires_in: number;
	impersonating_user_id: null | string;
}

export class DeAuth {
	private APP_ID: string;
	private REDIRECT_URI: string;
	private ACCESS_SECRET: string;
	private REFRESH_SECRET: string;

	constructor(appId: string, redirectUri: string, accessSecret: string, refreshSecret: string) {
		this.APP_ID = appId;
		this.REDIRECT_URI = redirectUri;
		this.ACCESS_SECRET = accessSecret;
		this.REFRESH_SECRET = refreshSecret;
	}

	private async getOAuthURL(fetchInstance?: typeof fetch): Promise<string> {
		const baseURL = dev
			? 'http://127.0.0.1:5173/api/login/url'
			: 'https://www.deauth.xyz/api/login/url';
		const params = new URLSearchParams({
			app_id: this.APP_ID,
			redirect_uri: this.REDIRECT_URI,
			access_token: this.ACCESS_SECRET,
			refresh_token: this.REFRESH_SECRET,
			state: crypto.getRandomValues(new Uint32Array(1))[0].toString()
		});
		const redirect_uri = await (fetchInstance || fetch)(`${baseURL}?${params}`, {
			// cors headers
			mode: 'cors'
		})
			.then(async (res) => {
				if (res.ok) {
					return await res.text();
				} else {
					console.error(res.status, res.statusText);
					throw new Error('Error getting OAuth URL.');
				}
			})
			.catch((err) => {
				throw err;
			});
		console.debug(redirect_uri);
		return redirect_uri;
	}

	public async redirectToOAuth({ fetchInstance }: { fetchInstance?: typeof fetch }): Promise<void> {
		if (window && typeof window !== 'undefined') {
			window.location.href = await this.getOAuthURL(fetchInstance);
		} else {
			throw new Error('Cannot redirect in a non-browser environment.');
		}
	}

	public async getSessionUser({
		session_id,
		access_token,
		fetchInstance
	}: {
		session_id: string;
		access_token: string;
		fetchInstance?: typeof fetch;
	}): Promise<User | null> {
		const baseURL = dev
			? `http://127.0.0.1:5173/api/sessions/${session_id}/member`
			: `https://www.deauth.xyz/api/sessions/${session_id}/member`;
		const params = new URLSearchParams();
		if (!(session_id)) {
			throw new Error('No user ID or session ID provided.');
		}
		if (!access_token) {
			throw new Error('No access token provided.');
		}
		params.append('access_token', access_token);
		return (fetchInstance || fetch)(`${baseURL}?${params}`, {
			// cors headers
			mode: 'cors'
		})
			.then(async (res) => {
				if (res.ok) {
					return (await res.json()) as User;
				} else if ([401, 403, 404].includes(res.status)) {
					return null;
				} else {
					console.error(res.status, res.statusText);
					throw new Error('Error getting user.');
				}
			})
			.catch((err) => {
				throw err;
			});
	}

	private async getSession({
		session_id,
		fetchInstance
	}: {
		session_id?: string;
		fetchInstance?: typeof fetch;
	}): Promise<Session | null> {
		const baseURL = dev
			? `http://127.0.0.1:5173/api/sessions/${session_id}`
			: `https://www.deauth.xyz/api/sessions/${session_id}`;

		return (fetchInstance || fetch)(baseURL, {
			// cors headers
			mode: 'cors'
		})
			.then(async (res) => {
				if (res.ok) {
					return (await res.json()) as Session;
				} else if ([401, 403, 404].includes(res.status)) {
					return null;
				} else {
					console.error(res.status, res.statusText);
					throw new Error('Error getting session.');
				}
			})
			.catch((err) => {
				throw err;
			});
	}

	private async exchangeProofForSession({
		session_id,
		proof,
		fetchInstance
	}: {
		session_id?: string;
		proof?: string;
		fetchInstance?: typeof fetch;
	}): Promise<Session | null> {
		const baseURL = dev
			? 'http://127.0.0.1:5173/api/auth/session'
			: 'https://www.deauth.xyz/api/auth/session';
		if (!session_id && !proof) {
			throw new Error('No session ID or proof provided.');
		}
		const params = new URLSearchParams();
		if (session_id) {
			params.append('session_id', session_id);
		}
		if (proof) {
			params.append('proof', proof);
		}
		return (fetchInstance || fetch)(`${baseURL}?${params}`, {
			// cors headers
			mode: 'cors'
		})
			.then(async (res) => {
				if (res.ok) {
					const response = (await res.json()) as Session[];
					if (response.length === 0) {
						return null;
					}
					return response[0] as Session;
				} else {
					console.error(res.status, res.statusText);
					throw new Error('Error getting session.');
				}
			})
			.catch((err) => {
				throw err;
			});
	}

	private async refreshSession({
		session_id,
		fetchInstance
	}: {
		session_id: string;
		fetchInstance?: typeof fetch;
	}): Promise<number | null> {
		const baseURL = dev
			? `http://127.0.0.1/api/auth/session/${session_id}/refresh`
			: `https://www.deauth.xyz/api/auth/session/${session_id}/refresh`;
		return (fetchInstance || fetch)(baseURL, {
			// cors headers
			mode: 'cors'
		})
			.then(async (res) => {
				if (res.ok) {
					return (await res.json()).access_token_expires_in as number;
				} else if ([401, 403, 404].includes(res.status)) {
					return null;
				} else {
					console.error(res.status, res.statusText);
					throw new Error('Error refreshing session.');
				}
			})
			.catch((err) => {
				throw err;
			});
	}

	public async validateSession({
		session_id,
		fetchInstance
	}: {
		session_id: string;
		fetchInstance?: typeof fetch;
	}): Promise<Session | null> {
		const session = await this.getSession({
			session_id
		});
		if (!session) {
			return null;
		}
		let active_period_expires_at = new Date(Number(session.active_expires));
		let idle_period_expires_at = new Date(Number(session.idle_expires));

		if (Date.now() > idle_period_expires_at.getTime()) {
			console.error('Session expired.');
			return null;
		}

		if (Date.now() > active_period_expires_at.getTime()) {
			await this.refreshSession({
				fetchInstance,
				session_id
			}).then((expires_in) => {
				if (!expires_in) {
					return null;
				}
				if (expires_in) {
					active_period_expires_at = new Date(Date.now() + 24 * 60 * 60 * 1000);
					idle_period_expires_at = new Date(Date.now() + 24 * 60 * 60 * 1000 * 7);
				}
			});
		}

		return {
			...session,
			access_token_expires_in: active_period_expires_at.getTime()
		};
	}

	public async handleRedirect({
		session_id,
		proof,
		fetchInstance
	}: {
		session_id?: string;
		proof?: string;
		fetchInstance?: typeof fetch;
	}): Promise<Session | null> {
		if (!(session_id || proof)) {
			throw new Error('No session ID found in the redirect URL.');
		}

		return await this.exchangeProofForSession({
			session_id,
			proof,
			fetchInstance
		})
			.then(async (session) => {
				if (!session) {
					throw new Error('Session validation failed.');
				}
				return session;
			})
			.catch((err) => {
				throw err;
			});
	}
}