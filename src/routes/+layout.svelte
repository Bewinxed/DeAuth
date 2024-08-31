<script lang="ts">
	import DrawerWrapper from '$components/DrawerWrapper.svelte';
	import ViewTransition from '$components/ViewTransition.svelte';
	import { set_svetch } from '$lib/context';
	import '@fontsource/iosevka';
	import type { WalletAdapter } from '@solana/wallet-adapter-base';
	import { clusterApiUrl } from '@solana/web3.js';
	import {
		ConnectionProvider,
		WalletProvider
	} from '@bewinxed/wallet-adapter-svelte';
	import { WalletModalProvider } from '@bewinxed/wallet-adapter-svelte-ui';
	import { setWalletConnectVisible as set_wallet_connect_visible } from 'src/lib/components/context';
	import { onMount } from 'svelte';
	import { Toaster } from 'svelte-french-toast';
	import { themeChange } from 'theme-change';
	import '../app.css';
	import Drawer from './Drawer.svelte';
	import NavigationBar from './NavigationBar.svelte';

	const localStorageKey = 'walletAdapter';
	const network = clusterApiUrl('mainnet-beta'); // localhost or mainnet

	let wallets: WalletAdapter[] = [];

	// init svetch
	set_svetch();
	set_wallet_connect_visible();

	onMount(async () => {
		themeChange(false);

		const { PhantomWalletAdapter, SolflareWalletAdapter, LedgerWalletAdapter } =
			await import('@solana/wallet-adapter-wallets');

		const walletsMap = [
			new PhantomWalletAdapter(),
			new SolflareWalletAdapter(),
			new LedgerWalletAdapter()
		];

		wallets = walletsMap;
	});
</script>

<svelte:head>
	<title>DeAuth</title>
	<link
		rel="stylesheet"
		href="/css/clash-display.css"
	/>
	<link
		rel="stylesheet"
		href="/css/archivo.css"
	/>
</svelte:head>

<ViewTransition />
<ConnectionProvider
	config="{{}}"
	endpoint="{network}"
>
	<WalletProvider
		{localStorageKey}
		{wallets}
		autoConnect
	>
		<Toaster />
		<DrawerWrapper>
			<WalletModalProvider>
				<NavigationBar />
				<main class="sticky top-0 flex flex-1 overflow-x-clip">
					<Drawer />
					<!-- <div class="flex "> -->
					<slot />
					<!-- </div> -->
				</main>
			</WalletModalProvider>
		</DrawerWrapper>
	</WalletProvider>
</ConnectionProvider>

<!--translate 3d-->

<style>
	:global(.chonk) {
		transition: all 0.125s ease-in;
		box-shadow:
			0px 0.1em 0px 0px rgba(0, 0, 0, 0.2),
			inset 0px -0.2em 0px rgba(0, 0, 0, 0.3),
			inset 0px 0.15em 0px rgba(0, 0, 0, 0),
			inset 0px 0.25em 0px rgba(255, 255, 255, 0);
		/* spring animation */

		&:hover {
			@apply -translate-y-0.5;

			/* inner bottom white border */
			padding-bottom: 0.3em;
			box-shadow:
				0px 0.2em 0px 0px rgba(0, 0, 0, 0.2),
				inset 0px -0.45em 0px rgba(0, 0, 0, 0.2),
				inset 0px 0.15em 0px rgba(0, 0, 0, 0.4),
				inset 0px 0.35em 0px rgba(255, 255, 255, 0);

			&:active {
				@apply translate-y-0.5;
				padding-bottom: unset;
				box-shadow:
					0px 0.1em 0px 0px rgba(0, 0, 0, 0.2),
					inset 0px -0.1em 0px rgba(0, 0, 0, 0.4),
					inset 0px 0.15em 0px rgba(0, 0, 0, 0),
					inset 0px 0.25em 0px rgba(255, 255, 255, 0.3),
					0px 0px 0px 0.075em rgba(0, 0, 0, 0.5);
			}
		}
	}
</style>
