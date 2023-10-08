<script lang="ts">
	import { page } from '$app/stores';
	import EmptyState from '$components/EmptyState.svelte';
	import PrettyIcon from '$components/PrettyIcon.svelte';
	import PromiseButton from '$components/PromiseButton.svelte';
	import { getApplication } from '$components/data_contexts';
	import Icon from '@iconify/svelte';
	import { get_svetch } from 'src/lib/context';
	import { object_entries } from 'src/lib/utils/object_helpers';
	import { provider_icons } from 'src/lib/utils/ui_helpers';
	import { flip } from 'svelte/animate';
	import { fly } from 'svelte/transition';

	const application = getApplication();
	

	const svetch = get_svetch();
</script>

<header
	id="{$$restProps.id}"
	style:--org="app-setting-header"
	class="flex w-full flex-col justify-between gap-2 p-4"
>
	<div class="flex place-content-start place-items-center justify-between">
		<div class="flex flex-row place-content-start place-items-center gap-2">
			<PrettyIcon icon="carbon:rule"></PrettyIcon>
			<h1 class="text-xl font-bold">Authentication Rules</h1>
		</div>
		<div class="dropdown dropdown-end dropdown-hover">
			<label
				for="dropdown-1"
				class="btn btn-outline"
			>
				<Icon
					icon="carbon:add"
					class="inline"
				/>
			</label>
			<ul
				id="dropdown-1"
				class="menu dropdown-content join rounded-box z-[1] w-52 gap-1 border bg-base-100 p-2 shadow"
			>
				{#each object_entries(provider_icons).filter(([provider, icon]) => !$application.authentication_rule.find((r) => r.provider === provider)) as [provider, icon] (provider)}
					<li
						animate:flip
						transition:fly
					>
						<button
							class="flex place-content-start place-items-center gap-2"
							on:click|preventDefault="{() => {
								svetch
									.put('app/orgs/:org_id/apps/:app_id/auth_rules', {
										path: {
											app_id: $page.params.app_id,
											org_id: $page.params.org_id
										},
										body: {
											is_required: false,
											provider: provider
										}
									})
									.then((res) => {
										if (res.data) {
											$application.authentication_rule = [
												...$application.authentication_rule,
												res.data
											];
										}
									});
							}}"
						>
							<Icon
								{icon}
								class="h-4 w-4"
							></Icon>
							<span>{provider}</span>
						</button>
					</li>
				{/each}
			</ul>
		</div>
	</div>

	<p class="text-sm italic">
		By selecting from the list of oAuth providers, you can give your users more
		options to authenticate with, you can also set some as required, users won't
		be authenticated unless they have at all of the required providers.
	</p>

	<!-- <figure class="w-4 h-4 inline text-base-content"><Icon icon="carbon:chevron-right" class="h-4 w-4"></Icon></figure> -->
</header>
<div class="flex flex-col gap-2 p-4">
	{#if $application.authentication_rule.length === 0}
		<EmptyState
			icon="carbon:two-factor-authentication"
			item_name="Auth Provider"
		></EmptyState>
	{:else}
		<div class="flex flex-wrap place-content-start gap-2">
			{#each $application.authentication_rule as auth_rule (auth_rule.id)}
				<div
					animate:flip
					transition:fly
					class="flex w-full justify-between rounded-lg border border-b-2 px-4 py-2 shadow"
				>
					<span class="inline-flex place-items-center gap-2">
						<Icon
							icon="{provider_icons[auth_rule.provider]}"
							class="mr-1 inline"
						/>
						{auth_rule.provider}
					</span>

					<!-- created at -->
					<div class="card">
						<div class="flex place-content-center place-items-center gap-2">
							<div class="card-actions place-content-center place-items-center">
								<div
									class="form-control tooltip tooltip-left"
									data-tip="If required, users cannot authenticate without authenticating into this provider"
								>
									<label class="label cursor-pointer gap-2">
										<span class="label-text">Required?</span>
										<input
											type="checkbox"
											class="toggle"
											checked
											on:input="{(e) => {
												if (!(e.target instanceof HTMLInputElement)) return;
												svetch
													.patch('app/orgs/:org_id/apps/:app_id/auth_rules', {
														path: {
															app_id: $page.params.app_id,
															org_id: $page.params.org_id
														},
														query: {
															id: auth_rule.id
														},
														body: {
															id: auth_rule.id,
															is_required: e.target.checked
														}
													})
													.then((res) => {
														if (res.data) {
															$application.authentication_rule =
																$application.authentication_rule.map((r) => {
																	if (r.id === auth_rule.id && res.data) {
																		return res.data;
																	}
																	return r;
																});
														}
													});
											}}"
										/>
									</label>
								</div>
								<PromiseButton
									confirm="{1}"
									icon="carbon:trash-can"
									class="btn btn-square btn-error btn-sm"
									tooltip="{'delete'}"
									promise="{async () => {
										await svetch
											.delete('app/orgs/:org_id/apps/:app_id/auth_rules', {
												path: {
													app_id: $page.params.app_id,
													org_id: $page.params.org_id
												},
												query: {
													id: auth_rule.id
												}
											})
											.then((res) => {
												if (res.data) {
													$application.authentication_rule =
														$application.authentication_rule.filter(
															(r) => r.id !== auth_rule.id
														);
												} else {
													throw res.error;
												}
											});
									}}"
								></PromiseButton>
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	header {
		view-transition-name: var(--org);
	}
</style>
