import { error } from '@sveltejs/kit';
import { prisma } from 'src/lib/server/prisma.js';

export const actions = {
    default: async ({request, locals}) => {
        const session = await locals.auth.validate();
        if (!session) {
            throw error(401, 'Unauthorized');
        }
        const form = await request.formData();
        const organization = await prisma.organization.create({
            data: {
                name: form.get('name') as string,
                owner_id: session.user.userId,
                members: {
                    create: {
                        user_id: session.user.userId,
                        role: 'OWNER'
                        
                    }
                }
            }
        })
        return {
            organization
        }
    }
    
};