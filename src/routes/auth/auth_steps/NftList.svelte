<script lang="ts">
	import type { DAS } from 'helius-sdk';
	import DoodleIpsum from 'src/lib/components/DoodleIpsum.svelte';
	import { get_svetch } from 'src/lib/context';
	import { crossfade, fly, slide } from 'svelte/transition';
	import type { UserWithProfile } from '../store';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';

	let selectedNftId: string | null = null;

	export let nfts: DAS.GetAssetResponse[] = [];

	const svetch = get_svetch();

	const user_context = getContext<Writable<UserWithProfile>>('user');

	const selectNft = async (id: string) => {
		selectedNftId = id;
		const avatar_url = nfts.find((nft) => nft.id === id)?.content?.files?.[0]
			?.uri;
		if (!avatar_url) return;
		await svetch
			.patch('api/user/:user_id', {
				path: {
					user_id: $user_context.id
				},
				body: {
					avatar_url
				}
			})
			.then((res) => {
				if (res.data) {
					$user_context.avatar_url = res.data.avatar_url;
				}
			});
	};
</script>

<div class="min-h-max transition-all">
	{#if nfts?.length === 0}
		<span class="loading loading-ball loading-lg"></span>
	{:else}
		<div
			class="flex flex-wrap place-content-center place-items-center gap-2 transition-all"
		>
			{#each nfts ?? [] as nft, index (index)}
				<button
					class="card card-compact h-32 w-24 bg-base-200 p-1 shadow outline-base-300"
					on:click="{() => selectNft(nft.id)}"
				>
					<figure class="h-3/4 w-full">
						{#if nft.content?.files?.[0]?.uri}
							<img
								src="{nft.content.files[0].uri}"
								alt="{nft.id}"
								class="object-cover"
								on:error="{(e) => {
									if (e.target instanceof HTMLImageElement)
										e.target.src = 'https://doodleipsum.com/500/avatar-2';
								}}"
							/>
						{:else}
							<DoodleIpsum
								category="avatar 2"
								class="h-auto w-full"
							/>
						{/if}
					</figure>
					<!-- <div class="card-body p-1"> -->
					<!-- <div class="h-1/2 w-full"> -->
					<h2 class="card-title truncate break-all text-xs">
						{nft.content?.metadata.name}
					</h2>
					<!-- </div> -->
					<!-- </div> -->
				</button>
			{/each}
		</div>
	{/if}
</div>

<style>
	/* You can add custom styles here */
</style>
