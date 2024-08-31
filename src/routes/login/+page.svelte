<script lang="ts">
	import { goto } from '$app/navigation';
	import { onDestroy, onMount } from 'svelte';

	import Starfield from '$components/Starfield.svelte';
	import PromiseButton from 'src/lib/components/PromiseButton.svelte';
	import { bounceInOut } from 'svelte/easing';
	import { tweened } from 'svelte/motion';

	export let data;

	const { app_id, redirect_uri } = data;

	let x = 0;
	let y = 0;

	const velocity = tweened(0.25, {
		duration: 100,
		easing: bounceInOut
	});

	let innerWidth: number;
	let innerHeight: number;

	let signInDiv: HTMLElement;

	onMount(() => {
		document.addEventListener('mousemove', (e) => {
			handleMouseMove(e);
			const x = e.clientX;
			const y = e.clientY;

			if (signInDiv) {
				const rect = signInDiv.getBoundingClientRect();
				if (rect) {
					const btnCenterX = rect.left + rect.width / 2;
					const btnCenterY = rect.top + rect.height / 2;

					const distance = Math.sqrt(
						(x - btnCenterX) ** 2 + (y - btnCenterY) ** 2
					);
					const max_distance = Math.sqrt(innerWidth ** 2 + innerHeight ** 2);

					// Base velocity scaling
					$velocity = 0.25 + 0.25 * Math.pow(1 - distance / max_distance, 4);

					// If you're more than halfway close to the div, speed up slightly
					if (distance < max_distance * 0.3) {
						$velocity += 0.8;
					}
				}
			}
		});
	});

	function handleMouseMove(event: MouseEvent) {
		x = event.clientX - innerWidth / 2;
		y = event.clientY - innerHeight / 2;
	}

	onDestroy(() => {
		// document.removeEventListener('mousemove', () => {});
	});
</script>

<svelte:window
	bind:innerWidth
	bind:innerHeight
/>

<!-- Add a canvas for the starfield effect -->
<Starfield
	num_stars="{400}"
	bind:velocity="{$velocity}"
	star_color="#FFF"
	background_color="#000"
/>

<div
	class="z-10 flex h-full w-full flex-col place-content-center place-items-center gap-8"
>
	<div class="relative h-20 w-80">
		<h1
			class="absolute left-0 top-0 z-10 bg-gradient-to-br from-solanapurple via-solanablue to-solanagreen bg-clip-text font-display text-[5rem] font-black text-transparent text-white shadow-primary drop-shadow-lg"
			style="transform: translate(${x * 0.01}px, ${y * 0.01}px);"
		>
			DeAuth
		</h1>
		<h1
			class="absolute left-0.5 top-0 z-10 font-display text-[4.9rem] font-black text-white drop-shadow-glow-solanablue"
			style="transform: translate(${x * 0.01}px, ${y * 0.01}px);"
		>
			DeAuth
		</h1>
	</div>
	<div class="relative h-20 w-80">
		<h1
			class="absolute left-0 top-0 z-10 bg-gradient-to-br from-solanapurple via-solanablue to-solanagreen bg-clip-text text-center font-sans text-xl font-black text-transparent text-white shadow-primary drop-shadow-lg"
		>
			Your secure portal to web3
		</h1>
		<h1
			class="absolute left-0 top-0 z-10 text-center font-sans text-xl font-black text-white drop-shadow-glow-solanablue"
		>
			Your secure portal to web3
		</h1>
	</div>
	<div
		bind:this="{signInDiv}"
		class="background-animate card card-normal flex h-fit w-fit flex-col place-content-center place-items-center items-center justify-center gap-0 rounded-xl bg-gradient-to-br from-solanapurple via-oledblack to-solanagreen p-1 shadow-xl shadow-solanapurple sm:w-3/4 md:w-1/2 lg:w-2/3 xl:w-2/4 2xl:w-2/5"
	>
		<div
			class="flex h-full w-full flex-col place-content-center place-items-center gap-2 rounded-lg bg-base-200 px-4 py-8 text-base-content"
		>
			<h1 class="mb-4 font-sans text-2xl font-bold">Welcome back</h1>
			<PromiseButton
				class="btn btn-neutral"
				icon="formkit:solana"
				promise="{async () => {
					await fetch('/api/login/solana', {}).then(async (res) => {
						if (res.ok) {
							await goto(await res.text());
						}
					});
				}}"
			>
				Sign in with Solana</PromiseButton
			>
			<PromiseButton
				class="btn btn-primary border-[#7289da] bg-[#7289da]"
				icon="akar-icons:discord-fill"
				promise="{async () => {
					await fetch('/api/login/discord', {}).then(async (res) => {
						if (res.ok) {
							await goto(await res.text());
						}
					});
				}}"
			>
				Sign in with Discord</PromiseButton
			>
		</div>
	</div>
</div>

<!-- Add Tailwind classes for styling -->
<style>
	.background-animate {
		background-size: 400%;

		-webkit-animation: rotateBackground 3s ease infinite;
		-moz-animation: rotateBackground 3s ease infinite;
		animation: rotateBackground 3s ease infinite;
	}

	/* html {
		background-color: black;
	} */

	@keyframes rotateBackground {
		0%,
		100% {
			background-position: 0% 50%;
		}
		50% {
			background-position: 100% 50%;
		}
	}
</style>
