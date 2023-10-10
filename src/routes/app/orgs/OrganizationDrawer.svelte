<script lang="ts">
	import { page } from '$app/stores';
	import AutoHiddenIcon from '$components/AutoHiddenIcon.svelte';
	import Collapsible from '$components/Collapsible.svelte';
	import type { getOrganizations } from '$components/data_contexts';
	import { flip } from 'svelte/animate';
	import { fly } from 'svelte/transition';
	// export let organization: ReturnType<typeof getOrganization>;
	export let organizations: ReturnType<typeof getOrganizations>;
</script>

{#each $organizations ?? [] as org (org.id)}
	{@const org_active = org.id === $page.params.org_id}
	<div
		class:!rounded-b-none="{org_active || $organizations.length === 1}"
		class="w-full first:rounded-t-xl last:rounded-b-xl"
		animate:flip
		transition:fly|local="{{ y: -50 }}"
	>
		<Collapsible
			btn_classes="{org_active ? 'bg-base-200' : ''}"
			class="rounded-[inherit] hover:bg-[--bc]"
			open="{org_active}"
		>
			<svelte:fragment slot="title">
				<AutoHiddenIcon
					icon="carbon:building"
					href="/app/orgs/{org.id}"
					class="w-full rounded-[inherit]"
				>
					{org.name}
				</AutoHiddenIcon>
			</svelte:fragment>
			<div
				class="flex flex-col rounded-xl rounded-t-none border text-base-content shadow-inner md:p-1 pt-1"
			>
				{#if org.applications.length === 0}
					<!-- empty state -->
					<!-- <div
						class="place-content-start place-items-start rounded-xl border border-gray-300 shadow-inner"
					> -->
					<AutoHiddenIcon
						icon="mingcute:border-blank-line"
						href="/app/orgs/{org.id}"
						class="rounded-xl"
					>
						Create an application
					</AutoHiddenIcon>
					<!-- </div> -->
				{:else}
					<!-- <div
						class="place-content-start place-items-start rounded-xl border border-gray-300 shadow-inner"
					> -->
					<div class="md:shadow-inner rounded-2xl p-0.5">
						{#each org?.applications as application (application.id)}
							{@const app_active = application.id === $page.params.app_id}
							<div
								class:!rounded-b-none={app_active}
								class="rounded-none first:rounded-t-xl last:rounded-b-xl only:rounded-b-none"
								animate:flip
								transition:fly|local="{{ y: -50 }}"
							>
								<Collapsible
									btn_classes="{app_active ? 'bg-base-200' : ''}"
									class="rounded-[inherit] hover:bg-[--bc] "
									open="{app_active}"
								>
									<svelte:fragment slot="title">
										<AutoHiddenIcon
											icon="carbon:application"
											href="/app/orgs/{org.id}/apps/{application.id}"
											class="rounded-[inherit]"
										>
											{application.name}
										</AutoHiddenIcon>
									</svelte:fragment>
									<div class="rounded-b-xl border shadow-inner">
										<AutoHiddenIcon
											icon="carbon:rule"
											href="/app/orgs/{org.id}/apps/{application.id}#auth-rules"
											class="btn-sm rounded-none first:rounded-none last:rounded-b-xl"
											>Auth Rules</AutoHiddenIcon
										>
										<!-- access tokens -->
										<AutoHiddenIcon
											icon="carbon:ibm-cloud-key-protect"
											href="/app/orgs/{$page.params
												.org_id}/apps/{application.id}#secrets"
											class="btn-sm rounded-none first:rounded-t-xl last:rounded-b-xl"
											>Access Tokens</AutoHiddenIcon
										>
										<AutoHiddenIcon
											icon="carbon:user-role"
											href="/app/orgs/{$page.params
												.org_id}/apps/{application.id}#roles"
											class="btn-sm rounded-none first:rounded-none last:rounded-b-xl"
											>User Roles</AutoHiddenIcon
										>
										<AutoHiddenIcon
											icon="carbon:link"
											href="/app/orgs/{$page.params
												.org_id}/apps/{application.id}#redirect-urls"
											class="btn-sm rounded-none first:rounded-t-xl last:rounded-b-xl"
											>Redirect URLs</AutoHiddenIcon
										>
										<AutoHiddenIcon
											icon="carbon:document"
											href="/app/orgs/{$page.params
												.org_id}/apps/{application.id}#login-log"
											class="btn-sm rounded-none first:rounded-t-xl last:rounded-b-xl"
											>Login Log</AutoHiddenIcon
										>
										<div class="px-2 border-t"></div>
										<AutoHiddenIcon
											icon="carbon:cloud-logging"
											href="/app/orgs/{$page.params
												.org_id}/apps/{application.id}/access_control"
											class="btn-sm rounded-none first:rounded-t-xl last:rounded-b-xl"
											>Permissions</AutoHiddenIcon
										>
										<AutoHiddenIcon
											icon="carbon:network-admin-control"
											href="/app/orgs/{$page.params
												.org_id}/apps/{application.id}/sessions"
											class="btn-sm rounded-none first:rounded-t-xl last:rounded-b-xl"
											>Sessions</AutoHiddenIcon
										>
									</div>
								</Collapsible>

								<!-- icons for  -->
							</div>
						{/each}
					</div>
					<div class="divider my-0"></div>
					<AutoHiddenIcon
						icon="carbon:settings"
						href="/app/settings"
						class="rounded-none first:rounded-t-xl last:rounded-b-xl"
						>Organization Settings</AutoHiddenIcon
					>
					<!-- </div> -->
				{/if}
			</div>
		</Collapsible>
	</div>
{/each}
