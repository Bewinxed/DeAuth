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
	} from '@svelte-on-solana/wallet-adapter-ui';
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
		themeChange(false)

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
<WalletProvider
	{localStorageKey}
	{wallets}
	autoConnect
/>
<ConnectionProvider {network} />
<Toaster />
<DrawerWrapper>
	<NavigationBar />
	<main class="sticky top-0 flex flex-1 overflow-x-clip ">
		<Drawer />
		<!-- <div class="flex "> -->
			<slot />
		<!-- </div> -->
	</main>
</DrawerWrapper>
