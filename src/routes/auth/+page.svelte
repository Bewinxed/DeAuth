<script lang="ts">
	import { Svetch } from '$lib/api/client';
	import type {
		SolanaSignInInput,
		SolanaSignInOutput,
		SolanaSignMessageOutput
	} from '@solana/wallet-standard-features';
	
	import { walletStore } from '@svelte-on-solana/wallet-adapter-core';
	import base58 from 'bs58';
	import AuthWizard from './AuthWizard.svelte';
	import {
		getApplication,
		getOrganization,
		setApplication,
		setOrganization
	} from 'src/lib/components/data_contexts.js';
	export let data;

	setApplication(data.application);
	setOrganization(data.organization);

	const organization = getOrganization();
	const application = getApplication();

	let isVerifying = false;
	let verified = false;
	let signature: string;
	let code: string;

	const svetch = new Svetch();

	const siws = async (message: SolanaSignInInput) => {
		if (!$walletStore.publicKey) return;

		// @ts-ignore
		if ($walletStore?.adapter?._wallet?.signIn) {
			// @ts-ignore
			const output: SolanaSignInOutput =
				await $walletStore.adapter._wallet?.signIn(message);

			if (!$walletStore?.publicKey) {
				throw new Error('Wallet not connected');
			}

			const res = await svetch.post('api/siws/message/verify', {
				query: {
					state: data.state
				},
				body: {
					input: message,
					output: {
						signature: base58.encode(output.signature),
						signedMessage: base58.encode(output.signedMessage),
						account: {
							publicKey: $walletStore.publicKey.toBase58(),
							address: $walletStore.publicKey.toBase58(),
							chains: ['solana'],
							features: ['signing'],
							icon: $walletStore.adapter?.icon,
							label: $walletStore.adapter?.name
						},
						signatureType: 'ed25519'
					}
				}
			});

			if (res.ok) {
				return output;
			} else {
				throw new Error('Failed to verify message', {
					cause: res.error
				});
			}
		}
		throw new Error(
			'Wallet does not support SIWS, Falling back to legacy signing'
		);
	};

	const siws_legacy = async (
		message: SolanaSignInInput,
		legacy_message: string
	) => {
		if (!$walletStore.publicKey) return;
		// If the signIn feature is not available, return true
		// if $walletStore?.adapter?._wallet?.signIn exists
		// @ts-ignore
		const encodedMessage = new TextEncoder().encode(legacy_message);

		if (!$walletStore.signMessage) {
			// toast.push('Wallet does not support signing messages, Falling back to ledger signing');

			isVerifying = false;

			return;
		}

		const signedMessage = await $walletStore?.signMessage(encodedMessage);

		if (signedMessage) {
			const verification = await svetch.post('api/siws/message/verify', {
				query: {
					state: data.state
				},
				body: {
					input: message,
					output: {
						signature: base58.encode(signedMessage),
						signedMessage: legacy_message,
						account: {
							address: $walletStore.publicKey.toBase58(),
							publicKey: $walletStore.publicKey.toBase58(),
							chains: ['solana'],
							features: ['signing'],
							icon: $walletStore.adapter?.icon,
							label: $walletStore.adapter?.name
						},
						signatureType: 'legacy'
					}
				}
			});

			if (verification.ok) {
				signature = base58.encode(signedMessage);
				isVerifying = false;
				verified = true;
				return true;
			} else {
				isVerifying = false;
				verified = false;
				throw new Error('Failed to verify message', {
					cause: verification.error
				});
			}
		}
	};

	export const signMessage = async () => {
		if (
			!$walletStore ||
			!$walletStore.publicKey ||
			!$walletStore.adapter?._wallet
		) {
			throw new Error('Wallet not connected');
		}

		if (!$walletStore) return;

		isVerifying = true;

		const message = await svetch
			.get('api/siws/message/:app_id/:public_key/generate', {
				path: {
					public_key: $walletStore.publicKey.toBase58(),
					app_id: data.app_id
				},
				query: {
					state: data.state
				}
			})
			.then((res) => {
				if (res.data) {
					return res.data;
				} else {
					throw new Error('Failed to generate message', {
						cause: res.error
					});
				}
			});

		await siws(message.siws)
			.then((res: SolanaSignInOutput) => {
				if (res) {
					signature = base58.encode(res.signature);
					isVerifying = false;
					verified = true;
					return true;
				} else {
					throw new Error('User rejected signing message');
				}
			})
			.catch(async (err) => {
				// if rejection, cancel
				if (err.message.includes('reject')) {
					isVerifying = false;
					verified = false;
					throw err;
				}
				console.log(err);
				await siws_legacy(message.siws, message.legacy).then((res) => {
					if (res) {
						return;
					} else {
						isVerifying = false;
						verified = false;
						throw new Error('Failed to verify message', {
							cause: res.error
						});
					}
				});
			});

		// toast.push('Verifying signature...');
	};
</script>

<div
	style:--branding-primary="{$application.branding?.primary_color ??
		$organization.branding?.primary_color ??
		'#796AC0'}"
	style:--branding-secondary="{$application.branding?.secondary_color ??
		$organization.branding?.secondary_color} ?? '#100f0f'"
	style:--branding-background="{$application.branding?.background_color ??
		$organization.branding?.background_color ??
		'#FCFCFC'}"
	style:--branding-primary-text="{($application.branding?.primary_color_text ??
		$application.branding?.primary_color_text ??
		'dark') === 'dark'
		? 'black'
		: 'white'}"
	style:--branding-secondary-text="{($application.branding
		?.secondary_color_text ??
		$application.branding?.secondary_color_text ??
		'dark') === 'dark'
		? 'black'
		: 'white'}"
	style:--branding-background-text="{($application.branding
		?.background_color_text ??
		$application.branding?.background_color_text ??
		'dark') === 'dark'
		? 'black'
		: 'white'}"
	class="min-h-screen w-full bg-gradient-to-b from-transparent via-[var(--branding-background)] to-[var(--branding-background)]"
>
	<AuthWizard />
</div>
