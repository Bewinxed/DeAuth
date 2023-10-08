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
            app_role: true,
            branding: true,
        }
    });

    application.access_token_secret = '****************************************';
    application.refresh_token_secret = '****************************************';

    return {
        application,
        ...await parent()
    }
};