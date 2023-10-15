<script>
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	let x = 50;
	let y = 50;
	let xSpeed = 2;
	let ySpeed = 2;
	let width = 100;
	let height = 50;
	let containerWidth;
	let containerHeight;

	onMount(() => {
		containerWidth = document.body.clientWidth;
		containerHeight = document.body.clientHeight;

		const animate = () => {
			x += xSpeed;
			y += ySpeed;

			if (x + width > containerWidth || x < 0) xSpeed = -xSpeed;
			if (y + height > containerHeight || y < 0) ySpeed = -ySpeed;

			requestAnimationFrame(animate);
		};

		animate();
	});
</script>

<svelte:window
	bind:innerHeight="{containerHeight}"
	bind:innerWidth="{containerWidth}"
/>

<div
	class="relative flex h-screen w-screen items-center justify-center bg-gray-800 text-white"
>
	<div
		class="dvd-logo rounded bg-blue-500 p-4"
		style="--x: {x}px; --y: {y}px; --width: {width}px; --height: {height}px;"
	>
		{$page.status}
	</div>
	<p class="absolute bottom-4 left-4">{$page.error.message}</p>
</div>

<style>
	.dvd-logo {
		position: absolute;
		width: var(--width);
		height: var(--height);
		transform: translate(var(--x) px, var(--y) px);
		transition: transform 0.01s linear;
	}
</style>
