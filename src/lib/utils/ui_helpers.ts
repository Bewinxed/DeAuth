import type { CrudOperation, OAuthProvider, TextColor } from "@prisma/client";
import toast from "svelte-french-toast";

export function typewriter(opts: {
	string: string;
	callback: (newString: string) => void;
	speed?: number;
}): Promise<void> {
	const { string, callback, speed } = opts;
	return new Promise((resolve) => {
		let i = 0;
		let newString = '';
		const interval = setInterval(() => {
			if (i < string.length) {
				newString += string[i];
				callback(newString);
				i++;
			} else {
				clearInterval(interval);
				resolve();
			}
		}, speed ?? 5);
	});
}

export function clickToCopy(node: HTMLElement, target: string | null) {
	async function copyText() {
		const element: HTMLElement | HTMLInputElement | null = target
			? document.querySelector(target)
			: node;

		if (!element) {
			console.log('Could not find element to copy with selector: ', target);
			return;
		}

		let text: string | null;

		if (element instanceof HTMLInputElement) {
			text = element.value;
		} else {
			text = element?.innerText;
		}

		if (!text) {
			console.log('Could not find text to copy');
			return;
		}

		try {
			await navigator.clipboard.writeText(text);

			node.dispatchEvent(
				new CustomEvent('blur', {
					bubbles: true
				})
			);
		} catch (error) {
			node.dispatchEvent(
				new CustomEvent('error', {
					bubbles: true,
					detail: error
				})
			);
		}
	}

	node.addEventListener('click', copyText);

	return {
		destroy() {
			node.removeEventListener('click', copyText);
		}
	};
}


export const provider_icons: Record<OAuthProvider, string> = {
	solana: 'formkit:solana',
	github: 'simple-icons:github',
	twitter: 'simple-icons:twitter',
	discord: 'simple-icons:discord',
	ip_address: 'carbon:location'

};

export const provider_account_id_title: Record<OAuthProvider, string> = {
	solana: 'Public Key/Wallet Address',
	github: 'Github Username',
	twitter: 'Twitter Username',
	discord: 'Discord Username',
	ip_address: 'IP Address'
};

export const account_id_patterns: Record<OAuthProvider, RegExp> = {
	solana: /^([1-9A-HJ-NP-Za-km-z]{44})$/,
	github: /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i,
	twitter: /^[a-zA-Z0-9_]{1,15}$/,
	discord: /^.{2,32}#\d{4}$/,
	ip_address: /^(\d{1,3}\.){3}\d{1,3}$/
};

export function trim_id(string: string, slice: number = 5) {
	return string.slice(0, slice) + '...' + string.slice(-slice);
}

export const crud_icons: Record<CrudOperation, string> = {
	create: 'carbon:add',
	read: 'carbon:search',
	update: 'carbon:edit',
	delete: 'carbon:delete',
	all: 'carbon:id-management'
};

export const promise_toast = (promise: Promise<unknown>, opts?: {
	loading: string,
	success: string,
	error?: string,
	with_error?: boolean
}) => {
	const { success, error, loading, with_error } = opts ?? {};
	const id = toast.loading(loading ?? 'Loading')
	return new Promise((resolve, reject) => {
		promise
			.then((r) => {
				toast.success(success ?? 'Success', {id});
				resolve(r);
			})
			.catch((e) => {
				toast.error((error ? error + ': ' : '') + ((with_error ?? true) ? `${e}` : ''), {id});
				reject(e);
			});
	});
}

// handle form submit, check form validity, if not, report validity, return form fields
export function handle_form_submit<T>(event: Event<EventTarget>, required_fields: (keyof T)[] = []) {
	event.preventDefault();
	const form = event.target as HTMLFormElement;
	if (!form) {
		throw new Error('Could not find form');
	}
	if (!form.checkValidity()) {
		form.reportValidity();
		throw new Error('Form is invalid');
	}
	const form_data = new FormData(form);
	const form_fields = Object.fromEntries(form_data.entries()) as T;
	for (const field of required_fields) {
		if (!form_fields[field]) {
			throw new Error(`Missing required field: ${String(field)}`);
		}
	}
	return form_fields as T
}

function hex_to_rgb(hex: string): [number, number, number] {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    return [r, g, b];
}


export function relative_luminance([r, g, b]: [number, number, number]): number {
    const rs = r / 255;
    const gs = g / 255;
    const bs = b / 255;

    const R = rs <= 0.03928 ? rs / 12.92 : Math.pow((rs + 0.055) / 1.055, 2.4);
    const G = gs <= 0.03928 ? gs / 12.92 : Math.pow((gs + 0.055) / 1.055, 2.4);
    const B = bs <= 0.03928 ? bs / 12.92 : Math.pow((bs + 0.055) / 1.055, 2.4);

    return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

export function is_color_dark(hex: string): boolean {
    const rgb = hex_to_rgb(hex);
    const luminance = relative_luminance(rgb);
    return luminance > 0.5;
}
