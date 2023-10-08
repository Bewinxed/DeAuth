import type { Prisma } from '@prisma/client';
import { error, json } from '@sveltejs/kit';
import { is_authorized } from 'src/lib/security/is_authorized.js';
import { prisma } from 'src/lib/server/prisma.js';

export const GET = async ({ locals, params }) => {
	const session = await locals.auth.validate();
	if (!session) {
		throw error(401, 'Unauthorized');
	}
    
    await is_authorized(session, params.org_id, params.app_id )

    const redirect_urls = await prisma.redirect_url.findMany({
        where: {
            application_id: params.app_id,
        }
    });

    return json(redirect_urls)

};

export const PUT = async ({ locals, params, request }) => {
	const session = await locals.auth.validate();
	if (!session) {
		throw error(401, 'Unauthorized');
	}

    await is_authorized(session, params.org_id, params.app_id )

    const payload = await request.json() as Prisma.redirect_urlCreateWithoutApplicationInput

    const redirect_url = await prisma.redirect_url.create({
        data: {
            url: payload.url,
            application_id: params.app_id,
            modified_by_user_id: session.user.userId,
        }
    });
    return json(redirect_url)
};

export const DELETE = async ({ locals, params, request, url }) => {
    const session = await locals.auth.validate();
    if (!session) {
        throw error(401, 'Unauthorized');
    }

    await is_authorized(session, params.org_id, params.app_id )

    const id = url.searchParams.get('id');

    if (!id) {
        throw error(400, 'Missing id');
    }

    const redirect_url = await prisma.redirect_url.delete({
        where: {
            id: 
            parseInt(id)
        }
    });
    return json({id: redirect_url.id})
}

export const PATCH = async ({ locals, params, request, url }) => {
    const session = await locals.auth.validate();
    
    if (!session) {
        throw error(401, 'Unauthorized');
    }
    
    await is_authorized(session, params.org_id, params.app_id )
    
    const id = url.searchParams.get('id');

    if (!id) {
        throw error(400, 'Missing id');
    }
    const payload = await request.json() as Prisma.redirect_urlGetPayload<{
        select: {
            id: true,
            url: true,
        }
    }>

    const redirect_url = await prisma.redirect_url.update({
        where: {
            id: parseInt(id)
        },
        data: {
            url: payload.url,
            modified_by_user_id: session.user.userId,
        }
    });
    return json({id: redirect_url.id})
}




