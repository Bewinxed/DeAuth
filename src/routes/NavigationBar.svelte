<script>
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import Icon from '@iconify/svelte';
	import { WalletMultiButton } from '@bewinxed/wallet-adapter-svelte-ui';
	import DoodleIpsum from '$components/DoodleIpsum.svelte';
	import {
		getDrawer,
		getDrawerOpen,
		get_wallet_connect_visible
	} from '$components/context';
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';
	let scrollY = 0;
	const drawer = getDrawer();
	const drawer_open = getDrawerOpen();
	const wallet_connect_visible = get_wallet_connect_visible();
	// if scrolled 200px or more from the top
	$: scrolled = scrollY > 60;
	let mounted = false;

	// $: if ($wallet_connect_visible !== undefined) {
	// 	// @ts-ignore
	// 	if (document.startViewTransition) {
	// 		// @ts-ignore
	// 		console.log('navigation');
	// 		document.startViewTransition(async () => {
	// 			// DOM changes
	// 		});
	// 	}
	// }
	onMount(() => {
		mounted = true;
		$wallet_connect_visible = true;
	});
</script>

<svelte:window bind:scrollY />
<!-- <span class="absolute bottom-5 right-5">{scrollY}</span> -->

<nav
	class:!p-0="{scrolled}"
	class="sticky top-0 z-10 p-2 transition-all"
>
	<div
		class:rounded-t-none="{scrolled}"
		class="navbar max-h-12 rounded-xl border border-gray-300 bg-primary text-base-paper shadow"
	>
		<div class="navbar-start">
			{#if $drawer.length > 0}
				<div
					class=""
					transition:slide="{{ axis: 'x' }}"
				>
					<button
						tabindex="0"
						class="btn btn-ghost"
						on:click="{() => ($drawer_open = !$drawer_open)}"
					>
						<div
							class:rotate-180="{$drawer_open}"
							class="transition-transform duration-300"
						>
							<Icon
								icon="carbon:menu"
								class="inline h-6 w-6"
							/>
						</div>
					</button>
				</div>
			{/if}
			<div class="dropdown">
				<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
				<!-- svelte-ignore a11y-label-has-associated-control -->

				<label
					tabindex="0"
					class="btn btn-ghost menu-dropdown-toggle lg:hidden"
				>
					<Icon
						icon="carbon:chevron-down"
						class="inline h-6 w-6"
					/>
				</label>
				<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
				<ul
					tabindex="0"
					class="menu dropdown-content rounded-box menu-sm z-[1] mt-3 w-52 bg-primary p-2 text-base-paper shadow"
				>
					<li><a href="/app">App</a></li>
					<li>
						<a href="javascript:void(0)">Parent</a>
						<ul class="p-2">
							<li><a>Submenu 1</a></li>
							<li><a>Submenu 2</a></li>
						</ul>
					</li>
					<li><a>Item 3</a></li>
				</ul>
			</div>
			<a
				href="/"
				class="btn btn-ghost font-display text-xl normal-case">DeAuth</a
			>
		</div>
		<div class="navbar-center hidden lg:flex">
			<ul class="menu menu-horizontal sticky px-1">
				<li>
					<a href="/app">
						<Icon
							icon="carbon:application"
							class="inline h-4 w-4"
						/>
						App</a
					>
				</li>
				<li>
					<a href="/profile">
						<Icon
							icon="carbon:user-admin"
							class="inline h-4 w-4"
						/>
						Profile</a
					>
				</li>
				<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
				<li tabindex="0">
					<details>
						<summary>About</summary>
						<ul class="p-2">
							<li>
								<a href="/contact">
									<Icon
										icon="carbon:email"
										class="inline h-4 w-4"
									/>
									Contact Us</a
								>
							</li>
							<li>
								<a href="/faq">
									<Icon
										icon="carbon:help-desk"
										class="inline h-4 w-4"
									/>
									FAQ</a
								>
							</li>
						</ul>
					</details>
				</li>
				<li>
					<a href="https://bewinxed.gitbook.io/deauth.xyz/">
						<Icon
							icon="carbon:document"
							class="inline h-4 w-4"
						/>
						Docs</a
					>
				</li>
			</ul>
		</div>
		<div class="navbar-end">
			<div class="dropdown dropdown-end">
				<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
				<!-- svelte-ignore a11y-label-has-associated-control -->
				<label
					tabindex="0"
					class="avatar btn btn-circle btn-ghost"
				>
					<div class="w-10 rounded-full border shadow-inner">
						<img
							src="{$page.data.session?.user?.avatar_url ??
								'https://doodleipsum.com/200x200/avatar-5?i=e3718c21dc90e5c921bcd3d4b46821c7'}"
						/>
					</div>
				</label>
				<slot />
				<ul
					tabindex="0"
					class="menu dropdown-content rounded-box menu-sm z-[1] mt-3 w-52 bg-primary p-2 shadow"
				>
					<li>
						<a
							href="/profile"
							class="justify-between"
						>
							Profile
							<span class="badge">New</span>
						</a>
					</li>
					<li><a>Settings</a></li>
					<li>
						<a href="/login?redirect_uri={$page.url.pathname}"
							>Connect Account</a
						>
					</li>
					{#if $page.data.session}
						<form
							method="post"
							action="/?/logout"
							use:enhance
						>
							<!-- <input type="submit" value="Sign out" /> -->
							<li><button>Logout</button></li>
						</form>
					{/if}
				</ul>
			</div>
			{#if $wallet_connect_visible === true}
				<div
					id="wallet-connect-navigation"
					class="wallet-connect"
					style="view-transition-name: wallet-connect"
				>
					<WalletMultiButton
						><span>
							<figure class="h-6 w-6">
								<Icon
									icon="formkit:solana"
									class="h-6 w-6"
								/>
							</figure>
						</span></WalletMultiButton
					>
				</div>
			{/if}
			<!-- <a class="btn">Button</a> -->
		</div>
	</div>
</nav>

<style>
	nav {
		view-transition-name: navbar;
	}



	

	.wallet-connect {
		view-transition-name: 'wallet-connect';
	}
</style>
