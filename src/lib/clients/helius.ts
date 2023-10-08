import type {paths} from "src/types/helius"
import createClient from 'openapi-fetch';
import { HELIUS_API_KEY } from "$env/static/private";
import { Helius } from "helius-sdk";

// const helius = createClient<paths>({
// 	headers: {
// 		'api-key': `${HELIUS_API_KEY}`
// 	}
// });

const helius = new Helius(HELIUS_API_KEY)

export default helius