<script lang="ts">
	import { onMount } from 'svelte';
	export let num_stars: number = 100;
	export let velocity: number = 0.1;
	export let star_color: string = '#FFF';
	export let background_color: string = '#000';

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
	let stars: { x: number; y: number; size: number; speed: number }[] = [];

	function random(min: number, max: number): number {
		return Math.random() * (max - min) + min;
	}

	$: {
		for (const star of stars) {
			star.speed = random(0.01, 0.05) * velocity;
		}
	}

	onMount(() => {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		ctx = canvas.getContext('2d')!;
		const centerX = window.innerWidth / 2;
		const centerY = window.innerHeight / 2;

		for (let i = 0; i < num_stars; i++) {
			stars.push({
				x: random(0, window.innerWidth),
				y: random(0, window.innerHeight),
				size: random(0.5, 1.5),
				speed: random(0.01, 0.05)
			});
		}

		function draw() {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.fillStyle = background_color;
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			ctx.fillStyle = star_color;

			for (const star of stars) {
				star.x += (star.x - centerX) * star.speed * velocity;
				star.y += (star.y - centerY) * star.speed * velocity;

				if (
					star.x < 0 ||
					star.x > window.innerWidth ||
					star.y < 0 ||
					star.y > window.innerHeight
				) {
					star.x = random(0, window.innerWidth);
					star.y = random(0, window.innerHeight);
					star.speed = random(0.01, 0.05);
				}

				ctx.beginPath();
				ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
				ctx.fill();
			}

			requestAnimationFrame(draw);
		}

		draw();
	});
</script>

<canvas
	bind:this="{canvas}"
	class="fixed left-0 top-0 z-0 h-screen w-screen pointer-events-none"
></canvas>
