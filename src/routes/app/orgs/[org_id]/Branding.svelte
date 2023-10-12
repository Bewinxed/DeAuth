<script lang="ts">
	import { page } from '$app/stores';
	import type { Prisma } from '@prisma/client';
	import DoodleIpsum from 'src/lib/components/DoodleIpsum.svelte';
	import PrettyIcon from 'src/lib/components/PrettyIcon.svelte';
	import { get_svetch } from 'src/lib/context';
	import { customDispatch } from 'src/lib/utils/event_helpers';
	import { promise_toast } from 'src/lib/utils/ui_helpers';
	import ColorPicker from 'svelte-awesome-color-picker';
	import { writable } from 'svelte/store';
	import ModalButton from './apps/[app_id]/ModalButton.svelte';
	export let branding: Prisma.BrandingGetPayload<object>;
	const svetch = get_svetch();
	const branding_store = writable<Partial<Prisma.BrandingGetPayload<object>>>(
		branding ?? {
			primary_color: '',
			secondary_color: '',
			background_color: '',
			logo: ''
		}
	);

	const colors: {
		name: string;
		key: keyof Pick<
			typeof $branding_store,
			'primary_color' | 'secondary_color' | 'background_color'
		>;
		glyph: string;
		cclass: string;
	}[] = [
		{
			name: 'primary',
			glyph: 'n1',
			key: 'primary_color',
			cclass: `bg-[var(--org-primary)]`
		},
		{
			name: 'secondary',
			glyph: 'n2',
			key: 'secondary_color',
			cclass: `bg-[var(--org-secondary)]`
		},
		{
			name: 'background',
			glyph: 'bg',
			key: 'background_color',
			cclass: `bg-[var(--org-background)]`
		}
	];

	$: console.log($branding_store?.primary_color);
</script>

<header
	style:--org="page-content-header"
	class="flex place-content-start place-items-center justify-between gap-2 p-4"
>
	<div class="flex place-content-start place-items-center gap-2">
		<PrettyIcon icon="icon-park-outline:api-app"></PrettyIcon>
		<h1 class=" text-xl font-bold">Branding</h1>
	</div>
	<div></div>
	<!-- <figure class="w-4 h-4 inline text-base-content"><Icon icon="carbon:chevron-right" class="h-4 w-4"></Icon></figure> -->
</header>
<div class="p-4 flex flex-col gap-2">
	<p class="text-sm font-semibold">Choose colors below to customize your sign-in page</p>
	<p class="text-sm">
		Setting your organization colors applies them to all your apps, to set
		specific colors per-app, set these from the application's page.
	</p>
	<div class="rounded-2xl border p-2">
		<div
			style:--org-primary="{$branding_store.primary_color}"
			style:--org-secondary="{$branding_store.secondary_color}"
			style:--org-background="{$branding_store.background_color}"
			class="flex flex-col flex-wrap gap-4"
		>
			<h2 class="text-lg font-bold">Colors</h2>
			<div class="flex flex-wrap gap-2">
				{#each colors as { name, key, glyph, cclass }}
					<div
						style:--color="{$branding_store[key]}"
						class="flex w-48 place-items-center justify-between"
					>
						<h3 class="text-sm font-bold capitalize">{name}</h3>
						<ModalButton
							outline="{false}"
							icon="carbon:color-palette"
							title="Choose {name} color"
							item_name="{name}"
							class="btn btn-square btn-md hover:bg-[var(--color)] active:bg-[var(--color)] {$branding_store[
								key
							]
								? `bg-[var(--color)]`
								: ''}"
						>
							{glyph}
							<svelte:fragment slot="modal">
								<form
									on:submit|preventDefault="{async (e) => {
										if (!$branding_store[key]) return;
										await promise_toast(
											svetch.put('app/orgs/:org_id/branding', {
												path: {
													org_id: $page.params.org_id
												},
												query: {},
												body: {
													id: $branding_store.id ?? undefined,
													[key]: $branding_store[key]
												}
											}),
											{
												loading: `Saving ${name} color`,
												success: `${name} color saved`
											}
										);
										customDispatch(e, 'close');
									}}"
								>
									<div class="h-80">
										<ColorPicker
											isOpen
											isPopup="{true}"
											label=""
											bind:hex="{$branding_store[key]}"
										/>
									</div>
									<div class="modal-action">
										<button
											on:click
											class="chonk btn btn-wide {$branding_store[key]
												? `bg-[var(--color)]`
												: ''}">Save</button
										>
									</div>
								</form>
							</svelte:fragment>
						</ModalButton>
					</div>
				{/each}
			</div>

			<div class="divider"></div>
			<h2 class="text-lg font-bold">Preview</h2>
			<div
				class="mockup-browser flex h-96 w-full max-w-[70vw] flex-col place-self-center rounded-3xl border bg-base-100 px-4 pb-4 shadow-inner sm:h-[35rem] sm:max-w-sm sm:px-8 sm:pb-8"
			>
				<div class="mockup-browser-toolbar">
					<div class="input">https://deauth.xyz</div>
				</div>

				<div
					class="h-full w-full rounded-2xl border border-base-300 bg-[var(--org-background)] p-8 shadow-inner"
				>
					<div
						class="flex h-full w-full flex-col place-items-center justify-between rounded-2xl border border-base-300 bg-[var(--org-primary)] shadow-lg"
					>
						<div class="flex flex-col place-items-center gap-4 p-4">
							<div class="avatar drop-shadow-lg">
								<figure
									class="w-16 rounded-full border bg-base-100 bg-cover p-1"
								>
									{#if $branding_store?.logo}
										<img
											src="{$branding_store?.logo}"
											alt="your logo here"
										/>
									{:else}
										<DoodleIpsum
											category="abstract"
											class=""
										/>
									{/if}
								</figure>
							</div>
							Sign in to App
						</div>
						<span
							class="m-1 h-4 w-3/4 animate-pulse rounded-3xl bg-[var(--org-secondary)] bg-base-100 opacity-80"
						></span>
						<span
							class="m-1 h-4 w-3/4 animate-pulse rounded-3xl bg-[var(--org-secondary)] bg-base-100 opacity-80"
						></span>
						<span
							class="m-1 h-4 w-3/4 animate-pulse rounded-3xl bg-[var(--org-secondary)] bg-base-100 opacity-80"
						></span>
						<span
							class="m-1 h-4 w-3/4 animate-pulse rounded-3xl bg-[var(--org-secondary)] bg-base-100 opacity-80"
						></span>
						<div class="flex flex-col place-items-center gap-4 p-4">
							<button class="btn btn-sm bg-[var(--org-secondary)]">
								Sign in
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
