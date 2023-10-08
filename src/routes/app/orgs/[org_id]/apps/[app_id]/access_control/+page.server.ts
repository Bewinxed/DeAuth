import { prisma } from 'src/lib/server/prisma.js';

export const load = async ({params, parent, depends}) => {
    const access_controls = await prisma.user_access_control.findMany({
        where: {
            application_id: params.app_id,
        },
        take: 30
    });

    depends('app:access_controls');

    return {
        access_controls,
        ...await parent()
    }
    
};