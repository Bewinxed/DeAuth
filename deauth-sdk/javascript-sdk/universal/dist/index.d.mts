interface User {
    id: string;
    username?: string | null;
    avatar_url?: string | null;
    created_at: Date;
    roles: string[];
    permissions: string[];
}
interface Session {
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
declare class DeAuth {
    private APP_ID;
    private REDIRECT_URI;
    private ACCESS_SECRET;
    private REFRESH_SECRET;
    constructor(appId: string, redirectUri: string, accessSecret: string, refreshSecret: string);
    private getOAuthURL;
    redirectToOAuth({ fetchInstance }: {
        fetchInstance?: typeof fetch;
    }): Promise<void>;
    getSessionUser({ session_id, access_token, fetchInstance }: {
        session_id: string;
        access_token: string;
        fetchInstance?: typeof fetch;
    }): Promise<User | null>;
    private getSession;
    private exchangeProofForSession;
    private refreshSession;
    validateSession({ session_id, fetchInstance }: {
        session_id: string;
        fetchInstance?: typeof fetch;
    }): Promise<Session | null>;
    handleRedirect({ session_id, proof, fetchInstance }: {
        session_id?: string;
        proof?: string;
        fetchInstance?: typeof fetch;
    }): Promise<Session | null>;
}

export { DeAuth, Session, User };
