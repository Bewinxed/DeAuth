<script lang="ts">
	import { getDrawer } from '$components/context';

	let counter = 0;
	const store = getDrawer();
</script>

<button
	class="btn btn-sm"
	on:click={() => {
		counter = counter + 1;
		console.log(counter);
		console.log($store);
	}}>{counter}</button
>
<button
	class="btn btn-sm"
	on:click={() => {
		console.log('nigger');
	}}>N-Pass Btn</button
>
