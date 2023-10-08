<script lang="ts">
	import { page } from '$app/stores';
	import Icon from '@iconify/svelte';
	import { getApplication, getOrganization, setApplication } from '$components/data_contexts';
	export let data;
	setApplication(data.application);
	console.log(data.application);
	const application = getApplication();
	const organization = getOrganization();
</script>

<div class="contents">
	<!-- go back to organizations -->
	{#if $application}
		<div class="flex w-full flex-col place-items-start gap-4 border-b p-4">
			<div class="flex gap-4">
				<figure
					class="h-20 rounded-lg border border-b-4 p-2 shadow-sm"
					style:--org="app-image-{$application.id}"
				>
					<img
						src="https://doodleipsum.com/700/abstract?i=bca1e8588e68e8c73a6b721edae668c9"
						alt=""
						class="h-full w-full object-cover"
					/>
				</figure>
				<div>
					<span>
						<a
							class="break-all text-xl font-bold"
							href="/app/{$organization?.id}/orgs/{$application.id}"
							style:--org="app-name-{$application.id}">{$application.name}</a
						>
						<p>Owned by {$organization.owner?.email}</p>
					</span>
				</div>
			</div>
		</div>
	{/if}
	<slot />
</div>

<style>
	figure {
		view-transition-name: var(--org);
	}
	span > a {
		view-transition-name: var(--org);
	}
</style>
