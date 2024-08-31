import {
	type ComponentProps,
	type ComponentType,
	type SvelteComponent,
	getContext,
	setContext
} from 'svelte';
import { type Writable, writable } from 'svelte/store';

type DrawerStore = {
	component: ComponentType;
	props: Record<string, unknown>;
};

const drawerStore = () => {
	const stack: DrawerStore[] = [];
	const store = writable<DrawerStore[]>(stack);

	const push = <T extends SvelteComponent>(
		component: ComponentType<T>,
		props: ComponentProps<T>
	) => {
		// if the new component is the same as the current component, don't push it
		if (stack.length > 0 && stack[stack.length - 1].component === component) {
			// return existing index
			return stack.length - 1
		}
		stack.push({ component, props });
		store.set([...stack]);
		// return the index
		return stack.length - 1;
	};

	const pop = () => {
		stack.pop();
		store.set([...stack]);
	};

	const remove = (index: number) => {
		stack.splice(index, 1);
		store.set([...stack]);
	};

	const unset = () => {
		stack.length = 0;
		store.set([]);
	};

	return {
		pop,
		push,
		remove,
		subscribe: store.subscribe,
		unset
	};
};

export function setDrawer() {
	const store = drawerStore();
	setContext('drawer', store);
}

export function setDrawerOpen() {
	const drawer_open = writable<boolean>(true);
	setContext('drawer_open', drawer_open);
}

export function getDrawer() {
	return getContext<ReturnType<typeof drawerStore>>('drawer');
}

export function getDrawerOpen() {
	return getContext<Writable<boolean>>('drawer_open');
}

export function setWalletConnectVisible() {
	const wallet_connect = writable<boolean>(false);
	setContext('wallet_connect_visible', wallet_connect);
}

export function get_wallet_connect_visible() {
	return getContext<Writable<boolean>>('wallet_connect_visible');
}
