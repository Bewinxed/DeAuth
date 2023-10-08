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

    const user_access_controls = await prisma.user_access_control.findMany({
        where: {
            application_id: params.app_id,
        }
    });

    return json(user_access_controls)

};

export const PUT = async ({ locals, params, request }) => {
	const session = await locals.auth.validate();
	if (!session) {
		throw error(401, 'Unauthorized');
	}

    await is_authorized(session, params.org_id, params.app_id )

    const payload = await request.json() as Prisma.user_access_controlCreateWithoutApplicationInput

    const user_access_control = await prisma.user_access_control.create({
        data: {
            ...payload,
            application_id: params.app_id,
        }
    });
    return json(user_access_control)
};

export const DELETE = async ({ locals, params, url }) => {
    const session = await locals.auth.validate();
    if (!session) {
        throw error(401, 'Unauthorized');
    }

    await is_authorized(session, params.org_id, params.app_id )

    const id = url.searchParams.get('id');

    if (!id) {
        throw error(400, 'Missing id');
    }

    const user_access_control = await prisma.user_access_control.delete({
        where: {
            id: 
            parseInt(id)
        }
    });
    return json({id: user_access_control.id})
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
    const payload = await request.json() as Prisma.user_access_controlGetPayload<
        object
    >

    const user_access_control = await prisma.user_access_control.update({
        where: {
            id: parseInt(id)
        },
        data: {
            ...payload,
            modified_by_user_id: session.user.userId,
        }
    });
    return json(user_access_control)
}




