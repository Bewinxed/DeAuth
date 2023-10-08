<script lang="ts">
	import { createStepController } from '@efstajas/svelte-stepper';
	import Icon from '@iconify/svelte';

	import { get_svetch } from 'src/lib/context';
	import { fly, slide } from 'svelte/transition';

	import type {
		SolanaSignInInput,
		SolanaSignInOutput
	} from '@solana/wallet-standard-features';
	import { walletStore } from '@svelte-on-solana/wallet-adapter-core';
	import base58 from 'bs58';

	let isVerifying = false;
	let verified = false;
	let signature: string;
	const user_context = getContext<Writable<Partial<UserWithProfile>>>('user');

	export let context: Writable<UserWithProfile>;

	const siws = async (
		message: SolanaSignInInput
	): Promise<SolanaSignInOutput> => {
		if (!$walletStore.publicKey) throw new Error('Wallet not connected');

		// @ts-ignore
		if ($walletStore?.adapter?._wallet?.signIn) {
			const output: SolanaSignInOutput =
				// @ts-ignore
				await $walletStore.adapter._wallet?.signIn(message);

			if (!$walletStore?.publicKey) {
				throw new Error('Wallet not connected');
			}

			const res = await svetch.post('api/siws/message/verify', {
				query: {
					state: state
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

			if (res.data) {
				user_context.set({
					...res.data.user,
					signature: base58.encode(output.signature)
				});
				console.log('user context', $user_context);
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
					state: state
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

			if (verification.data) {
				user_context.set({
					...verification.data.user,
					signature: base58.encode(signedMessage)
				});
				console.log('user context', $user_context);
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

	const signMessage = async () => {
		if (
			!$walletStore ||
			!$walletStore.publicKey ||
			// @ts-ignore
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
					app_id: app_id
				},
				query: {
					state: state,
					...$page.data.extras
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
					stepController.nextStep();
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
					toast.error("Message Signing Request Rejected")
					throw err;
				}
				console.log(err);
				await siws_legacy(message.siws, message.legacy).then((res) => {
					if (res) {
						stepController.nextStep();
						return;
					} else {
						isVerifying = false;
						verified = false;
						throw new Error('Failed to verify message');
					}
				});
			});

		// toast.push('Verifying signature...');
	};

	import { page } from '$app/stores';
	import { WalletMultiButton } from '@svelte-on-solana/wallet-adapter-ui';
	import { get_wallet_connect_visible } from 'src/lib/components/context';
	import { getApplication } from 'src/lib/components/data_contexts';
	import { goto, invalidateAll } from '$app/navigation';
	import type { UserWithProfile } from '../store';
	import type { Writable } from 'svelte/store';
	import { getContext, onMount } from 'svelte';
	import toast from 'svelte-french-toast';
	const stepController = createStepController();
	const svetch = get_svetch();
	const application = getApplication();
	const wallet_connect_visible = get_wallet_connect_visible();

	const { redirect_uri, app_id, state } = $page.data;

	onMount(() => {
		if ($page.data.session?.user) {
			// console.log($page.data.session)
			// stepController.nextStep();
		}
	});
</script>

<div
	class="card-body flex-1 place-content-center place-items-center gap-4 !p-2 sm:!p-8"
>
	{#if !verified}
		<div
			class="flex flex-col place-content-center place-items-center gap-2"
			transition:slide="{{ axis: 'y' }}"
		>
			<span class="text-lg font-bold"> Click below to verify your wallet </span>
			<span>
				<Icon
					icon="carbon:arrow-down"
					class="inline animate-bounce"
				/>
			</span>
		</div>
	{/if}

	<div class="transition-container">
		{#if !$walletStore.connected && $wallet_connect_visible === false}
			<div
				class="wallet-connect"
				out:slide="{{ axis: 'y' }}"
			>
				<div
					on:click="{() => void 0}"
					role="button"
					tabindex="{0}"
					on:keydown
				>
					<WalletMultiButton
						><span>
							<!-- <Icon icon="formkit:solana" class=" inline" /> -->
							Connect Wallet
						</span></WalletMultiButton
					>
				</div>
			</div>
		{:else if !verified}
			<button
				in:fly="{{ x: 100 }}"
				out:fly="{{ x: -100 }}"
				class:animate-bounce="{isVerifying}"
				class="wallet-adapter-button wallet-adapter-button-trigger"
				disabled="{isVerifying}"
				on:click="{signMessage}"
			>
				<span>
					{#if isVerifying}
						Verifying...
					{:else if verified}
						Verified!
					{:else}
						Verify
					{/if}
				</span>
			</button>
		{/if}
	</div>
	<div class="card-actions mt-4 justify-end">
		<button
			class="btn btn-primary"
			on:click="{stepController.previousStep}"
		>
			<Icon
				class="h-5 w-5"
				icon="carbon:arrow-left"
			/>
			Previous</button
		>
		{#if $page.data.session?.user}
			<button
				transition:slide="{{ axis: 'x' }}"
				class="btn btn-primary"
				on:click="{stepController.nextStep}"
			>
				<Icon
					class="h-5 w-5"
					icon="carbon:arrow-right"
				/>
				Next</button
			>
		{/if}
	</div>
</div>

<style>
	.wallet-connect {
		view-transition-name: 'wallet-connect';
	}
</style>
