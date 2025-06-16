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
    fields: Record<string, unknown>;
};

export let formContextKey: Symbol = Symbol("formContextKey");
