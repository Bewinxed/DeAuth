<script lang="ts">
	import Breadcrumbs from '$components/Breadcrumbs.svelte';

	import { getDrawer } from '$components/context';
	import { getOrganization, getOrganizations, setOrganization } from '$components/data_contexts';
	import { afterUpdate, onDestroy } from 'svelte';
	import OrganizationDrawer from '../OrganizationDrawer.svelte';
	import { page } from '$app/stores';
	import AutoHiddenIcon from '$components/AutoHiddenIcon.svelte';
	import Icon from '@iconify/svelte';
	const drawer = getDrawer();
	export let data;
	setOrganization(data.organization);
	const organizations = getOrganizations();
	const organization = getOrganization();
	const drawer_index = drawer.push(OrganizationDrawer, {
		organizations: organizations
	});

	// reset drawer ondestroy
	onDestroy(() => {
		drawer_index ? drawer.remove(drawer_index) : '';
	});

	afterUpdate(() => {
		$organization = data.organization;
	});

	$: on_org_page = $page.url.pathname.endsWith(`/app/orgs/${$organization?.id}`);
	$: on_org_app_page = $page.url.pathname.startsWith(`/app/orgs/${$organization?.id}/apps/`);
</script>

<div class="flex flex-col w-full">
	<!-- go back to organizations -->
	{#if $organization}
		<div class="flex w-full flex-col place-items-start gap-4 border-b p-4">
			<Breadcrumbs />
			{#if on_org_page}
				<div class="flex gap-4">
					<figure
						class="h-20 rounded-lg border border-b-4 p-2 shadow-sm"
						style:--org="org-image-{$organization.id}"
					>
						<img
							src="https://doodleipsum.com/700/outline?i=645d2db1f8992c831b3de908271f67e0"
							alt=""
							class="h-full w-full object-cover"
						/>
					</figure>
					<div>
						<span>
							<a
								class="break-all text-xl font-bold"
								href="/app/orgs/{$organization.id}"
								style:--org="org-name-{$organization.id}">{$organization.name}</a
							>
							<p>Owned by {$organization.owner.email}</p>
						</span>
					</div>
				</div>
			{/if}
		</div>
	{/if}
	<slot />
</div>

<style>
	div > * > figure {
		view-transition-name: var(--org);
	}
	div > * > span > a {
		view-transition-name: var(--org);
	}
</style>
