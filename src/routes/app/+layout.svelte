<script lang="ts">
	import { getDrawer } from '$components/context';
	import { getOrganizations, setOrganizations } from '$components/data_contexts';
	import { afterUpdate, onDestroy, onMount } from 'svelte';
	import OrganizationDrawer from './orgs/OrganizationDrawer.svelte';
	

	export let data;

	const drawer = getDrawer();
	setOrganizations([...data.organizations]);

	const organizations = getOrganizations();

	const drawer_index = drawer.push(OrganizationDrawer, {
		organizations: organizations
	});

	afterUpdate(() => {
		$organizations = data.organizations;
	});

	onMount(() => {});

	onDestroy(() => {
		drawer_index ? drawer.remove(drawer_index) : '';
		drawer.pop();
	});
</script>



<div class="contents">
	<slot />
</div>