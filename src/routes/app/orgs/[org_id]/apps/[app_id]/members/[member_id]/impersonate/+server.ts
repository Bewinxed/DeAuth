import { error, redirect } from '@sveltejs/kit';
import { is_authorized } from 'src/lib/security/is_authorized.js';
import { prisma } from 'src/lib/server/prisma.js';
import crypto from 'crypto';
import { v4 as uuid } from 'uuid';
import { create_session_tokens } from 'src/lib/utils/sign_in_helpers.js';
import { auth } from 'src/lib/server/lucia';
import { dev } from '$app/environment';

export const GET= async ({locals, params, cookies}) => {
    const session = await locals.auth.validate();
    if (!session) {
        throw error(401, 'Unauthorized');
    }

    const user = await prisma.user.findFirstOrThrow({
        where: {
            memberships: {
                some: {
                    id: (params.member_id)
                }
            }
        },
        include: {
            key: true
        }
    })


    await is_authorized(session, params.org_id, params.app_id);

    const redirect_url = await prisma.redirect_url.findFirstOrThrow({
        where: {
            application_id: params.app_id
        }
    })

    const application = await prisma.application.findFirstOrThrow({
        where: {
            id: params.app_id
        }
    })

    if (!user.key || !user.key[0].account_id || !user.key[0].provider) {
        throw error(400, 'User has no accounts registered');
    }

    const state = crypto.randomBytes(32).toString('hex')

    const { access_token, refresh_token, access_token_expires_in } =
		await create_session_tokens({
			application,
			date: new Date(),
			proof: "impersonated",
			account_id: user.key[0].account_id,
		});

    const auth_request = await prisma.authRequest.create({
		data: {
			uuid: uuid(),
			state: state,
			nonce: crypto.randomBytes(32).toString('hex'),
			application_id: params.app_id,
			uri: new URL(redirect_url.url).toString(),
			provider_account_id: user.key[0].account_id,
			provider: user.key[0].provider,
            user_id: user.id,
            signature: "impersonated",
            access_token,
            refresh_token,
            provider_access_token: access_token,
            
		}
	});

    cookies.set('solana_oauth_state', state, {
		httpOnly: true,
		secure: !dev,
		path: '/',
		maxAge: 60 * 60
	});

    

    const impersonation_session = await auth.createSession({
        userId: user.id,
        attributes: {
            access_token,
            refresh_token,
            access_token_expires_in,
            application_id: params.app_id,
            auth_request_id: auth_request.id,
            provider_id: auth_request.provider_account_id,
            impersonating_user_id: session.user.userId
        }
    })

    const cookie = await auth.createSessionCookie(impersonation_session)

    cookies.set('session', cookie.serialize(), {
        path: redirect_url.url,
        httpOnly: true,
        secure: !dev,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30 // 30 days
    });
    

    return new Response(null, {
        status: 302,
        headers: {
            Location:
                `${auth_request.uri}?${new URLSearchParams({
                    app_id: auth_request.application_id,
                    state: auth_request.state,
                    session_id: impersonation_session.sessionId,
                    impersonated: 'true'
                }).toString()}` ?? '/'
        }
    })
};