import { dev } from "$app/environment";
import { error, type RequestHandler } from "@sveltejs/kit";
import { prisma } from "src/lib/server/prisma";

export const GET: RequestHandler = async ({request, url, cookies}) => {
    // get authorization headers
    const access_token = url.searchParams.get("access_token");
    if (!access_token) {
        throw error(401, 'Unauthorized');
    }
    const refresh_token = url.searchParams.get("refresh_token");
    if (!refresh_token) {
        throw error(401, 'Unauthorized');
    }
    const app_id = url.searchParams.get("app_id")
    if (!app_id) {
        throw error(400, "Missing app_id");
    }
    const redirect_uri = url.searchParams.get("redirect_uri")
    if (!redirect_uri) {
        throw error(400, "Missing redirect_uri");
    }

    const application = await prisma.application.findFirstOrThrow({
        where: {
            id: app_id,
        },
        include: {
            redirect_urls: true
        }
    }).catch(() => {
        throw error(404, "Application not found")
    })

    if (application.redirect_urls.find((url) => url.url === redirect_uri) === undefined) {
        throw error(400, "Invalid redirect_uri")
    }

    if (application.access_token_secret !== access_token) {
        throw error(401, "Invalid access_token")
    }

    if (application.refresh_token_secret !== refresh_token) {
        throw error(401, "Invalid refresh_token")
    }

    const state = url.searchParams.get("state")
    if (!state) {
        throw error(400, "Missing state")
    }

    const new_url = new URL( dev ? "http://127.0.0.1:5173/auth" : "https://www.deauth.xyz/auth")
    new_url.searchParams.set("state", state)
    new_url.searchParams.set("app_id", app_id)
    new_url.searchParams.set("redirect_uri", redirect_uri)
	// add the redirect_uri to the query params
	// redirect to the authorization url

	// return text url
	return new Response(new_url.toString(), {
        headers: {
            'content-type': 'text/plain'
        }
    });
};
