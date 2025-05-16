<script lang="ts">
    import { type Snippet } from "svelte";
    import { twMerge } from "tailwind-merge";
    import { type InputType } from "./FormInput.svelte";
    import { getCheckboxFormInputValue } from "./Checkbox.svelte";
    import { getDropdownFormInputValue } from "./Dropdown.svelte";
    import { getEditableListFormInputValue } from "./EditableList/EditableList.svelte";

    let {
        endpoint,
        method = "POST",
        afterSubmit = () => {},
        classes,
        children,
    }: {
        endpoint: string;
        method?: "POST" | "GET" | "PUT";
        afterSubmit?: (status: number, data?: any) => void;
        classes?: string;
        children?: Snippet<[]>;
    } = $props();

    let submitting: boolean = $state.raw(false);
    let form: HTMLFormElement;

    /**
     * Handles the form submission. Gathers the data from all the form components. Prevents the default form submission and sends a fetch request to the endpoint.
     *
     * @param event The form submission event.
     * @returns never
     */
    async function onSubmit(event: Event) {
        event.preventDefault();

        if (submitting) return;

        submitting = true;

        const inputs: NodeListOf<HTMLElement> = form.querySelectorAll(
            ".FormInput"
        ) as NodeListOf<HTMLElement>;
        const data: { [key: string]: any } = {};

        inputs.forEach((inputContainer: HTMLElement) => {
            const type: InputType = inputContainer.getAttribute("data-type") as InputType;
            const id: string = inputContainer.getAttribute("data-id")!;
            let value: any;

            switch (type) {
                case "editableList":
                    value = getEditableListFormInputValue(inputContainer);
                    break;
                case "dropdown": {
                    value = getDropdownFormInputValue(inputContainer);
                    break;
                }
                case "checkbox": {
                    value = getCheckboxFormInputValue(inputContainer);
                    break;
                }
                case "custom": {
                    const format = (inputContainer.getAttribute("data-type") ?? "string") as
                        | "json"
                        | "string"
                        | "number";
                    const inputValue: string = inputContainer.getAttribute("data-value") ?? "";

                    switch (format) {
                        case "json":
                            value = JSON.parse(inputValue);
                            break;
                        case "number":
                            value = parseInt(inputValue);
                            break;
                        default:
                            value = inputValue;
                            break;
                    }

                    break;
                }
                default: {
                    const element: HTMLInputElement | HTMLTextAreaElement =
                        inputContainer.querySelector(".Input") as
                            | HTMLInputElement
                            | HTMLTextAreaElement;
                    value = element.value;
                    break;
                }
            }

            data[id] = typeof value === "string" ? value.trim() : value;
        });

        const response: Response = await fetch(endpoint, {
            method,
            body: JSON.stringify(data),
        });

        // If the response is 204 (No Content), we don't expect any JSON response body.
        afterSubmit(
            response.status,
            response.ok && response.status !== 204 ? await response.json() : {}
        );

        submitting = false;
    }
</script>

<form
    class={twMerge("space-y-5", classes)}
    style:pointer-events={submitting ? "none" : "auto"}
    onsubmit={onSubmit}
    autocomplete="off"
    data-submitting={submitting}
    bind:this={form}
>
    {@render children?.()}
</form>
