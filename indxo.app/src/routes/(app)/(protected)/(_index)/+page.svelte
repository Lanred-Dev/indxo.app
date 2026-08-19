<script lang="ts">
    import { getContext, onMount } from "svelte";
    import { innerHeight } from "svelte/reactivity/window";
    import type { SessionContext, HeaderContext } from "$lib/utils/global";
    import { greetings, type GreetingMessage, TimeOfDay } from "$lib/data/ui/home/grettings";
    import randomArrayEntry from "$lib/utils/randomArrayEntry";

    const session: SessionContext = getContext("session");
    const header: HeaderContext = getContext("header");

    let currentHour: number = $state.raw(new Date().getHours());
    let greeting: GreetingMessage = $derived.by(() => {
        let greeting: GreetingMessage;

        if (currentHour >= 5 && currentHour < 12)
            greeting = randomArrayEntry(greetings[TimeOfDay.morning]);
        else if (currentHour >= 12 && currentHour < 17)
            greeting = randomArrayEntry(greetings[TimeOfDay.afternoon]);
        else if (currentHour >= 17 && currentHour < 22)
            greeting = randomArrayEntry(greetings[TimeOfDay.evening]);
        else greeting = randomArrayEntry(greetings[TimeOfDay.night]);

        greeting.title = greeting.title.replace("{name}", session.user.name.split(" ")[0]);
        return greeting;
    });

    onMount(() => {
        const hourUpdateInterval = setInterval(() => {
            currentHour = new Date().getHours();
        }, 60000);

        return () => {
            clearInterval(hourUpdateInterval);
        };
    });
</script>

<div class="page-title">
    <h1 class="title">{greeting.title}</h1>
    <p class="subtitle">{greeting.subtitle}</p>
</div>
