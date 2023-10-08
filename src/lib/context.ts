import { Svetch } from 'src/lib/api/client';
import { getContext, setContext } from 'svelte';

export const set_svetch = () => setContext('svetch', new Svetch());

export const get_svetch = () => {
	const svetch = getContext('svetch') as Svetch;
	if (!svetch) {
		throw new Error('svetch not set');
	}
	return svetch;
};

export const set_siws = (fn: Promise<Function>) => setContext('siws', fn);

export const get_siws = () => {
	const siws = getContext('siws') as Promise<Function>;
	if (!siws) {
		throw new Error('siws not set');
	}
	return siws;
};


