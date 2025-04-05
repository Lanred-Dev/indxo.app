<script lang="ts">
    import { type Snippet } from "svelte";
    import { twMerge } from "tailwind-merge";
    import { type inputType } from "./FormInput.svelte";

    export type props = {
        action: string;
        method?: "POST" | "GET" | "PUT";
        afterSubmit?: (status: number, data?: any) => void;
        classes?: string;
        children?: Snippet<[]>;
    };

    let { action, method = "POST", afterSubmit = () => {}, classes, children }: props = $props();
    let submitting: boolean = $state(false);

    /**
     * Handles the form submission. Gathers the data from all the form components. Prevents the default form submission and sends a fetch request to the action URL.
     *
     * @param event
     * @returns never
     */
    async function onSubmit(event: Event) {
        event.preventDefault();

        if (submitting) return;

        submitting = true;

        const form: HTMLFormElement = event.target as HTMLFormElement;
        const formInputs: NodeListOf<HTMLElement> = form.querySelectorAll(".formInput")!;
        const data: { [key: string]: any } = {};

        formInputs.forEach((input: HTMLElement) => {
            const inputType: inputType = input.getAttribute("data-type") as inputType;
            const id: string = input.getAttribute("data-id")!;
            let value: any;

            switch (inputType) {
                case "editableList":
                    const editableList: HTMLElement = input.querySelector(".editableList")!;
                    const listItems: NodeListOf<HTMLElement> =
                        editableList.querySelectorAll(".editableListItem")!;
                    const listData: { [key: number]: any }[] = [];

                    // Note: `1` is a placeholder value for items that don't have data.
                    for (const item of listItems) {
                        const listID: number = parseInt(item.getAttribute("data-listID")!);
                        const hasData: boolean = item.getAttribute("data-hasValue") === "true";
                        let itemValue: any = "1";

                        if (hasData) {
                            itemValue = JSON.parse(item.getAttribute("data-value")!);

                            const _id: string | null = item.getAttribute("data-id");
                            itemValue._id = _id ?? undefined;
                        }

                        listData[listID] = itemValue;
                    }

                    value = listData.filter((item) => item !== "1");
                    break;
                case "dropdown": {
                    const dropdown: HTMLElement = input.querySelector(".dropdown")!;
                    value = dropdown.getAttribute("data-value")!;
                    break;
                }
                case "checkbox": {
                    const checkbox: HTMLElement = input.querySelector(".checkbox")!;
                    value = checkbox.getAttribute("data-value") === "true";
                    break;
                }
                case "textarea": {
                    const textarea: HTMLTextAreaElement = input.querySelector("textarea")!;
                    value = textarea.value;
                    break;
                }
                case "custom": {
                    const dataElement: HTMLElement = input.querySelector(".data")!;
                    const dataType = (dataElement.getAttribute("data-type") ?? "string") as
                        | "json"
                        | "string"
                        | "number";
                    const dataValue: string = dataElement.getAttribute("data-value") ?? "";
                    value =
                        dataType === "json"
                            ? JSON.parse(dataValue)
                            : dataType === "number"
                              ? parseInt(dataValue)
                              : dataValue;
                    break;
                }
                default: {
                    const inputElement: HTMLInputElement = input.querySelector("input")!;
                    value = inputElement.value;
                    break;
                }
            }

            if (typeof value === "string") value = value.trim();

            data[id] = value;
        });

        const response = await fetch(action, {
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
    {action}
    onsubmit={onSubmit}
    autocomplete="off"
    data-submitting={submitting}
>
    {@render children?.()}
</form>
