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

    const authentication_rules = await prisma.authentication_rule.findMany({
        where: {
            application_id: params.app_id,
        }
    });

    return json(authentication_rules)

};

export const PUT = async ({ locals, params, request }) => {
	const session = await locals.auth.validate();
	if (!session) {
		throw error(401, 'Unauthorized');
	}
    
    await is_authorized(session, params.org_id, params.app_id )
    
    const payload = await request.json() as Prisma.authentication_ruleCreateWithoutApplicationInput

    

    const authentication_rule = await prisma.authentication_rule.create({
        data: {
            ...payload,
            application_id: params.app_id,
        }
    });
    return json(authentication_rule)
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

    const authentication_rule = await prisma.authentication_rule.delete({
        where: {
            id: 
            parseInt(id)
        }
    });
    return json({id: authentication_rule.id})
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
    const payload = await request.json() as Partial<Prisma.authentication_ruleGetPayload<
        object
    >>

    const authentication_rule = await prisma.authentication_rule.update({
        where: {
            id: parseInt(id)
        },
        data: {
            ...payload,
            modified_by_user_id: session.user.userId,
        }
    });
    return json(authentication_rule)
}




