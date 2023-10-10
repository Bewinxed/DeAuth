import { prisma } from 'src/lib/server/prisma.js';

export const load = async ({params, parent, depends}) => {
    const access_controls = await prisma.user_access_control.findMany({
        where: {
            application_id: params.app_id,
        },
        take: 30
    });

    const resources = await prisma.appResources.findMany({
        where: {
            application_id: params.app_id,
            
        },
        include: {
            permissions: true,
            
        }
    });

    depends('app:access_controls');

    return {
        resources,
                access_controls,
        ...await parent()
    }
    
};