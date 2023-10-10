import type { LayoutApplication } from 'src/lib/components/data_contexts.js';
import { prisma } from 'src/lib/server/prisma';

export const load = async ({parent, params}) => {
    const application = await prisma.application.findFirstOrThrow({
        where: {
            id: params.app_id
        },
        include: {
            redirect_urls: true,
            authentication_rule: true,
            auth_request: {
                take: 10,
            },
            app_role: {
                include: {
                    app_role_assignment: true,
                    assigned_permissions: true,
                }
            },
            branding: true,
            permissions: true,
        }
    }) satisfies LayoutApplication;

    application.access_token_secret = '****************************************';
    application.refresh_token_secret = '****************************************';

    return {
        application,
        ...await parent()
    }
};