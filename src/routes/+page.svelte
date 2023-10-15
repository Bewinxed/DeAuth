<!-- src/routes/index.svelte -->
<script lang="ts">
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';
	import { quintIn } from 'svelte/easing';
	import { fly } from 'svelte/transition';
	let mounted = false;
	let cta_hovered = false;
	let scrollY = 0;

	function getOffsetTop(element: HTMLElement) {
		let offsetTop = 0;
		while (element) {
			offsetTop += element.offsetTop;
			element = element.offsetParent;
		}
		return offsetTop;
	}

	function onScroll(
		node: HTMLElement,
		{ scrollY, target }: { scrollY?: number; target?: string }
	) {
		let offset: number;
		if (target) {
			const targetElement = document.querySelector(
				target
			) as HTMLElement | null;
			if (targetElement) {
				offset = getOffsetTop(targetElement);
				// console.log(offset);
			} else {
				console.error('Element with specified ID not found');
				return;
			}
		}

		if (scrollY) {
			offset = scrollY;
		}

		const updateVisibility = () => {
			const isVisible = window.scrollY < offset * 0.5;
			node.style.opacity = isVisible ? '1' : '0';
		};

		updateVisibility();
		window.addEventListener('scroll', updateVisibility);

		return {
			destroy() {
				window.removeEventListener('scroll', updateVisibility);
			}
		};
	}

	function hoverAction(node: HTMLElement) {
		function handleMouseEnter() {
			cta_hovered = true;
			console.log('Mouse entered:', cta_hovered);
		}

		function handleMouseLeave() {
			cta_hovered = false;
			console.log('Mouse left:', cta_hovered);
		}

		node.addEventListener('mouseenter', handleMouseEnter);
		node.addEventListener('mouseleave', handleMouseLeave);

		return {
			destroy() {
				node.removeEventListener('mouseenter', handleMouseEnter);
				node.removeEventListener('mouseleave', handleMouseLeave);
			}
		};
	}

	let mouseX = 0;
	let mouseY = 0;

	function mousePosition(node: HTMLElement) {
		function handleMouseMove(event: MouseEvent) {
			mouseX = event.clientX;
			mouseY = event.clientY;
		}

		node.addEventListener('mousemove', handleMouseMove);

		return {
			destroy() {
				node.removeEventListener('mousemove', handleMouseMove);
			}
		};
	}

	onMount(() => {
		mounted = true;
		// add hover listener to cta
	});
</script>

<svelte:head>
	<title>DeAuth - Decentralized OAuth Service</title>
</svelte:head>

<svelte:window
	use:mousePosition
	bind:scrollY
/>

<div
	data-theme="{cta_hovered ? 'dark' : ''}"
	class:invert="{cta_hovered}"
	class="w-full transition-all duration-500"
