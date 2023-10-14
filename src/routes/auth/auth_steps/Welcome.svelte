<script lang="ts">
	import { createStepController } from '@efstajas/svelte-stepper';
	import { page } from '$app/stores';
	import type { Writable } from 'svelte/store';
	import { walletStore } from '@svelte-on-solana/wallet-adapter-core';
	import { onDestroy, onMount } from 'svelte';
	import Icon from '@iconify/svelte';
	import { get_svetch } from 'src/lib/context';
	import type { UserWithProfile } from '../store';
	import { fly, scale, slide } from 'svelte/transition';
	import {
		getApplication,
		getOrganization
	} from 'src/lib/components/data_contexts';
	import DoodleIpsum from 'src/lib/components/DoodleIpsum.svelte';
	import {
		WalletConnectButton,
		WalletMultiButton
	} from '@svelte-on-solana/wallet-adapter-ui';
	import { get_wallet_connect_visible } from 'src/lib/components/context';
	import { bounceInOut } from 'svelte/easing';
	const stepController = createStepController();
	const svetch = get_svetch();
	const application = getApplication();
	const organization = getOrganization();
	const wallet_connect_visible = get_wallet_connect_visible();

	// $: if ($wallet_connect_visible !== undefined) {
	// 	// @ts-ignore
	// 	if (document.startViewTransition) {
	// 		console.log('welcome');
	// 		// @ts-ignore
	// 		document.startViewTransition(async () => {
	// 			// DOM changes
	// 		});
	// 	}
	// }

	onMount(async () => {
		$wallet_connect_visible = false;
		if ($walletStore.connected) {
			// stepController.nextStep();
		}
		const state = $page.url.searchParams.get('state');
		if (state) {
			await svetch
				.get('api/auth/auth_requests', {
					query: {
						state
					}
				})
				.then((res) => {
					if (res.data && res.data.signature) {
						// @ts-ignore
						stepController.move(2);
					}
				});
		}
	});

	onDestroy(() => {
		$wallet_connect_visible = true;
	});

	export let context: Writable<UserWithProfile>;

	const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
</script>

<div
	class="card-body flex-col place-content-center place-items-center justify-center !p-2 sm:!p-8"
>
	{#if !$walletStore.connected}
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
	{#if $wallet_connect_visible === false}
		<div
			id="wallet-connect-wizard"
			style="view-transition-name: wallet-connect"
			class=""
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
	{/if}
	{#if $walletStore.connected && $walletStore.publicKey}
		<div
			transition:slide
			class="card-actions justify-end"
		>
			<button
			class:btn-primary="{!(
				$organization.branding?.primary_color ??
				$application.branding?.primary_color
			)}"
			class:bg-[var(--branding-primary)]="{$organization.branding
				?.primary_color ?? $application.branding?.primary_color}"
			class:text-[var(--branding-primary-text)]="{$organization.branding
				?.primary_color_text ?? $application.branding?.primary_color_text}"
			class:hover:bg-[var(--branding-secondary)]="{$organization.branding
				?.secondary_color ?? $application.branding?.secondary_color}"
			class:hover:text-[var(--branding-secondary-text)]="{$organization.branding
				?.secondary_color_text ?? $application.branding?.secondary_color_text}"
			class:border-[var(--branding-secondary)]="{$organization.branding
				?.secondary_color ?? $application.branding?.secondary_color}"
				class="btn"
				on:click="{stepController.nextStep}"
			>
				<Icon
					class="h-5 w-5"
					icon="carbon:arrow-right"
				/>
				Verification</button
			>
		</div>
	{/if}
</div>

<style>
	:global(
			html * > #wallet-connect-wizard > div > div > .wallet-adapter-button
		) {
		@apply w-40;
	}
</style>
