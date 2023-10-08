import { error, json } from '@sveltejs/kit';
import { prisma } from 'src/lib/server/prisma.js';

export const GET = async ({params, locals}) => {
    const { user_id, role_id } = params;
    const session = await locals.auth.validate();
    if (!session) {
        throw error(401, 'Unauthorized');
    }

    const app_role_assignment = await prisma.app_role_assignment.findFirst({
        where: {
            user_id,
            app_role_id: parseInt(role_id)
        }
    })

    
    return json(app_role_assignment);
}