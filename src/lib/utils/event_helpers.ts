export function customDispatch(e: Event, name: string, detail = undefined) {
    e.target?.dispatchEvent(new window.CustomEvent(name, { bubbles: true, detail }));
}

export async function formPromise(e: Event, form: HTMLFormElement, promise: () => (Promise<unknown>)) {
    e.preventDefault();
    e.stopPropagation();
    return promise;
}