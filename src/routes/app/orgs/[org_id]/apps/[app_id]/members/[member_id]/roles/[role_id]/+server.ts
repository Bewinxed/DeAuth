import { error, json } from '@sveltejs/kit';
import { is_authorized } from 'src/lib/security/is_authorized.js';
import { prisma } from 'src/lib/server/prisma.js';

export const GET = async ({params, locals}) => {
    const { member_id, role_id, app_id } = params;
    const session = await locals.auth.validate();
    if (!session) {
        throw error(401, 'Unauthorized');
    }

    const app_role_assignment = await prisma.app_role.findFirstOrThrow({
        where: {
            application_id: app_id,
            id: parseInt(role_id),
        },
        include: {
            app_role_assignment: {
                where: {
                    member_id: (member_id)
                },
                
            }
        }
    }).catch(() => {
        throw error(404, 'User not found');
    })
    
    return json(app_role_assignment);
};

export const PUT = async ({params, locals}) => {
    const { member_id, role_id, app_id } = params;
    const session = await locals.auth.validate();
    if (!session) {
        throw error(401, 'Unauthorized');
    }

    await is_authorized(session, null, app_id)

    const app_role_assignment = await prisma.app_role_assignment.create({
        data: {
            app_role_id: parseInt(role_id),
            member_id: (member_id),
        }
    }).catch((e) => {
        // catch duplicates
        if (e.code === 'P2002') {
            throw error(409, 'Role already assigned');
        }
        // catch not found
        if (e.code === 'P2003') {
            throw error(404, 'Role not found');
        }

        throw error(500, e);
    })
    
    return json(app_role_assignment);
}

// delete endpoint
export const DELETE = async ({params, locals}) => {
    const { role_id, app_id } = params;
    const session = await locals.auth.validate();
    if (!session) {
        throw error(401, 'Unauthorized');
    }

    await is_authorized(session, null, app_id)

    const app_role_assignment = await prisma.app_role_assignment.delete({
        where: {
            id: parseInt(role_id)
        }
    }).catch(() => {
        throw error(404, 'User not found');
    })
    
    return json(app_role_assignment);
};