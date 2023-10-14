<script lang="ts">
	import { getDrawer } from '$components/context';
	import {
		getApplication,
		getOrganization,
		getOrganizations,
		setOrganization
	} from '$components/data_contexts';
	import { afterUpdate, onDestroy } from 'svelte';

	import Icon from '@iconify/svelte';
	import { page } from '$app/stores';
	const organization = getOrganization();
	const application = getApplication();
</script>

<div class="breadcrumbs text-sm">
	<ul class="flex-wrap gap-2">
		<li>
			<a
				href="/app"
				class="capitalize"
			>
				<figure class="inline">
					<Icon
						icon="carbon:home"
						class="mr-2 inline h-5 w-5"
					/>
				</figure>
				Home
			</a>
		</li>
		{#if $page.params.org_id}
			<li>
				<a
					href="/app/orgs/{$page.params.org_id}"
					class="capitalize"
				>
					<figure class="inline">
						<Icon
							icon="carbon:building"
							class="mr-2 inline h-5 w-5"
						/>
					</figure>
					{$organization?.name}
				</a>
			</li>
		{/if}
		{#if $page.params.app_id}
			<li>
				<a
					href="/app/orgs/{$organization?.id}/apps/{$page.params.app_id}"
					class="capitalize"
				>
					<figure class="inline">
						<Icon
							icon="carbon:application"
							class="mr-2 inline h-5 w-5"
						/>
					</figure>
					{$page.data.application.name}
				</a>
			</li>
		{/if}
		<!-- add the end of the url -->
		{#if $page.url.pathname.split($page.params.app_id).at(1)}
			<li>
				<a
					href="/app/orgs/{$organization?.id}/apps/{$page.params
						.app_id}{$page.url.pathname.split($page.params.app_id).at(1)}"
					class="capitalize"
				>
					<figure class="inline">
						<Icon
							icon="carbon:settings"
							class="mr-2 inline h-5 w-5"
						/>
					</figure>
					{$page.url.pathname
						.split(`${$page.params.app_id}/`)
						.at(1)
						?.replaceAll('_', ' ')}
				</a>
			</li>
		{/if}
	</ul>
</div>

<style>
</style>
