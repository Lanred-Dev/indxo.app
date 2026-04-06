export { default as SegmentedButton } from "./Button.svelte";
export { default as SegmentedButtonGroup } from "./SegmentedButtonGroup.svelte";

export interface SegmentedButtonGroupContext {
    value: string;
    hovering: string | null;
    forceUpdateSelector: () => void;
}

export let segmentedButtonGroupContextKey: Symbol = Symbol("segmentedButtonGroupContextKey");
