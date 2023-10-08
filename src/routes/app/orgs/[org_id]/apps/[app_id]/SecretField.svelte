<script lang="ts">
	import { page } from '$app/stores';
	import Icon from '@iconify/svelte';
	import PromiseButton from '$components/PromiseButton.svelte';
	import { get_svetch } from 'src/lib/context';
	import { clickToCopy, typewriter } from 'src/lib/utils/ui_helpers';
	import toast from 'svelte-french-toast';
	import { slide } from 'svelte/transition';

	export let title: string;
	export let id: 'access_token_secret' | 'refresh_token_secret';
	export let value: string | null;
	export let show: boolean;

	const svetch = get_svetch();

	$: visible_value = value ?? '****************************************';

	let copy_success = false;

	async function renew_secret() {
		value = null;
		await svetch
			.patch('app/orgs/:org_id/apps/:app_id/secrets', {
				path: {
					org_id: $page.params.org_id,
					app_id: $page.params.app_id
				},
				body: {
					access_token_secret: id === 'access_token_secret',
					refresh_token_secret: id === 'refresh_token_secret'
				}
			})
			.then(async (res) => {
				toast.success("Secret renewed, Please keep it safe and don't share it");
				if (res.data) {
					// destructure and assign
					await reveal_secret(res.data[id]);

					// reset after 4 seconds
					setTimeout(() => {}, 4000);
				} else {
					throw res.error;
				}
			});
	}

	async function reveal_secret(secret: string | undefined = undefined) {
		show = !show;
		// if (value) {
		// 	return;
		// }

		let new_secret: string | undefined = secret;

		if (!new_secret) {
			new_secret = await svetch
				.get('app/orgs/:org_id/apps/:app_id/secrets', {
					path: {
						org_id: $page.params.org_id,
						app_id: $page.params.app_id
					}
				})
				.then((res) => {
					if (res.data) {
						return res.data[id];
					} else {
						throw res.error;
					}
				});
		}

		if (new_secret) {
			// destructure and assign to simulate a typewriter effect
			show = true;
			await typewriter({
				string: new_secret,
				callback: (newString: string) => {
					value = newString;
				}
			});
		}
	}
</script>

<label
	class="label"
	for="refresh_token_secret"
>
	<span class="label-text capitalize">{title}</span>
</label>
<div class="join">
	<div class="input join-item input-bordered w-full p-1">
		<input
			{id}
			disabled
			aria-disabled="true"
			class:pt-3="{!show}"
			class:blur-[2px]="{!show}"
			type="text"
			name="{id}"
			placeholder=""
			class="input-disabled h-full w-full truncate rounded-md border bg-base-200 p-2 pr-6 font-[monospace] text-sm shadow-inner transition-all"
			bind:value="{visible_value}"
		/>
	</div>
	{#if show}
		<div transition:slide="{{ axis: 'x' }}">
			<button
				use:clickToCopy="{`#${id}`}"
				class="btn btn-neutral btn-outline join-item"
				on:blur="{async (e) => {
					const target = e.currentTarget;

					target.classList.toggle('btn-success');
					toast.success('Copied to clipboard');
					// show tooltip

					copy_success = true;
					// reset after 2 seconds
					setTimeout(() => {
						copy_success = false;
						target.classList.toggle('btn-success');
					}, 2000);
				}}"
			>
				<Icon
					icon="{copy_success ? 'carbon:checkmark' : 'carbon:copy'}"
					class=" inline"
				/>
			</button>
		</div>
	{/if}

	<PromiseButton
		icon="carbon:recycle"
		class="btn btn-outline join-item w-full"
		promise="{renew_secret}"
	></PromiseButton>

	<PromiseButton
		icon="{value ? 'carbon:view-off' : 'carbon:view'}"
		tooltip="Reveal"
		promise="{async () => {
			if (show && value) {
				show = false;
				value = null;
			} else {
				await reveal_secret();
			}
		}}"
		class="btn btn-neutral btn-outline join-item"
	></PromiseButton>
</div>
