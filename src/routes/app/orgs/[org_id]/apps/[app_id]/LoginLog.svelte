<script lang="ts">
	import { page } from '$app/stores';
	import EmptyState from '$components/EmptyState.svelte';
	import PrettyIcon from '$components/PrettyIcon.svelte';
	import PromiseButton from '$components/PromiseButton.svelte';
	import { getApplication } from '$components/data_contexts.js';
	import { Svetch } from 'src/lib/api/client.js';
	import { provider_icons } from 'src/lib/utils/ui_helpers';
	import { flip } from 'svelte/animate';
	import { fly } from 'svelte/transition';
	const svetch = new Svetch();
	let new_redirect: string;
	const application = getApplication();
</script>

<header
	id="{$$restProps.id}"
	class="flex place-content-start place-items-center justify-between gap-2 p-4"
>
	<div class="flex place-content-start place-items-center gap-2">
		<PrettyIcon icon="carbon:cloud-logging"></PrettyIcon>
		<h1 class=" text-xl font-bold">Login Log</h1>
	</div>
	<div></div>
	<!-- <figure class="w-4 h-4 inline text-base-content"><Icon icon="carbon:chevron-right" class="h-4 w-4"></Icon></figure> -->
</header>
<div class="p-4">
	{#if $application.auth_request.length > 0}
		<div class="flex flex-wrap place-content-start gap-2">
			{#each $application.auth_request as log (log.id)}
				<div
					animate:flip
					transition:fly
					class="flex w-full justify-between rounded-lg border border-b-2 px-4 py-2 shadow"
				>
					{#if log.provider}
						<span class="gap-2 place-self-center">
							<PrettyIcon
								size="small"
								icon="{log.provider ? provider_icons[log.provider] : ''}"
							/>
							{log.ip_address}
						</span>
					{/if}
					<div
						class="tooltip tooltip-primary break-all"
						data-tip="{log.user_id}"
					>
						{log.user_id?.slice(0, 5)}...{log.user_id?.slice(-5)}
					</div>
					<!-- created at -->
					<div class="flex place-content-center place-items-center gap-2">
						<p class="text-sm italic">
							Created: {log.updated_at.toLocaleString(undefined, {
								dateStyle: 'short',
								timeStyle: 'short'
							})}
						</p>
						<div class="card-actions">
							<PromiseButton
								icon="carbon:trash-can"
								square
								class="btn btn-error btn-sm"
								tooltip="{'delete'}"
								promise="{async () => {
									await svetch
										.delete('app/orgs/:org_id/apps/:app_id/redirects', {
											path: {
												app_id: $page.params.app_id,
												org_id: $page.params.org_id
											},
											query: {
												id: log.id
											}
										})
										.then((res) => {
											if (res.data) {
												$application.redirect_urls =
													$application.redirect_urls.filter(
														(r) => r.id !== log.id
													);
											}
										});
								}}"
							></PromiseButton>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{:else}
		<EmptyState
			icon="carbon:cloud-logging"
			item_name="redirect url"
			caption="No logins yet..."
		></EmptyState>
	{/if}
</div>

<style>
	header {
		view-transition-name: var(--org);
	}
</style>
