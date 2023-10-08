import { error, json } from '@sveltejs/kit';
import { prisma } from 'src/lib/server/prisma.js';

export const GET = async ({url}) => {
    const id = url.searchParams.get('id') as string | undefined
    const state = url.searchParams.get('state') as string | undefined
    // if both are undefined, throw error
    if (!id && !state) {
        throw error(400, 'Missing query params');
    }

    const auth_request = await prisma.authRequest.findFirstOrThrow({
        where: id ? {
            id: parseInt(id)
        } : {
            state: state
        },
        
    }).catch(() => {
        throw error(404, 'Auth request not found');
    })

    return json(auth_request);
};