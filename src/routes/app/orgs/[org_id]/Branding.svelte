<script lang="ts">
	import { page } from '$app/stores';
	import type { Prisma } from '@prisma/client';
	import DoodleIpsum from 'src/lib/components/DoodleIpsum.svelte';
	import PrettyIcon from 'src/lib/components/PrettyIcon.svelte';
	import { get_svetch } from 'src/lib/context';
	import { customDispatch } from 'src/lib/utils/event_helpers';
	import { is_color_dark, promise_toast } from 'src/lib/utils/ui_helpers';
	import ColorPicker from 'svelte-awesome-color-picker';
	import { writable, type Writable } from 'svelte/store';
	import ModalButton from './apps/[app_id]/ModalButton.svelte';
	export let branding: Prisma.BrandingGetPayload<object> | null = null;
	const svetch = get_svetch();
	const branding_store = writable<Partial<Prisma.BrandingGetPayload<object>>>(
		branding ?? {
			application_id: $page.params.app_id,
			organization_id: $page.params.org_id,
			primary_color: '',
			primary_color_text: 'light',
			secondary_color: '',
			secondary_color_text: 'light',
			background_color: '',
			background_image_text: 'light',
			background_color_text: 'light',
			logo: ''
		}
	);

	$: if ($branding_store.primary_color) {
		is_color_dark($branding_store.primary_color)
			? ($branding_store.primary_color_text = 'light')
			: ($branding_store.primary_color_text = 'dark');
	}

	$: if ($branding_store.secondary_color) {
		is_color_dark($branding_store.secondary_color)
			? ($branding_store.secondary_color_text = 'light')
			: ($branding_store.secondary_color_text = 'dark');
	}

	$: if ($branding_store.background_color) {
		is_color_dark($branding_store.background_color)
			? ($branding_store.background_color_text = 'light')
			: ($branding_store.background_color_text = 'dark');
	}

	const colors: {
		name: string;
		key: keyof Pick<
			typeof $branding_store,
			'primary_color' | 'secondary_color' | 'background_color'
		>;
		is_dark_key: keyof Pick<
			typeof $branding_store,
			'primary_color_text' | 'secondary_color_text' | 'background_color_text'
		>;
		glyph: string;
		cclass: string;
	}[] = [
		{
			name: 'primary',
			glyph: 'n1',
			key: 'primary_color',
			is_dark_key: 'primary_color_text',
			cclass: `bg-[var(--org-primary)]`
		},
		{
			name: 'secondary',
			glyph: 'n2',
			key: 'secondary_color',
			is_dark_key: 'secondary_color_text',
			cclass: `bg-[var(--org-secondary)]`
		},
		{
			name: 'background',
			glyph: 'bg',
			key: 'background_color',
			is_dark_key: 'background_color_text',
			cclass: `bg-[var(--org-background)]`
		}
	];
</script>

<header
	id="branding"
	class="flex place-content-start place-items-center justify-between gap-2 p-4"
>
	<div class="flex place-content-start place-items-center gap-2">
		<PrettyIcon icon="icon-park-outline:api-app"></PrettyIcon>
		<h1 class=" text-xl font-bold">
			{$page.params.app_id ? 'Application' : 'Organization'}
			Branding
		</h1>
	</div>
	<div></div>
	<!-- <figure class="w-4 h-4 inline text-base-content"><Icon icon="carbon:chevron-right" class="h-4 w-4"></Icon></figure> -->
