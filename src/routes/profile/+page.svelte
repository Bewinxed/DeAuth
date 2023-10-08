<script lang="ts">
	import { get_svetch } from 'src/lib/context.js';
	import PrettyIcon from 'src/lib/components/PrettyIcon.svelte';
	import { onMount } from 'svelte';
	import { walletStore } from '@svelte-on-solana/wallet-adapter-core';
	import toast from 'svelte-french-toast';
	import { goto } from '$app/navigation';
	export let data;
	const { user, auth_request } = data;

	let user_to_connect;
	let public_key_input = '';
	const svetch = get_svetch();

	const connectExistingUser = async () => {
		if (!$walletStore.publicKey) return;
		await goto(`api/login/solana?public_key=${$walletStore.publicKey}`, {});
	};

	onMount(async () => {
		if (auth_request) {
			// wait until the wallet is connected
			while (!$walletStore.connected) {
				await new Promise((resolve) => setTimeout(resolve, 1000));
			}

			// send the auth request to the server
			const response = await svetch.post('api/user/:user_id', {
				path: {
					user_id: user.id
				},
				body: auth_request
			});
		}
	});
</script>

<main class="w-full p-2">
	<header
		class="flex justify-between"
		style="--org=page-content-header"
	>
		<div class="flex place-content-start place-items-center gap-2">
			<PrettyIcon icon="carbon:user"></PrettyIcon>
			<h1 class="text-xl font-bold">Organizations</h1>
		</div>
	</header>
	<div
		class="flex min-h-screen flex-col justify-center bg-gray-100 py-6 sm:py-12"
	>
		<div class="relative py-3 sm:mx-auto sm:max-w-xl">
			<div
				class="relative bg-white px-4 py-10 shadow-lg sm:rounded-3xl sm:p-20"
			>
				<div class="mx-auto max-w-md">
					<div class="divide-y divide-gray-200">
						<div
							class="space-y-4 text-base leading-6 text-gray-700 sm:text-lg sm:leading-7"
						>
							<!-- Connected Accounts Section -->
							<div>
								<h2 class="text-xl font-semibold">Connected Accounts</h2>
								{#if user.key.length === 0}
									<p>No connected accounts</p>
								{:else}
									<ul class="list-disc pl-5">
										{#each user.key as account}
											{@const [provider, account_id] = account.id.split(':')}
											<li>{provider} - {account_id}</li>
										{/each}
									</ul>
								{/if}
							</div>
							<!-- Connect Existing User Section -->
							<div class="pt-6">
								<h2 class="text-xl font-semibold">Connect Existing User</h2>
							</div>
							<!-- Roles Section -->
							<div class="pt-6">
								<h2 class="text-xl font-semibold">Roles</h2>
								{#if user.memberships.length === 0}
									<p>No roles assigned</p>
								{:else}
									<ul class="list-disc pl-5">
										{#each user.memberships as memberships}
											<li>{memberships.id}</li>
										{/each}
									</ul>
								{/if}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</main>
