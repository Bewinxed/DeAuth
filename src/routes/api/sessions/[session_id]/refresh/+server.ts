import { dev } from "$app/environment";
import { error, json, type RequestHandler } from "@sveltejs/kit";
import { prisma } from "src/lib/server/prisma";

export const GET: RequestHandler = async ({request, url, params, cookies}) => {
    // get authorization headers
    const refresh_token = url.searchParams.get("refresh_token");
    if (!refresh_token) {
        throw error(401, 'Unauthorized');
    }
    const {session_id} = params

    
    // const application = await prisma.application.findFirstOrThrow({
    //     where: {
    //         id: app_id,
    //     },
    //     include: {
    //         redirect_urls: true
    //     }
    // }).catch(() => {
    //     throw error(404, "Application not found")
    // })

    const session = await prisma.session.findFirstOrThrow({
        where: {
            id: session_id,
        }
    }).catch(() => {
        throw error(404, "Session not found")
    })

    if (session.refresh_token !== refresh_token) {
        throw error(401, "Invalid refresh_token")
    }

    const app_id = session.application_id
    
    // extend session
    const new_session = await prisma.session.update({
        where: {
            id: session_id,
            refresh_token
        },
        data: {
            // as number
            access_token_expires_in: Date.now() + 1000 * 60 * 60 * 24,
        }
    })

    return json({
        access_token_expires_in: new_session.access_token_expires_in,
    })
}