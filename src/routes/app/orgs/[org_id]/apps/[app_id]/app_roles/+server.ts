import type { Prisma } from '@prisma/client';
import { error, json } from '@sveltejs/kit';
import { prisma } from 'src/lib/server/prisma.js';

export const GET = async ({ locals, params }) => {
	const session = await locals.auth.validate();
	if (!session) {
		throw error(401, 'Unauthorized');
	}

    const app_roles = await prisma.app_role.findMany({
        where: {
            application_id: params.app_id,
        }
    });

    return json(app_roles)

};

export const PUT = async ({ locals, params, request }) => {
	const session = await locals.auth.validate();
	if (!session) {
		throw error(401, 'Unauthorized');
	}
    const payload = await request.json() as Prisma.app_roleCreateWithoutApplicationInput;

    const app_role = await prisma.app_role.create({
        data: {
            
            application_id: params.app_id,
            name: payload.name,

        }
    });
    return json(app_role)
};

export const DELETE = async ({ locals, params, request, url }) => {
    const session = await locals.auth.validate();
    if (!session) {
        throw error(401, 'Unauthorized');
    }
    const id = url.searchParams.get('id');

    if (!id) {
        throw error(400, 'Missing id');
    }

    const app_role = await prisma.app_role.delete({
        where: {
            id: parseInt(id)
        }
    });
    return json({id: app_role.id})
}

export const PATCH = async ({ locals, params, request, url }) => {
    const session = await locals.auth.validate();
    if (!session) {
        throw error(401, 'Unauthorized');
    }
    const id = url.searchParams.get('id');

    if (!id) {
        throw error(400, 'Missing id');
    }
    const payload = await request.json() as Prisma.app_roleGetPayload<{
        select: {
            id: true,
            name: true,
        }
    }>

    const app_role = await prisma.app_role.update({
        where: {
            id: parseInt(id)
        },
        data: {
            ...payload,
            modified_by_user_id: session.user.userId,
        }
    });
    return json({id: app_role.id})
}