>
	<main
		class="container mx-auto my-auto flex w-full snap-y snap-mandatory flex-col gap-8 p-4"
	>
		<section
			id="landing"
			class="container relative min-h-screen snap-center py-8"
		>
			<div class="flex w-full flex-col place-content-center place-items-center">
				<span
					class="text-center font-display text-[5rem] font-semibold sm:text-[10rem] md:text-[12rem] lg:text-[16rem] xl:text-[20rem]"
					>DeAuth.</span
				>
				<div class="h-fit rounded-full px-8 py-4 text-base-content underline">
					<span
						class="text-center text-[1rem] font-semibold sm:text-[2rem] md:text-[1rem] lg:text-[2rem]"
						>Your all-in-one auth solution for web3 & beyond</span
					>
				</div>
			</div>
			<div
				class="flex w-full flex-col place-content-center place-items-center gap-8 px-28"
			>
				{#if mounted}
					<span
						transition:fly="{{
							delay: 100,
							duration: 500,
							y: 300,
							easing: quintIn
						}}"
						class="text-left font-serif text-lg font-semibold"
						>Have you been trying to implement web3 login? with social login?
						signing messages? ledger support? security?<br /></span
					>
					<span
						transition:fly="{{
							delay: 500,
							duration: 500,
							y: 300,
							easing: quintIn
						}}"
						class="">Are you <span class="font-black">sick</span> of it?</span
					>
					<span
						transition:fly="{{
							delay: 1000,
							duration: 500,
							y: 300,
							easing: quintIn
						}}"
					>
						<!-- getting sick of  -->

						<button
							on:click="{() => {
								// smooth scroll to features
								const features = document.getElementById('features');
								if (features) {
									// scroll 100px above
									features.scrollIntoView({
										behavior: 'smooth',
										block: 'start',
										inline: 'nearest'
									});
								}
							}}"
							class="chonk btn btn-primary btn-lg btn-wide animate-float rounded-full font-display hover:drop-shadow-glow-solanablue"
						>
							YES 😭</button
						>
					</span>
				{/if}
			</div>
			<div
				class="absolute bottom-[10%] left-1/2 right-1/2 mx-auto w-fit -translate-x-1/2"
			>
				<button
					use:onScroll="{{
						target: '#features'
					}}"
					on:click="{() => {
						// smooth scroll to features
						const features = document.getElementById('features');
						if (features) {
							// scroll 100px above
							features.scrollIntoView({
								behavior: 'smooth',
								block: 'start',
								inline: 'nearest'
							});
						}
					}}"
					class="chonk btn btn-circle btn-neutral btn-outline animate-float rounded-full"
				>
					<Icon
						icon="carbon:chevron-down"
						class="inline"
					/>
				</button>
			</div>
		</section>
		<!-- bento card grids -->
		<section
			id="features"
			class="relative flex min-h-screen w-full snap-center flex-col gap-8 py-8"
		>
			<!-- features title -->
			<header
				class="flex w-full flex-col place-content-center place-items-center"
			>
				<!-- up button -->
				<div
					id="features-up-button"
					class="absolute left-1/2 right-1/2 top-[2%] mx-auto w-fit -translate-x-1/2"
				>
					<button
						on:click="{() => {
							// scroll to top of page
							window.scrollTo({
								top: 0,
								behavior: 'smooth'
							});
						}}"
						class="chonk btn btn-circle btn-neutral btn-outline animate-float rounded-full"
					>
						<Icon
							icon="carbon:chevron-up"
							class="inline"
						/>
					</button>
				</div>

				<span
					class="text-center font-display text-[5rem] font-semibold sm:text-[9rem] md:text-[10rem] lg:text-[14rem] xl:text-[16rem]"
					>Features.</span
				>
				<div class="h-fit rounded-full px-8 py-4 text-base-content underline">
					<span
						class="text-center text-[1rem] font-semibold sm:text-[2rem] md:text-[1rem] lg:text-[2rem]"
						>DeAuth is packed with features to make your life easier.</span
					>
				</div>
			</header>
			<!-- huge card for title -->
			<div class="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
				<div class="card-body rounded-3xl bg-neutral p-8 text-neutral-content">
					<!-- <figure class="h-10">
					<Icon
						icon="carbon:security"
						class="h-full w-full"
					/>
				</figure> -->
					<h2 class="card-title">
						<Icon
							icon="carbon:security"
							class="inline"
						/>Effortless Security
					</h2>
					<div class="card-body gap-4 p-1">
						<p>
							Deauth allows you to let your users to authenticate with their
							web3 wallets, without having to implement it yourself.
						</p>
						<p>
							Security best practices, Phantom Sign in, Ledger support is all
							built in.
						</p>
					</div>
				</div>
				<!-- card for description -->
				<div
					class="group card-body place-content-center rounded-3xl border bg-base-200 p-8 text-base-content"
				>
					<!-- <figure class="h-10">
					<Icon
						icon="carbon:security"
						class="h-full w-full"
					/>
				</figure> -->
					<h2 class="card-title">
						<Icon
							icon="carbon:settings-adjust"
							class="inline"
						/>
						Manageable
					</h2>
					<div class="card-body gap-4 p-1">
						<ul
							class="menu rounded-box menu-sm w-56 transition-all group-hover:menu-md"
						>
							<li class="transition-all">
								<!-- no href -->
								<a
									class="transition-all"
									href="{void 0}"
									><Icon
										icon="carbon:building"
										class=" inline"
									/>
									Organization</a
								>
								<ul>
									<li>
										<a
											class="transition-all"
											href="{void 0}"
											><Icon
												icon="carbon:application"
												class=" inline"
											/>
											Application 1</a
										>
										<a
											class="transition-all"
											href="{void 0}"
											><Icon
												icon="carbon:application"
												class=" inline"
											/>
											Application 2</a
										>
										<ul>
											<a
												class="transition-all"
												href="{void 0}"
												><Icon
													icon="carbon:user-role"
													class=" inline"
												/>
												Role</a
											>
											<ul>
												<li>
													<a
														class="transition-all"
														href="{void 0}"
													>
														<!-- user -->
														<Icon
															icon="carbon:user"
															class=" inline"
														/>
														User 1</a
													>
												</li>
												<li>
													<a
														class="transition-all"
														href="{void 0}"
													>
														<!-- user -->
														<Icon
															icon="carbon:user"
															class=" inline"
														/>
														User 2</a
													>
												</li>
											</ul>
										</ul>
									</li>
								</ul>
							</li>
						</ul>
						<span class="border-t-2 py-2">
							Create organizations, applications, and more. Manage your users
							and permissions with ease.
						</span>
					</div>
				</div>
				<div
					class="group card-body place-content-center rounded-3xl border-2 border-primary bg-base-100 p-8 text-base-content shadow-inner"
				>
					<!-- <figure class="h-10">
					<Icon
						icon="carbon:security"
						class="h-full w-full"
					/>
				</figure> -->
					<h2 class="card-title">
						<Icon
							icon="carbon:settings-adjust"
							class="inline"
						/>
						Feature-Packed
					</h2>
					<div class="card-body gap-4 p-1">
						<ul
							class="menu rounded-box menu-sm w-56 transition-all group-hover:menu-md"
						>
							<li><a href="{void 0}">Role/User specific permissions</a></li>
							
						</ul>
						<span class="border-t-2 py-2">
							Create organizations, applications, and more. Manage your users
							and permissions with ease.
						</span>
					</div>
				</div>
			</div>
			<!-- huge button -->
			<div
				class="absolute bottom-[10%] left-1/2 right-1/2 mx-auto w-fit -translate-x-1/2"
			>
				<button
					use:onScroll="{{
						target: '#roadmap'
					}}"
					on:click="{() => {
						// smooth scroll to features
						const features = document.getElementById('roadmap');
						if (features) {
							// scroll 100px above
							features.scrollIntoView({
								behavior: 'smooth',
								block: 'start',
								inline: 'nearest'
							});
						}
					}}"
					class="chonk btn btn-circle btn-neutral btn-outline animate-float rounded-full"
				>
					<Icon
						icon="carbon:chevron-down"
						class="inline"
					/>
				</button>
			</div>
		</section>
		<section
			id="roadmap"
			class="relative flex min-h-screen w-full snap-center flex-col gap-8 py-8"
		>
			<!-- features title -->
			<header
				class="flex w-full flex-col place-content-center place-items-center"
			>
				<!-- up button -->
				<div
					class="absolute left-1/2 right-1/2 top-[0%] mx-auto w-fit -translate-x-1/2"
				>
					<button
						on:click="{() => {
							// scroll to top of page
							const features = document.getElementById('features');
							if (features) {
								// scroll 100px above
								features.scrollIntoView({
									behavior: 'smooth',
									block: 'start',
									inline: 'nearest'
								});
							}
						}}"
						class="chonk btn btn-circle btn-neutral btn-outline animate-float rounded-full"
					>
						<Icon
							icon="carbon:chevron-up"
							class="inline"
						/>
					</button>
				</div>
				<span
					class="text-center font-display text-[5rem] font-semibold sm:text-[9rem] md:text-[10rem] lg:text-[14rem] xl:text-[16rem]"
					>Roadmap.</span
				>
				<div class="h-fit rounded-full px-8 py-4 text-base-content underline">
					<span
						class="text-center text-[1rem] font-semibold sm:text-[2rem] md:text-[1rem] lg:text-[2rem]"
						>On our way to become the #1 auth platform for web3.</span
					>
				</div>
			</header>
			<!-- huge card for title -->
			<div
				class="flex w-full flex-col place-content-center place-items-center gap-8 px-28"
			>
				<ul class="steps steps-vertical">
					<li class="step step-primary">
						<span
							><Icon
								icon="carbon:checkmark"
								class="mr-1 inline"
							/>Developer Satisfaction Testing</span
						>
					</li>
					<li class="step">
						<span
							><Icon
								icon="carbon:blockchain"
								class="mr-1 inline"
							/>Deploy smart contract</span
						>
					</li>
					<li class="step">
						<span
							><Icon
								icon="carbon:rocket"
								class="mr-1 inline"
							/>Convert all logic to be onchain</span
						>
					</li>

					<li class="step">
						<span
							><Icon
								icon="carbon:development"
								class="mr-1 inline"
							/>Develop SDKs for all major frameworks</span
						>
					</li>
				</ul>
			</div>

			<!-- huge button -->
			<div
				class="flex min-h-[50vw] place-content-center place-items-center {cta_hovered
					? ''
					: ''}"
			>
				<a
					href="/app"
					use:hoverAction
					id="cta"
					class="chonk group btn btn-outline btn-lg w-full max-w-screen-sm overflow-hidden rounded-full hover:drop-shadow-glow-solanagreen"
				>
					<span
						class="text-3xl transition-transform group-hover:-translate-x-5"
					>
						Get Started
					</span>
					<figure
						class="inline h-8 w-8 transition-transform group-hover:translate-x-16"
					>
						<Icon
							icon="carbon:arrow-right"
							class="h-full w-full"
						/>
					</figure>
				</a>
			</div>
		</section>
	</main>
</div>
