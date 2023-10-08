<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { createStepController } from '@efstajas/svelte-stepper';
	import Icon from '@iconify/svelte';
	import { walletStore } from '@svelte-on-solana/wallet-adapter-core';
	import type { DAS } from 'helius-sdk';
	import DoodleIpsum from 'src/lib/components/DoodleIpsum.svelte';
	import PromiseButton from 'src/lib/components/PromiseButton.svelte';
	import { get_svetch } from 'src/lib/context';
	import { object_entries, object_keys } from 'src/lib/utils/object_helpers';
	import { getContext, onMount } from 'svelte';
	import type { Writable } from 'svelte/store';
	import { fly, slide } from 'svelte/transition';
	import type { UserWithProfile } from '../store';
	import NftList from './NftList.svelte';
	const stepController = createStepController();

	const svetch = get_svetch();

	let user_context = getContext<Writable<UserWithProfile>>('user');

	export let context: Writable<UserWithProfile>;

	let nfts: Record<number, DAS.GetAssetResponse[]> = {};

	$: current_page_nfts = nfts[current_page];

	let change_avatar = false;

	let current_page = 1;

	$: if (Object.keys(nfts).includes(current_page.toString())) {
		current_page_nfts = nfts[current_page];
	} else {
		get_nfts(current_page);
	}

	async function get_nfts(page: number) {
		if (!$walletStore.publicKey) return;
		if (nfts[page]) {
			return nfts[page];
		}
		const request = await svetch
			.get('api/nfts/:public_key', {
				path: {
					public_key: $walletStore.publicKey.toBase58()
				},
				query: {
					page: page.toString(),
					limit: (9).toString()
				}
			})
			.then((res) => {
				if (res.data) {
					nfts[page] = res.data.items;
					return res.data.items;
				}
			})
			.catch((err) => {
				console.error(err);
				return [];
			});

		return request;
	}

	// you will be redirected in 5 seconds
	let countdown_value: number = 5;
	let countdown_interval: NodeJS.Timeout;

	onMount(async () => {
		if ($user_context.avatar_url) {
			change_avatar = false;
		} else {
			change_avatar = true;
			clearInterval(countdown_interval);
		}

		console.log($user_context);

		// redirect after 5 seconds
		if ($user_context.signature) {
			countdown_interval = setInterval(() => {
				countdown_value--;
				if (countdown_value == 0) {
					goto(
						`${$page.data.redirect_uri}?${new URLSearchParams({
							app_id: $page.data.app_id,
							state: $page.data.state,
							proof: $user_context.signature ?? ''
						}).toString()}`
					);
				}
			}, 1000);
		}
	});
</script>

<div
	class="card-body min-h-[36rem] place-content-center place-items-center gap-4"
>
	<!-- list of nfts -->
	{#if !change_avatar}
		<div
			class="flex flex-col place-items-center gap-2"
			transition:slide="{{ axis: 'y' }}"
		>
			<span class="text-lg font-bold">
				Click below to change your global avatar
			</span>
			<span>
				<Icon
					icon="carbon:arrow-down"
					class="inline animate-bounce"
				/>
			</span>
		</div>
	{/if}
	<button
		class="avatar btn btn-circle {change_avatar
			? 'h-24 w-24'
			: 'h-36 w-36'} animate-float overflow-hidden rounded-full shadow-xl transition-all"
		on:click="{() => {
			change_avatar = !change_avatar;
			clearInterval(countdown_interval);
			countdown_value = 0;
		}}"
	>
		{#if $user_context.avatar_url}
			<img
				src="{$user_context.avatar_url}"
				alt="avatar"
			/>
		{:else}
			<DoodleIpsum category="avatar" />
		{/if}
	</button>
	{#if countdown_value > 0}
		<div
			class="flex w-full flex-col place-content-center place-items-center"
			transition:slide="{{ axis: 'y' }}"
		>
			<span>You will be redirected in </span>
			<div class="transition-container">
				{#key countdown_value}
					<span
						in:fly="{{ x: 100, duration: 200, delay: 100 }}"
						out:fly="{{ x: -100, duration: 200 }}"
						class="text-lg font-black tabular-nums">{countdown_value}</span
					>
				{/key}
			</div>
		</div>{/if}
	{#if change_avatar}
		<div
			class="flex w-full flex-col place-content-center place-items-center gap-2"
			transition:slide="{{ axis: 'y' }}"
		>
			<h1 class="text-center font-bold">Choose your Profile Picture</h1>
			<div class="transition-container">
				{#if object_keys(nfts).length === 0}
					<span class="loading loading-ball loading-lg"></span>
				{:else}
					{#each object_entries(nfts) as [page, nft_page], index (page)}
						{#if page.toString() === current_page.toString()}
							<div
								in:fly="{{ x: 100, duration: 100, delay: 100 }}"
								out:fly="{{ x: -100, duration: 100 }}"
							>
								<NftList bind:nfts="{nft_page}" />
							</div>
						{/if}
					{/each}
				{/if}
			</div>
			<div class="join">
				<PromiseButton
					promise="{async () => {
						await get_nfts(current_page - 1).then(() => current_page--);
					}}"
					class="btn btn-square btn-outline join-item"
					icon="carbon:previous-outline"
				></PromiseButton>
				<PromiseButton
					promise="{async () => {
						await get_nfts(current_page + 1).then(() => current_page++);
					}}"
					class="btn btn-square btn-outline join-item"
					icon="carbon:next-outline"
				></PromiseButton>
			</div>
		</div>
	{/if}

	<!-- {#if $user_context.signature} -->
	<a
		href="{`${$page.data.redirect_uri}?${new URLSearchParams({
			app_id: $page.data.app_id,
			state: $page.data.state
		}).toString()}`}"
		in:fly="{{ x: 100 }}"
		out:fly="{{ x: -100 }}"
		class="btn btn-outline"
	>
		<Icon
			icon="carbon:arrow-right
	"
			class="inline"
		/>
		Redirect now
	</a>
	<!-- {/if} -->

	<div class="card-actions justify-end">
		<button
			class="btn btn-primary"
			on:click="{() => {
				clearInterval(countdown_interval);
				stepController.previousStep();
				stepController.previousStep();
			}}"
		>
			<Icon
				class="h-5 w-5"
				icon="carbon:arrow-left"
			/>
			Change Wallet</button
		>
		<!-- <button class="btn btn-primary" on:click={stepController.nextStep}>
			<Icon class="h-5 w-5" icon="carbon:arrow-right" />
			Next</button
		> -->
	</div>
</div>
