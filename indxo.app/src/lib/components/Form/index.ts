export { default as FormContent } from "./Content.svelte";
export { default as Form } from "./Form.svelte";
export { default as FormInput } from "./Input.svelte";
export { default as FormSubmit } from "./Submit.svelte";
export { default as FormTitle } from "./Title.svelte";

export enum FormSubmitMethods {
    post = "POST",
    put = "PUT",
    delete = "DELETE",
}

export interface FormContext {
    isSubmitting: boolean;
    fields: Map<string, { value: unknown; label?: string }>;
    stage: string | null;
    registerField: (id: string, value: unknown, isRequired: boolean, label?: string) => void;
    removeField: (id: string) => void;
}

export let formContextKey: Symbol = Symbol("formContextKey");