</header>
<div class="flex flex-col gap-2 p-4">
	<p class="text-sm font-semibold">
		Choose colors below to customize your sign-in page
	</p>
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
				{#each colors as { name, key, glyph, cclass, is_dark_key }}
					<div
						style:--color="{$branding_store[key]}"
						class="flex w-40 place-items-center justify-between rounded-lg border p-2"
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
								: ''}
								{$branding_store[is_dark_key] === 'dark' ? 'text-white' : 'text-neutral'}
								
								"
						>
							{glyph}
							<svelte:fragment slot="modal">
								<form
									on:submit|preventDefault="{async (e) => {
										if (!$branding_store[key]) return;
										let query = {};
										if ($page.params.app_id) {
											query['app_id'] = $page.params.app_id;
										} else if ($page.params.org_id) {
											query['org_id'] = $page.params.org_id;
										}

										await promise_toast(
											svetch
												.put('app/orgs/:org_id/branding', {
													path: {
														org_id: $page.params.org_id
													},
													query,
													body: {
														id: $branding_store.id ?? undefined,
														[key]: $branding_store[key]
													}
												})
												.then((res) => {
													if (!res.data) throw res.error.message;
												}),
											{
												loading: `Saving ${name} color`,
												success: `${name} color saved`
											}
										),
											customDispatch(e, 'close');
									}}"
								>
									<div class="h-80">
										<ColorPicker
											isA11yClosable="{false}"
											isOpen
											isPopup="{true}"
											label=""
											bind:hex="{$branding_store[key]}"
										/>
									</div>
									<div class="modal-action">
										<button
											class:text-neutral="{$branding_store[is_dark_key] ===
												'light'}"
											class:text-white="{$branding_store[is_dark_key] ===
												'dark'}"
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

			<div class="divider my-0"></div>
			<h2 class="text-lg font-bold">Preview</h2>
			<div
				class="min-h-96 mockup-browser flex w-full max-w-[70vw] flex-col place-self-center rounded-3xl border border-base-300 bg-base-100 px-2 pb-2 shadow-inner sm:h-[35rem] sm:max-w-sm sm:px-4 sm:pb-4"
			>
				<div class="mockup-browser-toolbar">
					<div class="input">https://deauth.xyz</div>
				</div>

				<div
					style="background-color: {$branding_store.background_color}50"
					class="h-full w-full rounded-2xl border border-base-300 p-12 shadow-inner"
				>
					<div
						class="flex h-full w-full flex-col place-items-center justify-between rounded-2xl border border-[var(--org-primary)] bg-[var(--org-background)] shadow-lg"
					>
						<div
							class:text-neutral="{$branding_store.background_color_text ===
								'light'}"
							class:text-white="{$branding_store.background_color_text ===
								'dark'}"
							class="flex flex-col place-items-center gap-4 p-4"
						>
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
							class:bg-neutral="{$branding_store.background_color_text ===
								'light'}"
							class:bg-base-100="{$branding_store.background_color_text ===
								'dark'}"
							class="m-1 h-4 w-3/4 animate-pulse rounded-3xl bg-[var(--org-secondary)] opacity-80"
						></span>
						<span
							class:bg-neutral="{$branding_store.background_color_text ===
								'light'}"
							class:bg-base-100="{$branding_store.background_color_text ===
								'dark'}"
							class="m-1 h-4 w-3/4 animate-pulse rounded-3xl bg-[var(--org-secondary)] opacity-80"
						></span>
						<span
							class:bg-neutral="{$branding_store.background_color_text ===
								'light'}"
							class:bg-base-100="{$branding_store.background_color_text ===
								'dark'}"
							class="m-1 h-4 w-3/4 animate-pulse rounded-3xl bg-[var(--org-secondary)] opacity-80"
						></span>
						<span
							class:bg-neutral="{$branding_store.background_color_text ===
								'light'}"
							class:bg-base-100="{$branding_store.background_color_text ===
								'dark'}"
							class="m-1 h-4 w-3/4 animate-pulse rounded-3xl bg-[var(--org-secondary)] opacity-80"
						></span>
						<div class="flex flex-col place-items-center gap-4 p-4">
							<button
								class:text-neutral="{$branding_store.primary_color_text ===
									'light'}"
								class:text-white="{$branding_store.primary_color_text ===
									'dark'}"
								class:hover:text-neutral="{$branding_store.secondary_color_text ===
									'light'}"
								class:hover:text-white="{$branding_store.secondary_color_text ===
									'dark'}"
								class="btn btn-sm border-[var(--org-secondary)] bg-[var(--org-primary)] transition-all hover:bg-[var(--org-secondary)]"
							>
								Sign in
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
