export { default as Form } from "./Form.svelte";
export { default as FormInput } from "./Input.svelte";
export { default as FormSubmit } from "./Submit.svelte";

export enum FormSubmitMethods {
    post = "POST",
    put = "PUT",
    delete = "DELETE",
}

export type FormContext = () => {
    submitting: boolean;
    fieldValues: Map<string, { value: unknown; label?: string }>;
    registerValue: (id: string, value: unknown, optional: boolean, label?: string) => void;
};

export let formContextKey: Symbol = Symbol("formContextKey");
