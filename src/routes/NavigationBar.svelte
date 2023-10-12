<script>
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import Icon from '@iconify/svelte';
	import { WalletMultiButton } from '@svelte-on-solana/wallet-adapter-ui';
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
		class="navbar max-h-12 rounded-xl border border-gray-300 shadow bg-primary text-base-paper"
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
					class="menu dropdown-content rounded-box menu-sm z-[1] mt-3 w-52 bg-primary text-base-paper p-2 shadow"
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
				class="font-display btn btn-ghost text-xl normal-case">DeAuth</a
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
					<a href="/documentation">
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

	/* :global(
			.wallet-adapter-button.wallet-adapter-button-trigger,
			.wallet-adapter-button.wallet-adapter-button-trigger:hover,
			.wallet-adapter-button.wallet-adapter-button-trigger:active,
			.wallet-adapter-button.wallet-adapter-button-trigger:focus,
			.wallet-adapter-button.wallet-adapter-button-trigger:disabled,
			.wallet-adapter-button.wallet-adapter-button-trigger i,
			.wallet-adapter-button.wallet-adapter-button-trigger span
		) {
		all: initial;
	} */

	:global(html) {
		& * > div > .wallet-adapter-button {
			/* if not the only child */

			/* all: unset; */
			@apply btn btn-neutral btn-outline min-w-[5rem] flex-row flex-wrap place-content-center place-items-center border-solid border-solanapurple transition-all duration-300;

			&:has(i) {
				line-height: 0;
				font-size: 0;
			}

			@screen sm {
				&:has(i) {
					& {
						@apply w-full min-w-[5rem] px-4 text-sm text-neutral-content;
					}
				}
				& {
				}
			}

			&-trigger {
				@apply relative place-content-center place-items-center bg-neutral text-white shadow-solana-hover;

				justify-content: center !important;
				& span {
					@apply p-2 text-center align-middle;
					& svg {
						@apply h-full w-full stroke-1 text-white transition-all duration-300;
					}
					&:empty {
						@apply hidden;
					}
				}

				& i {
					@apply m-0;
					&:empty {
						@apply hidden;
					}
				}

				&:hover {
					background-color: unset;
					/* hover button */
					& svg {
						@apply animate-pulse text-white drop-shadow-glow-solanablue;
					}
					@apply -translate-x-1 -translate-y-1 border-oledblack bg-solanapurple shadow-solana;
					/* ::before wrapper */
				}
				&:active {
					background-color: unset;
					@apply -translate-x-0 -translate-y-0 scale-0 bg-solanapurple shadow-none drop-shadow-glow-solanagreen;
					/* & ::before {
							content: '';
							@apply absolute animate-ping rounded-full bg-solanapurple;
						} */
				}

				&:active::before {
					content: '';
					display: block;
					position: absolute;
					top: 0;
					left: 0;
					right: 0;
					bottom: 0;
					background: inherit;
					z-index: -1;
					@apply z-10 aspect-square w-[105%] animate-ping rounded-2xl bg-solanapurple opacity-25 blur-lg;
				}
			}

			&:not([disabled]):focus-visible {
				outline-color: white;
			}

			&:not([disabled]):hover {
				background-color: #1a1f2e;
			}

			&[disabled] {
				@apply btn-disabled;
			}

			&-end-icon,
			&-start-icon,
			&-end-icon img,
			&-start-icon img {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 24px;
				height: 24px;
			}

			&-end-icon {
				/* margin-left: 12px; */
				@apply mx-auto;
			}

			&-start-icon {
				all: unset;
				/* margin-right: 12px; */
				@apply mx-auto;
			}
		}

		& * .wallet-adapter-collapse {
			width: 100%;
		}

		& * .wallet-adapter-dropdown {
			position: relative;
			display: inline-block;

			&-list {
				@apply join;
				position: absolute;
				z-index: 99;
				display: grid;
				grid-template-rows: 1fr;
				grid-row-gap: 10px;
				padding: 10px;
				top: 100%;
				right: 0;
				margin: 0;
				list-style: none;
				background: #2c2d30;
				border-radius: 10px;
				box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.6);
				opacity: 0;
				visibility: hidden;
				transition:
					opacity 200ms ease,
					transform 200ms ease,
					visibility 200ms;
				font-family: 'DM Sans', 'Roboto', 'Helvetica Neue', Helvetica, Arial,
					sans-serif;

				&-active {
					opacity: 1;
					visibility: visible;
					transform: translateY(10px);
				}

				&-item {
					display: flex;
					flex-direction: row;
					justify-content: center;
					align-items: center;
					border: none;
					outline: none;
					cursor: pointer;
					white-space: nowrap;
					box-sizing: border-box;
					padding: 0 20px;
					width: 100%;
					border-radius: 6px;
					font-size: 14px;
					font-weight: 600;
					height: 37px;
					color: #fff;

					&:not([disabled]):hover {
						background-color: #1a1f2e;
					}
				}
			}
		}

		& * .wallet-adapter-modal-collapse-button {
			& svg {
				align-self: center;
				fill: #999;
			}

			&-active svg {
				transform: rotate(180deg);
				transition: transform ease-in 150ms;
			}
		}

		& * .wallet-adapter-modal {
			all: unset;
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			opacity: 0;
			background: rgba(0, 0, 0, 0);
			transition: background-opacity linear 300ms;
			z-index: 1040;
			overflow-y: auto;

			@apply animate-fade-in transition-all duration-500;

			&-list {
				@apply join join-vertical overflow-visible p-4;
				flex-direction: column;

				& li {
					all: unset;
					@apply overflow-visible;
				}

				& > :where(*:not(:first-child)) {
					margin-left: 0px;
					margin-right: 0px;
					margin-top: -1px;
				}

				& :first-child:not(:last-child),
				& *:first-child:not(:last-child) {
					border-bottom-left-radius: 0;
					border-bottom-right-radius: 0;
					border-top-left-radius: inherit;
					border-top-right-radius: inherit;
				}

				& :last-child:not(:first-child),
				& *:last-child:not(:first-child) {
					border-top-left-radius: 0;
					border-top-right-radius: 0;
					border-bottom-left-radius: inherit;
					border-bottom-right-radius: inherit;
				}

				& * .wallet-adapter-button {
					border: unset;
					@apply btn btn-primary btn-outline px-2 shadow-inner;
					border-color: #777 !important;
					display: inline-flex;
					border-radius: inherit;
				}
			}

			&-fade-in {
				background: rgba(0, 0, 0, 0.5);
				@apply bg-opacity-25;
			}

			&-button-close {
				@apply relative bg-transparent transition-transform;
				display: flex;
				align-items: center;
				justify-content: center;
				position: absolute;
				top: 18px;
				right: 18px;
				padding: 12px;
				cursor: pointer;
				border: none;
				border-radius: 50%;

				& svg {
					@apply hidden;
				}
			}

			&-button-close::before {
				content: '';
				@apply absolute bottom-0 left-0 right-0 top-0 h-full w-full border-neutral bg-local bg-center bg-no-repeat;
				animation-duration: 3s;
				background-image: url('data:image/svg+xml,%3Csvg xmlns="http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg" width="24" height="24" viewBox="0 0 32 32"%3E%3Cpath fill="currentColor" d="M17.414 16L24 9.414L22.586 8L16 14.586L9.414 8L8 9.414L14.586 16L8 22.586L9.414 24L16 17.414L22.586 24L24 22.586L17.414 16z"%2F%3E%3C%2Fsvg%3E');
				/* don't tile */
				background-repeat: no-repeat;
				/* center */
				background-position: center;
			}

			&-button-close:hover {
				@apply scale-125;
			}

			&-overlay {
				background: rgba(0, 0, 0, 0.5);
				position: fixed;
				top: 0;
				left: 0;
				bottom: 0;
				right: 0;
			}

			&-container {
				display: flex;
				margin: 3rem;
				min-height: calc(100vh - 6rem);
				align-items: center;
				justify-content: center;

				@media (max-width: 480px) {
					margin: 1rem;
					min-height: calc(100vh - 2rem);
				}
			}

			&-wrapper {
				@apply justify-start bg-base-100 text-base-content shadow-2xl;
				box-sizing: border-box;
				position: relative;
				display: flex;
				align-items: center;
				flex-direction: column;
				z-index: 1050;
				max-width: 400px;
				border-radius: 10px;

				font-family: 'DM Sans', 'Roboto', 'Helvetica Neue', Helvetica, Arial,
					sans-serif;
				flex: 1;
				& h1 {
					@apply font-sans text-2xl;
				}
			}

			&-title {
				@apply p-12 pt-16 text-left text-2xl text-base-content;
			}
		}
	}

	.wallet-connect {
		view-transition-name: 'wallet-connect';
	}
</style>
