import { prisma } from 'src/lib/server/prisma.js';

export const load = async ({  params, parent }) => {
	const {  app_id } = params;

	const sessions = await prisma.session.findMany({
		where: {
			application_id: app_id
		},
		include: {
			user: true,
		},
		take: 10,
	});

    return {
        sessions,
        ...await parent(),
		promises: {
			page_2: prisma.session.findMany({
				where: {
					application_id: app_id,
				},
				take: 10,
				skip: 10,
			}),
		}
    }
};
