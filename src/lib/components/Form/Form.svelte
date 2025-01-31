<script lang="ts">
    import { type Snippet } from "svelte";
    import { twMerge } from "tailwind-merge";
    import { type inputType } from "./FormInput.svelte";

    export type props = {
        action: string;
        method?: "POST" | "GET";
        classes?: string;
        children?: Snippet<[]>;
    };

    let { action, method = "POST", classes, children }: props = $props();

    /**
     * Handles the form submission. Gathers the data from all the form components. Prevents the default form submission and sends a fetch request to the action URL.
     *
     * @param event
     * @returns never
     */
    function onSubmit(event: Event) {
        event.preventDefault();

        const form: HTMLFormElement = event.target as HTMLFormElement;
        const formInputs: NodeListOf<HTMLElement> = form.querySelectorAll(".formInput")!;
        const data: { [key: string]: any } = {};

        formInputs.forEach((input: HTMLElement) => {
            const inputType: inputType = input.getAttribute("data-type") as inputType;
            let id: string = input.getAttribute("data-id")!;
            let value: string | number = "";

            if (inputType === "dropdown") {
                const dropdown: HTMLElement = input.querySelector(".dropdown")!;
                value = dropdown.getAttribute("data-value")!;
            } else if (inputType === "textarea") {
                const textarea: HTMLTextAreaElement = input.querySelector("textarea")!;
                value = textarea.value;
            } else {
                const inputElement: HTMLInputElement = input.querySelector("input")!;
                value = inputElement.value;
            }

            data[id] = value;
        });

        fetch(action, {
            method,
            body: JSON.stringify(data),
        });
    }
</script>

<form class={twMerge("space-y-5", classes)} {method} {action} onsubmit={onSubmit}>
    {@render children?.()}
</form>
