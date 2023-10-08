import { error } from '@sveltejs/kit';
import { prisma } from 'src/lib/server/prisma.js';

export const load = async ({locals, depends}) => {
    const session = await locals.auth.validate();
    if (!session) {
        throw error(401, 'Unauthorized');
    }

    const organizations = await prisma.organization.findMany({
        where: {
            OR: [
                {
                    members: {
                        some: {
                            user_id: session.user.userId
                        }}
                },
                {
                    owner_id: session.user.userId
                }
            ]
        },
        include: {
            applications: true,
        }
    });

    depends('user:orgs');

    return {
        organizations
    }
    
};