<script lang="ts">
	import { Stepper, makeStep } from '@efstajas/svelte-stepper';
	import { onMount, setContext } from 'svelte';
	import Connect from './auth_steps/Welcome.svelte';
	import { createUserProfileContext } from './store';
	import DoodleIpsum from 'src/lib/components/DoodleIpsum.svelte';
	import { fade, fly, scale, slide } from 'svelte/transition';
	import { getApplication } from 'src/lib/components/data_contexts';
	import { bounceInOut } from 'svelte/easing';
	import Sign from './auth_steps/Sign.svelte';
	import Profile from './auth_steps/Profile.svelte';
	import { walletStore } from '@svelte-on-solana/wallet-adapter-core';
	import Icon from '@iconify/svelte';
	import { page } from '$app/stores';
	import PrettyIcon from 'src/lib/components/PrettyIcon.svelte';

	let current_page = 0;

	const context = createUserProfileContext($page.data.session?.user ?? {});

	const user_context = setContext('user', context());

	const application = getApplication();

	const exampleSteps = [
		makeStep({
			component: Connect,
			props: undefined
		}),
		makeStep({
			component: Sign,
			props: undefined
		}),
		makeStep({
			component: Profile,
			props: undefined
		})
	];

	let mounted = false;

	onMount(() => {
		mounted = true;
	});
</script>

<!-- center in the middle of the screen -->

