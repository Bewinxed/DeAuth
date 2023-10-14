// get a session using its id
// Compare this snippet from src/routes/api/auth/session/%5Bsession_id%5D/%2Bserver.ts:
import { error, json } from '@sveltejs/kit';
import { is_authorized } from 'src/lib/security/is_authorized.js';
import { prisma } from 'src/lib/server/prisma.js';

export const GET = async ({ params }) => {

	const { session_id } = params;

	const session = await prisma.session.findFirstOrThrow({
		where: {
			id: session_id
		}
	}).catch(() => {
        throw error(404, 'Session not found');
    });
    
	return new Response(JSON.stringify({
        ...session,
        access_token_expires_in: session.access_token_expires_in.toString(),
        active_expires: session.active_expires.toString(),
        idle_expires: session.idle_expires.toString(),
    }))
};


export const DELETE = async ({ locals, params}) => {
    const session = await locals.auth.validate();
    if (!session) {
        throw error(401, 'Unauthorized');
    }
    const { session_id } = params;
    
    // get the session first
    const session_data = await prisma.session.findFirstOrThrow({
        where: {
            id: session_id
        }
    })

    await is_authorized(session, null, session_data.application_id)

    await prisma.session.delete({
        where: {
            id: session_id
        }
    })

    // serialize bigint
    return json({
        id: session_data.id,
    })
};