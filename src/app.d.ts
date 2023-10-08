// src/app.d.ts
declare global {
	namespace App {
		interface Locals {
			auth: import('lucia').AuthRequest;
		}
	}
}

/// <reference types="lucia" />
declare global {
	namespace Lucia {
		type Auth = import('$lib/server/lucia').Auth;
		type DatabaseUserAttributes = {
			avatar_url: string | null;
			public_keys?: string[];
			impersonated_by_id?: string;
		};
		type DatabaseSessionAttributes = {
			provider_id: string;
			access_token: string;
			auth_request_id: number;
			application_id: string;
			refresh_token: string;
			access_token_expires_in: number;
			impersonating_user_id?: session.user.userId;
		};
	}
}

// THIS IS IMPORTANT!!!
export {};