{#if mounted}
	<div
		transition:fly="{{ y: 200, x: 0, duration: 500, easing: bounceInOut }}"
		class="bg-brightness-75 relative mx-auto flex w-full flex-1 place-content-center place-items-center bg-[url('/layered-waves-haikei.svg')] bg-cover bg-bottom p-4 sm:p-16"
	>
		<!-- {#if mounted}
		<div transition:fade={{ delay: 300, duration: 300 }} class="absolute h-full w-full bg-neutral" />
	{/if} -->

		<div
			class="background-animate card card-normal w-full place-content-center place-items-center gap-0 rounded-xl bg-gradient-to-br from-solanapurple via-oledblack to-solanagreen p-1 shadow-xl shadow-solanapurple sm:w-3/4 lg:w-2/3 xl:w-2/4 2xl:w-2/5"
		>
			<div
				class="flex h-full w-full flex-1 flex-col place-content-center place-items-center justify-between rounded-lg bg-base-200"
			>
				{#if current_page > 0}
					<div
						class="w-full"
						transition:slide="{{ axis: 'y' }}"
					>
						<div
							class="flex w-full place-content-center place-items-center justify-between gap-4 p-2 shadow"
						>
							<PrettyIcon icon="carbon:login"></PrettyIcon>
							<div
								class="flex flex-row place-content-center place-items-center gap-2"
							>
								<div>
									<h2 class="text-xl font-bold capitalize">
										signing in to {$application.name}
									</h2>
									<span class="text-center text-sm"
										>User since {$application.created_at.toLocaleString(
											undefined,
											{
												timeStyle: 'short',
												dateStyle: 'short'
											}
										)}</span
									>
								</div>
								<figure class="h-8 w-8 rounded-full">
									{#if $application.branding?.logo}
										<img
											src="{$application.branding?.logo}"
											alt="{$application.name} logo"
											class="h-full w-full object-cover"
										/>
									{:else}
										<DoodleIpsum
											width="{600}"
											height="{600}"
											category="avatar 2"
											class="w-28 object-cover"
										/>
									{/if}
								</figure>
							</div>
						</div>

						{#if $walletStore.connected && $walletStore.publicKey}
							<div
								class="flex w-full flex-row place-content-center place-items-center justify-between gap-2 p-2 shadow"
							>
								<div class="transition-container">
									{#if current_page > 1}
										<figure
											in:fly="{{ x: 100, duration: 100, delay: 100 }}"
											out:fly="{{ x: -100, duration: 100 }}"
										>
											<PrettyIcon
												background_class="bg-success"
												icon="carbon:checkmark-outline"
											></PrettyIcon>
										</figure>
									{:else}
										<figure
											in:fly="{{ x: 100, duration: 100, delay: 100 }}"
											out:fly="{{ x: -100, duration: 100 }}"
										>
											<PrettyIcon icon="carbon:wallet"></PrettyIcon>
										</figure>
									{/if}
								</div>
								<code class="code truncate text-xs sm:text-sm"
									>{$walletStore.publicKey}</code
								>
							</div>
						{/if}
					</div>
				{:else}
					<div transition:slide="{{ axis: 'y' }}">
						<div
							class="relative flex w-full flex-col place-content-center place-items-center p-4"
						>
							<figure class="transition-container mx-auto overflow-hidden">
								{#if $application.branding?.logo}
									<img
										src="{$application.branding?.logo}"
										alt="{$application.name} logo"
										class="h-full w-full object-cover"
									/>
								{:else}
									<DoodleIpsum
										category="avatar 2"
										class="w-28 object-cover"
									/>
								{/if}
							</figure>
							<h2 class="text-xl font-bold capitalize">
								signing in to {$application.name}
							</h2>
							<span class="text-center text-sm"
								>User since {$application.created_at.toLocaleString(undefined, {
									timeStyle: 'short',
									dateStyle: 'short'
								})}</span
							>
						</div>
						<div class="flex flex-col gap-4 border-b p-4 sm:p-8">
							<!-- This will allow the developer of  -->
							<h2 class="text-base font-semibold uppercase">
								This will allow the developer of {$application.name} to:
							</h2>
							<div class="flex flex-col gap-4">
								<span class="">
									<Icon
										class="inline text-success"
										icon="carbon:checkmark-filled"
									></Icon>
									Access your previously connected
									<div
										class="badge badge-outline tooltip inline-flex gap-1 font-[monospace]"
										data-tip="This is your public wallet address, this doesn't give access to your wallet or funds"
									>
										<!-- info icon -->
										<Icon
											class="inline place-self-center"
											icon="carbon:information-filled"
										></Icon>
										wallet addresses
									</div>
									.
								</span>
								<span class="">
									<Icon
										class="inline text-success"
										icon="carbon:checkmark-filled"
									></Icon>
									Access your previously connected accounts' info such as discord,
									twitter, github, etc.
								</span>
								<span class="">
									<Icon
										class="inline text-error"
										icon="carbon:error-filled"
									></Icon>
									Access your account credentials, or have access to your funds.
								</span>
							</div>
						</div>
					</div>
				{/if}

				<!-- <div class="flex h-full w-full flex-1 flex-col"> -->
				<Stepper
					steps="{exampleSteps}"
					{context}
					on:stepChange="{(e) => {
						current_page = e.detail.newIndex;
						console.log('new page is' + current_page);
					}}"
				/>

				<div
					class="flex flex-col gap-4 border-t p-2 md:p-8"
					style="list-style-position: outside"
				>
					<div class="flex flex-row gap-1 p-1">
						<Icon
							class="inline h-8 w-8"
							icon="carbon:link"
						></Icon>
						<span class="text-sm">
							Once you authorize, you will be redirected outside of <span
								class="badge badge-outline inline-flex gap-1 place-self-center align-middle font-[monospace]"
							>
								<Icon icon="carbon:security"></Icon>
								DeAuth</span
							>
							to:
							<span
								class="badge badge-outline inline-flex gap-1 place-self-center align-middle font-[monospace]"
								>{$page.data.redirect_uri}</span
							>
						</span>
					</div>
					<div class="flex flex-row gap-1 p-1">
						<Icon
							class="inline h-8 w-8"
							icon="carbon:locked"
							height="1.5rem"
							width="1.5rem"
						></Icon>
						<span class="text-sm">
							You will be able to revoke access to your account at any time by
							visiting the <span
								class="badge badge-outline inline-flex gap-1 place-self-center align-middle font-[monospace]"
							>
								<Icon icon="carbon:locked"></Icon>
								DeAuth</span
							>
							website.
						</span>
					</div>
					<div class="flex flex-row gap-1 p-1">
						<Icon
							class="inline h-8 w-8"
							icon="carbon:security"
							height="1.5rem"
							width="1.5rem"
						></Icon>
						<span class="text-sm">
							This application cannot access your funds or secure credentials <span
								class="badge badge-outline inline-flex gap-1 place-self-center align-middle font-[monospace]"
							>
								<Icon icon="carbon:locked"></Icon>
								DeAuth</span
							>
							website.
						</span>
					</div>
				</div>

				<!-- </div> -->
			</div>
		</div>
	</div>
{/if}

<style lang="postcss">
	:global(html) {
		background-color: theme(colors.gray.100);
	}

	.background-animate {
		background-size: 400%;

		-webkit-animation: AnimationName 3s ease infinite;
		-moz-animation: AnimationName 3s ease infinite;
		animation: AnimationName 3s ease infinite;
	}

	@keyframes AnimationName {
		0%,
		100% {
			background-position: 0% 50%;
		}
		50% {
			background-position: 100% 50%;
		}
	}
</style>
