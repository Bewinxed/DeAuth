import type { OAuthProvider } from "@prisma/client";

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