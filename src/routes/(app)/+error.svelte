<script lang="ts">
    import { page } from "$app/state";
    import { ResponseCodes } from "$lib/utils/apiResponses";

    const messages: Record<number, { title: string; message: string }> = {
        [ResponseCodes.NotFound]: {
            title: "Nothing to See Here…",
            message: "Except maybe your reflection in the screen.",
        },
        [ResponseCodes.ServerError]: {
            title: "Well, that escalated quickly...",
            message: "Something went kaboom 💥 behind the scenes.",
        },
        [ResponseCodes.Unauthorized]: {
            title: "You're Not on the List 📋",
            message: "This area’s VIP only. Flash your login credentials at the door.",
        },
        [ResponseCodes.UserUnauthorized]: {
            title: "Whoa there, Scholar!",
            message: "Access denied. Maybe the answer lies elsewhere?",
        },
    };
</script>

<div class="h-full w-full pt-[25%] text-center">
    <div class="page-title">
        <p class="title">{messages[page.status].title}</p>
        <p class="description">{messages[page.status].message}</p>
    </div>
</div>
