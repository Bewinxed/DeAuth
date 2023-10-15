import { DeAuth, Session, User } from '../src';
import { mocked } from "jest-mock";


// Mock fetch globally
global.fetch = jest.fn();

// Initialize DeAuth instance
const deAuth = new DeAuth(
	'appId',
	'redirectUri',
	'accessSecret',
	'refreshSecret'
);

const fakeUser: User = {
    id: '123',
    username: 'username',
    avatar_url: 'https://avatar.url',
    created_at: new Date(),
    roles: ['role1', 'role2'],
    permissions: ['permission1', 'permission2']
};

const fakeSession: Session = {
    id: '123',
    created_at: new Date(),
    active_expires: BigInt(1),
    idle_expires: BigInt(1),
    auth_request_id: null,
    application_id: 'appId',
    user_id: 'userId',
    provider_account_id: 'providerId',
    access_token: 'accessToken',
    refresh_token: 'refreshToken',
    access_token_expires_in: 3600,
    impersonating_user_id: null
};

describe('DeAuth class', () => {

	beforeEach(() => {
		// Clear all instances and calls to constructor and all methods:
		jest.clearAllMocks();
	});

	// describe('getOAuthURL method', () => {
	// 	it('should return a valid OAuth URL', async () => {
	// 		mocked(fetch).mockResolvedValueOnce(new Response('https://oauth.url'));
	// 		const result = await deAuth.getOAuthURL();
	// 		expect(result).toBe('https://oauth.url');
	// 	});
	// 	// Add more cases like error handling, etc.
	// });

	describe('redirectToOAuth method', () => {
		// TODO: Test browser environment logic
	});

	describe('getSessionUser method', () => {
		it('should return a DeAuthUser object when successful', async () => {
			mocked(fetch).mockResolvedValueOnce(new Response(JSON.stringify(fakeUser)));
			const result = await deAuth.getSessionUser({ session_id: '123', access_token: 'token' });
			expect(result).toEqual(fakeUser);
		});
		// Add more cases
	});

    describe('getSession method', () => {
        it('should return a Session object when successful', async () => {
            mocked(fetch).mockResolvedValueOnce(new Response(JSON.stringify(fakeSession)));
            const result = await deAuth.validateSession({ session_id: '123' });
            expect(result).toEqual(fakeSession);
        });
    
        // Add more cases...
    });
    
    describe('exchangeProofForSession method', () => {
        it('should return a Session object when successful', async () => {
            mocked(fetch).mockResolvedValueOnce(new Response(JSON.stringify([fakeSession])));
            const result = await deAuth.exchangeProofForSession({ session_id: '123', proof: 'proof' });
            expect(result).toEqual(fakeSession);
        });
    
        // Add more cases...
    });
    
    describe('refreshSession method', () => {
        it('should return new expiration time when successful', async () => {
            mocked(fetch).mockResolvedValueOnce(new Response(JSON.stringify({ access_token_expires_in: 7200 })));
            const result = await deAuth.refreshSession({ session_id: '123' });
            expect(result).toBe(7200);
        });
    
        // Add more cases...
    });
    
    describe('validateSession method', () => {
        it('should return validated Session object when successful', async () => {

            mocked(fetch).mockResolvedValueOnce(new Response(JSON.stringify(fakeSession)));
            const result = await deAuth.validateSession({ session_id: '123' });
            expect(result).toEqual({ ...fakeSession, access_token_expires_in: expect.any(Number) });
        });
    
        // Add more cases...
    });
    
    describe('handleRedirect method', () => {
        it('should handle redirect and return Session object', async () => {

            mocked(fetch).mockResolvedValueOnce(new Response(JSON.stringify([fakeSession])));
            const result = await deAuth.handleRedirect({ session_id: '123', proof: 'proof' });
            expect(result).toEqual(fakeSession);
        });
    
        // Add more cases...
    });
    

	// Continue writing tests for other methods...

});
