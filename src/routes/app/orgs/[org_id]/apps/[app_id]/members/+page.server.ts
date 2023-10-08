import { prisma } from 'src/lib/server/prisma.js';

export const load = async ({  params, parent, depends }) => {
	const {  app_id } = params;

	const users = await prisma.member.findMany({
		where: {
			application_id: app_id
		},
		include: {
			user: true,
            
		},
		take: 10,
	});

    depends('app:users')

    return {
        users,
        ...await parent(),
		promises: {
			page_2: prisma.member.findMany({
				where: {
					application_id: app_id,
                    
				},
                include: {
                    user: true,
                    
                },
				take: 10,
				skip: 10,
			}),
		}
    }
};
